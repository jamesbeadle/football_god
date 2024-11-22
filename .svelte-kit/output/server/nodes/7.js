

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.tNNsOgDe.js","_app/immutable/chunks/index.BF85B58K.js","_app/immutable/chunks/vendor.DniB5keO.js"];
export const stylesheets = ["_app/immutable/assets/index.Bt7u38ia.css"];
export const fonts = [];
