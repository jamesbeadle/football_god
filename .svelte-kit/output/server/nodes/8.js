

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.D9i_-S_M.js","_app/immutable/chunks/index.BF85B58K.js","_app/immutable/chunks/vendor.DniB5keO.js"];
export const stylesheets = ["_app/immutable/assets/index.Bt7u38ia.css"];
export const fonts = [];
