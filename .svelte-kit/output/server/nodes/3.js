

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C8VJNdnn.js","_app/immutable/chunks/index.B7cO0yhj.js","_app/immutable/chunks/vendor.HQOvHlQQ.js"];
export const stylesheets = ["_app/immutable/assets/index.B5QBpQlE.css"];
export const fonts = [];
