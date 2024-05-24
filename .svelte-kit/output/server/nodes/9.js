

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.R8gZIY2F.js","_app/immutable/chunks/index.BtN87BVB.js","_app/immutable/chunks/vendor.CwTqq7k6.js"];
export const stylesheets = ["_app/immutable/assets/index.CScxpvdQ.css"];
export const fonts = [];
