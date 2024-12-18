

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.i0ew-tMS.js","_app/immutable/chunks/index.tynDP7h2.js","_app/immutable/chunks/vendor.K9QmxsDu.js"];
export const stylesheets = ["_app/immutable/assets/index.-u_DXI70.css"];
export const fonts = [];
