

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.KxkpoiOj.js","_app/immutable/chunks/index.Qgq9WxvU.js","_app/immutable/chunks/vendor.DyrOImMY.js"];
export const stylesheets = ["_app/immutable/assets/index.C6uVAY0B.css"];
export const fonts = [];
