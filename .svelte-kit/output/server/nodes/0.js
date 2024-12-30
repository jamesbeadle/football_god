

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.D7vf2f-T.js","_app/immutable/chunks/index.azTQqeUE.js","_app/immutable/chunks/vendor.tTPl8uX_.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
