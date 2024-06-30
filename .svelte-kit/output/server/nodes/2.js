

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CBYxb7be.js","_app/immutable/chunks/index.B7cO0yhj.js","_app/immutable/chunks/vendor.HQOvHlQQ.js"];
export const stylesheets = ["_app/immutable/assets/index.B5QBpQlE.css"];
export const fonts = [];
