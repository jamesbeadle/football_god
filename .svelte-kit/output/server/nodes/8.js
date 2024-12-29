

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.BUpFk_1x.js","_app/immutable/chunks/index.CRAtfHL7.js","_app/immutable/chunks/vendor.C6S_fHtB.js"];
export const stylesheets = ["_app/immutable/assets/index.CYPGhwrW.css"];
export const fonts = [];
