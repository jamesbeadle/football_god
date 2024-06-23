

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/gift-euro-entry/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.C6XVSlnK.js","_app/immutable/chunks/index.C0cHXlGl.js","_app/immutable/chunks/vendor.BzpF_IZ2.js"];
export const stylesheets = ["_app/immutable/assets/index.K5qbkQve.css"];
export const fonts = [];
