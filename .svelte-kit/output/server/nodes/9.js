

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.D3Ln6WnU.js","_app/immutable/chunks/index.BCZJQZks.js","_app/immutable/chunks/vendor.B8YRBMZG.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
