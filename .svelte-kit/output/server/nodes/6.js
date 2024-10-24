

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CKQfNiDF.js","_app/immutable/chunks/index.CuPGCJQS.js","_app/immutable/chunks/vendor.CXpuTX34.js"];
export const stylesheets = ["_app/immutable/assets/index.BtbxdCpR.css"];
export const fonts = [];
