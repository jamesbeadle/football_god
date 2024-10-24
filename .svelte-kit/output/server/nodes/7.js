

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.DA9kDIEm.js","_app/immutable/chunks/index.CuPGCJQS.js","_app/immutable/chunks/vendor.CXpuTX34.js"];
export const stylesheets = ["_app/immutable/assets/index.BtbxdCpR.css"];
export const fonts = [];
