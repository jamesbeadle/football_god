

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DQHf8G9C.js","_app/immutable/chunks/index.Cqnh8SHF.js","_app/immutable/chunks/vendor.DquZNfX3.js"];
export const stylesheets = ["_app/immutable/assets/index.0XBRf2S-.css"];
export const fonts = [];
