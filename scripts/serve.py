"""Serve only demo/ on localhost, with byte ranges for the PMTiles archive."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re


class RangeHandler(SimpleHTTPRequestHandler):
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
