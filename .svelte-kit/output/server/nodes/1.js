

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BPuQ5xgt.js","_app/immutable/chunks/index.Cu8k3ALr.js","_app/immutable/chunks/vendor.lENxg6Bi.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
