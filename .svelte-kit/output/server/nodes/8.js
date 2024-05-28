

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.CWZim42Q.js","_app/immutable/chunks/index.lCi7faP8.js","_app/immutable/chunks/vendor.B3gZnYav.js"];
export const stylesheets = ["_app/immutable/assets/index.DXdtVKER.css"];
export const fonts = [];
