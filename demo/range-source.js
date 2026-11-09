import { EtagMismatch } from "https://cdn.jsdelivr.net/npm/pmtiles@4.5.0/+esm";

// Implements PMTiles' public Source interface. No global fetch interception.
export class RangeSource {
  constructor(url, notify) {
    this.url = url;
    this.notify = notify;
    this.controller = new AbortController();
    this.records = [];
    this.stats = { requests: 0, bytes: 0, tileRequests: 0, missingTiles: 0 };
    this.totalSize = null;
  }

  getKey() { return this.url; }

  async getBytes(offset, length, signal, etag) {
    const record = {
      id: ++this.stats.requests, start: offset, end: offset + length - 1,
      bytes: 0, status: "…", ms: null, contentRange: "", error: "",
    };
    this.records.push(record);
    if (this.records.length > 200) this.records.shift();
    const started = performance.now();
    this.notify();
    try {
      const response = await fetch(this.url, {
        headers: { Range: `bytes=${record.start}-${record.end}` },
        signal: AbortSignal.any([this.controller.signal, signal].filter(Boolean)),
        cache: "no-store",
      });
      record.status = response.status;
      record.contentRange = response.headers.get("Content-Range") || "";
      if (response.status !== 206) {
        await response.body?.cancel();
        if (response.status === 416) throw new EtagMismatch("The archive changed or the range does not exist");
        throw new Error(`HTTP ${response.status}: expected a partial 206 response`);
      }
      const parts = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(record.contentRange);
      if (!parts || Number(parts[1]) !== offset || Number(parts[2]) > record.end) {
        await response.body?.cancel();
        throw new Error("Content-Range does not match the request");
      }
      this.totalSize = Number(parts[3]);
      const rawEtag = response.headers.get("ETag");
      const actualEtag = rawEtag && !rawEtag.startsWith("W/") ? rawEtag : undefined;
      if (etag && actualEtag && etag !== actualEtag) {
        await response.body?.cancel();
        throw new EtagMismatch("The archive ETag changed");
      }
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        record.bytes += value.byteLength;
        this.stats.bytes += value.byteLength;
        if (record.bytes > length) {
          await reader.cancel();
          throw new Error("The response exceeds the requested range");
        }
        chunks.push(value);
        this.notify();
      }
      if (record.bytes !== Number(parts[2]) - offset + 1) throw new Error("Incomplete range response");
      const data = new Uint8Array(record.bytes);
      let position = 0;
      for (const chunk of chunks) { data.set(chunk, position); position += chunk.length; }
      return {
        data: data.buffer, etag: actualEtag,
        cacheControl: response.headers.get("Cache-Control") || undefined,
        expires: response.headers.get("Expires") || undefined,
      };
    } catch (error) {
      if (error.name === "AbortError") record.status = "Canceled";
      record.error = error.message;
      throw error;
    } finally {
      record.ms = Math.round(performance.now() - started);
      this.notify();
    }
  }
}
