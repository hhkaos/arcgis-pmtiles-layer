"""Serve only demo/ on localhost, with byte ranges for the PMTiles archive."""

from functools import partial
from http.client import HTTPException
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import HTTPRedirectHandler, Request, build_opener
import re

WORLD_URL = "https://latest.protomaps.com/v4.pmtiles"
MAX_RANGE = 8 * 1024 * 1024


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        return None


class RangeHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/world.pmtiles":
            return super().do_GET()
        match = re.fullmatch(r"bytes=(\d+)-(\d+)", self.headers.get("Range", ""))
        if not match:
            return self.send_error(400, "A bounded Range header is required")
        start, end = map(int, match.groups())
        if not 0 < end - start + 1 <= MAX_RANGE:
            return self.send_error(400, "Range must be between 1 byte and 8 MiB")
        request = Request(WORLD_URL, headers={
            "Range": f"bytes={start}-{end}", "Accept-Encoding": "identity",
            "User-Agent": "arcgis-pmtiles-personal-poc/0.1",
        })
        try:
            # Fixed public target only; no supplied URL, credentials or redirects.
            with build_opener(NoRedirect).open(request, timeout=20) as upstream:
                content_range = upstream.headers.get("Content-Range", "")
                parts = re.fullmatch(r"bytes (\d+)-(\d+)/(\d+)", content_range)
                size = int(upstream.headers.get("Content-Length", "0"))
                if (upstream.status != 206 or not parts
                        or int(parts[1]) != start or int(parts[2]) > end
                        or not 0 < size <= end - start + 1
                        or int(parts[2]) - start + 1 != size
                        or upstream.headers.get("Content-Encoding", "identity") != "identity"):
                    return self.send_error(502, "Upstream did not return the requested byte range")
                # Buffer at most MAX_RANGE before forwarding validated headers.
                data = upstream.read(size)
                if len(data) != size:
                    return self.send_error(502, "Incomplete upstream range")
                self.send_response(206)
                for name in ("Content-Type", "Content-Length", "Content-Range", "ETag"):
                    if upstream.headers.get(name):
                        self.send_header(name, upstream.headers[name])
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(data)
        except HTTPError as error:
            if error.code == 416:
                self.send_response(416)
                if error.headers.get("Content-Range"):
                    self.send_header("Content-Range", error.headers["Content-Range"])
                self.end_headers()
            else:
                self.send_error(502, f"Upstream HTTP {error.code}")
        except (BrokenPipeError, ConnectionResetError):
            pass  # The browser may cancel obsolete tiles.
        except (URLError, OSError, HTTPException, ValueError) as error:
            self.send_error(502, f"Upstream read failed: {type(error).__name__}")

    def do_HEAD(self):
        if self.path == "/world.pmtiles":
            self.send_error(405, "Use GET with a bounded Range header")
        else:
            super().do_HEAD()

    def send_head(self):
        self.remaining = None
        if not self.path.split("?", 1)[0].endswith(".pmtiles"):
            return super().send_head()
        path = Path(self.translate_path(self.path))
        if not path.is_file():
            self.send_error(404, "Run scripts/download-data.sh first")
            return None
        size = path.stat().st_size
        header = self.headers.get("Range")
        start, end = 0, size - 1
        if header:
            match = re.fullmatch(r"bytes=(\d+)-(\d*)", header)
            if not match:
                self.send_error(416)
                return None
            start = int(match[1])
            end = min(int(match[2]) if match[2] else end, end)
            if start > end:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return None
        stream = path.open("rb")
        stream.seek(start)
        self.remaining = end - start + 1
        self.send_response(206 if header else 200)
        self.send_header("Content-Type", "application/vnd.pmtiles")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(self.remaining))
        self.send_header("Cache-Control", "no-cache")
        if header:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        if self.remaining is None:
            return super().copyfile(source, outputfile)
        while self.remaining:
            chunk = source.read(min(65536, self.remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            self.remaining -= len(chunk)


if __name__ == "__main__":
    demo = Path(__file__).resolve().parent.parent / "demo"
    server = ThreadingHTTPServer(
        ("127.0.0.1", 8000), partial(RangeHandler, directory=str(demo))
    )
    print("PoC: http://127.0.0.1:8000/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
