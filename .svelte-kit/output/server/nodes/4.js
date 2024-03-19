

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CY9UZh0G.js","_app/immutable/chunks/index.Cu8k3ALr.js","_app/immutable/chunks/vendor.lENxg6Bi.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
