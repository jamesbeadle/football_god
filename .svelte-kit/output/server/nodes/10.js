

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/whitepaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BsxzTLyv.js","_app/immutable/chunks/index.C0cHXlGl.js","_app/immutable/chunks/vendor.BzpF_IZ2.js"];
export const stylesheets = ["_app/immutable/assets/index.K5qbkQve.css"];
export const fonts = [];
