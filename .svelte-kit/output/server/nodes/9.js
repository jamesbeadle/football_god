

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.Cpw9o0Op.js","_app/immutable/chunks/index.Qgq9WxvU.js","_app/immutable/chunks/vendor.DyrOImMY.js"];
export const stylesheets = ["_app/immutable/assets/index.C6uVAY0B.css"];
export const fonts = [];
