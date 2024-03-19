

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/whitepaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.w7kKKe1M.js","_app/immutable/chunks/index.Cu8k3ALr.js","_app/immutable/chunks/vendor.lENxg6Bi.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
