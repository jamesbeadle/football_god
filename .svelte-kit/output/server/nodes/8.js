

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.DgZrnH76.js","_app/immutable/chunks/index.Bg0A2oTy.js","_app/immutable/chunks/vendor.D-PEOVsX.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
