

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.Ci-sKi31.js","_app/immutable/chunks/index.D6LryO9O.js","_app/immutable/chunks/vendor.DAVOOr3e.js"];
export const stylesheets = ["_app/immutable/assets/index.CrKHZjHm.css"];
export const fonts = [];
