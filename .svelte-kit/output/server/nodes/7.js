

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/gift-euro-entry/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.CkrnC7pe.js","_app/immutable/chunks/index.BGy6ezKk.js","_app/immutable/chunks/vendor.DpDJDq4E.js"];
export const stylesheets = ["_app/immutable/assets/index.CxFGGsA5.css"];
export const fonts = [];
