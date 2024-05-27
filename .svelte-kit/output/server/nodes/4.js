

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CDLix55E.js","_app/immutable/chunks/index.D6LryO9O.js","_app/immutable/chunks/vendor.DAVOOr3e.js"];
export const stylesheets = ["_app/immutable/assets/index.CrKHZjHm.css"];
export const fonts = [];
