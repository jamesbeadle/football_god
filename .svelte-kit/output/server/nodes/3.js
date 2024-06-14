

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.FPOZwCFX.js","_app/immutable/chunks/index.C-gF-O1A.js","_app/immutable/chunks/vendor.CmWuVfOa.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
