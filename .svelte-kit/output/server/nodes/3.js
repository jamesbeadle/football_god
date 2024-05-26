

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DpwWn6d5.js","_app/immutable/chunks/index.DkI9z6_I.js","_app/immutable/chunks/vendor.tF8zXmIJ.js"];
export const stylesheets = ["_app/immutable/assets/index.DDmig223.css"];
export const fonts = [];
