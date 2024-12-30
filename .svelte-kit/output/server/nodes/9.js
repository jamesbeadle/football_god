

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.0JdWFvfO.js","_app/immutable/chunks/index.4nVbvbVT.js","_app/immutable/chunks/vendor.Dv0lZk97.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
