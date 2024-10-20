

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BtN9dwgb.js","_app/immutable/chunks/index.TPYDmGT9.js","_app/immutable/chunks/vendor.CQDvisxt.js"];
export const stylesheets = ["_app/immutable/assets/index.CSN47-Hr.css"];
export const fonts = [];
