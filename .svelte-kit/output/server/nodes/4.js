

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.xbKFG2XI.js","_app/immutable/chunks/index.CuPGCJQS.js","_app/immutable/chunks/vendor.CXpuTX34.js"];
export const stylesheets = ["_app/immutable/assets/index.BtbxdCpR.css"];
export const fonts = [];
