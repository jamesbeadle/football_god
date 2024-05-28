

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.T8Tbqm9O.js","_app/immutable/chunks/index.lCi7faP8.js","_app/immutable/chunks/vendor.B3gZnYav.js"];
export const stylesheets = ["_app/immutable/assets/index.DXdtVKER.css"];
export const fonts = [];
