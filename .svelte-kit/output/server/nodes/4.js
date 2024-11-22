

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CkTz2CuW.js","_app/immutable/chunks/index.BF85B58K.js","_app/immutable/chunks/vendor.DniB5keO.js"];
export const stylesheets = ["_app/immutable/assets/index.Bt7u38ia.css"];
export const fonts = [];
