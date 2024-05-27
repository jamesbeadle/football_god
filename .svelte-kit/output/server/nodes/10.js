

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.DXtfTjGP.js","_app/immutable/chunks/index.Cqnh8SHF.js","_app/immutable/chunks/vendor.DquZNfX3.js"];
export const stylesheets = ["_app/immutable/assets/index.0XBRf2S-.css"];
export const fonts = [];
