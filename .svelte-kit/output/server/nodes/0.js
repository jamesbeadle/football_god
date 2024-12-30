

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.B4KrwVi5.js","_app/immutable/chunks/index.4nVbvbVT.js","_app/immutable/chunks/vendor.Dv0lZk97.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
