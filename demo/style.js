// Diagnostic cartography for the known Protomaps schemas; no glyphs or sprites.
export function createStyle(sourceUrl, layerNames) {
  const fill = (id, color, extra = {}) => ({
    id, type: "fill", source: "pmtiles", "source-layer": id,
    paint: { "fill-color": color, ...extra },
  });
  const line = (id, color, width) => ({
    id, type: "line", source: "pmtiles", "source-layer": id,
    paint: { "line-color": color, "line-width": width },
  });
  return {
    version: 8,
    sources: { pmtiles: { type: "vector", url: sourceUrl } },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#aad2e0" } },
      ...[
        fill("earth", "#f2efe9"),
        fill("landcover", "#d6e1c6", { "fill-opacity": 0.55 }),
        fill("natural", "#c9d9ad", { "fill-opacity": 0.7 }),
        fill("landuse", "#e3dfcf", { "fill-opacity": 0.6 }),
        fill("water", "#aad2e0"),
        fill("buildings", "#c4ad98", { "fill-outline-color": "#aa927d" }),
        line("roads", "#ffffff", 1.8),
        line("boundaries", "#9396ab", 0.7),
      ].filter((layer) => layerNames.includes(layer["source-layer"])),
    ],
  };
}
