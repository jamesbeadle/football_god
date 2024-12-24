

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DL4LGOKw.js","_app/immutable/chunks/index.Qgq9WxvU.js","_app/immutable/chunks/vendor.DyrOImMY.js"];
export const stylesheets = ["_app/immutable/assets/index.C6uVAY0B.css"];
export const fonts = [];
