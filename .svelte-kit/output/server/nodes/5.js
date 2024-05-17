

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.AO_rsBN2.js","_app/immutable/chunks/index.8OvprEYt.js","_app/immutable/chunks/vendor.5EGZ7AZB.js"];
export const stylesheets = ["_app/immutable/assets/index.D7eaxdDC.css"];
export const fonts = [];
