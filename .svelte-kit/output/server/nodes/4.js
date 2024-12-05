

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.DDe_VAcH.js","_app/immutable/chunks/index.UJqspJr5.js","_app/immutable/chunks/vendor.BMxqKWS1.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
