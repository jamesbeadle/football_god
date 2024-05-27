

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Bk-bP6jY.js","_app/immutable/chunks/index.DXjgZ5fr.js","_app/immutable/chunks/vendor.Dsq-8qgF.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
