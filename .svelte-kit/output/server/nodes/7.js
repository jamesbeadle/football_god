

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/presale/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BkuzLhCE.js","_app/immutable/chunks/index.SnITFYT6.js","_app/immutable/chunks/vendor.BEsDHGUX.js"];
export const stylesheets = ["_app/immutable/assets/index.BUmMB-3-.css"];
export const fonts = [];
