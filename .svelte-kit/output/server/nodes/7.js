

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.DAng4_T9.js","_app/immutable/chunks/index.azTQqeUE.js","_app/immutable/chunks/vendor.tTPl8uX_.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
