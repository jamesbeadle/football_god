

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BEy1Fp7F.js","_app/immutable/chunks/index.C-gF-O1A.js","_app/immutable/chunks/vendor.CmWuVfOa.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
