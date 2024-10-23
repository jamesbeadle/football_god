

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CLqflpdF.js","_app/immutable/chunks/index.BkeK0Bng.js","_app/immutable/chunks/vendor.DrfXxipA.js"];
export const stylesheets = ["_app/immutable/assets/index.BjsZ1T7E.css"];
export const fonts = [];
