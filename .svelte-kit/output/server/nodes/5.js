

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.b0rWrUSI.js","_app/immutable/chunks/index.BGy6ezKk.js","_app/immutable/chunks/vendor.DpDJDq4E.js"];
export const stylesheets = ["_app/immutable/assets/index.CxFGGsA5.css"];
export const fonts = [];
