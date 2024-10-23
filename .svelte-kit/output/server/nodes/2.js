

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CPJivrKF.js","_app/immutable/chunks/index.BkeK0Bng.js","_app/immutable/chunks/vendor.DrfXxipA.js"];
export const stylesheets = ["_app/immutable/assets/index.BjsZ1T7E.css"];
export const fonts = [];
