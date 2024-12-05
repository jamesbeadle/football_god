

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.M8xx4zLS.js","_app/immutable/chunks/index.UJqspJr5.js","_app/immutable/chunks/vendor.BMxqKWS1.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
