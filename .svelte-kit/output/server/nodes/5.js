

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.B7pnko7M.js","_app/immutable/chunks/index.D3LagQVi.js","_app/immutable/chunks/vendor.DAZ-CwTY.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
