

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.2I3qqNO4.js","_app/immutable/chunks/index.tynDP7h2.js","_app/immutable/chunks/vendor.K9QmxsDu.js"];
export const stylesheets = ["_app/immutable/assets/index.-u_DXI70.css"];
export const fonts = [];
