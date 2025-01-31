

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BN7q6Q4D.js","_app/immutable/chunks/index.Cnt5oXJn.js","_app/immutable/chunks/vendor.DwAtPDgU.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
