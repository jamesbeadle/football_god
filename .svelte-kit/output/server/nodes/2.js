

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CcWe66wH.js","_app/immutable/chunks/index.Bg0A2oTy.js","_app/immutable/chunks/vendor.D-PEOVsX.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
