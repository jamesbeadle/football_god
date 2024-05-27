

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.TnOSIrNP.js","_app/immutable/chunks/index.BAyXST7J.js","_app/immutable/chunks/vendor.DmHkI8Py.js"];
export const stylesheets = ["_app/immutable/assets/index.CTG9qjY3.css"];
export const fonts = [];
