

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0._gJZ5-Fj.js","_app/immutable/chunks/index.C0cHXlGl.js","_app/immutable/chunks/vendor.BzpF_IZ2.js"];
export const stylesheets = ["_app/immutable/assets/index.K5qbkQve.css"];
export const fonts = [];
