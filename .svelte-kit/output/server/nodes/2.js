

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Bq42jzMY.js","_app/immutable/chunks/index.C0cHXlGl.js","_app/immutable/chunks/vendor.BzpF_IZ2.js"];
export const stylesheets = ["_app/immutable/assets/index.K5qbkQve.css"];
export const fonts = [];
