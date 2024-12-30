

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Du_0MuQx.js","_app/immutable/chunks/index.C28upqMo.js","_app/immutable/chunks/vendor.lFHWnQi0.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
