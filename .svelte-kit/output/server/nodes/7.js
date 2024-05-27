

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7._XCuWJ_3.js","_app/immutable/chunks/index.D6LryO9O.js","_app/immutable/chunks/vendor.DAVOOr3e.js"];
export const stylesheets = ["_app/immutable/assets/index.CrKHZjHm.css"];
export const fonts = [];
