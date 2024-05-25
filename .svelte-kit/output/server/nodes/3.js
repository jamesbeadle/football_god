

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Z4XlDC2M.js","_app/immutable/chunks/index.Cj7Rp3vF.js","_app/immutable/chunks/vendor.C0IfeU0o.js"];
export const stylesheets = ["_app/immutable/assets/index.D5fZHd_6.css"];
export const fonts = [];
