

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CjhXywmS.js","_app/immutable/chunks/index.BGy6ezKk.js","_app/immutable/chunks/vendor.DpDJDq4E.js"];
export const stylesheets = ["_app/immutable/assets/index.CxFGGsA5.css"];
export const fonts = [];
