

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Cd3kPqIr.js","_app/immutable/chunks/index.BF85B58K.js","_app/immutable/chunks/vendor.DniB5keO.js"];
export const stylesheets = ["_app/immutable/assets/index.Bt7u38ia.css"];
export const fonts = [];
