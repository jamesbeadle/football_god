

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DMP9ZkWC.js","_app/immutable/chunks/index.BtN87BVB.js","_app/immutable/chunks/vendor.CwTqq7k6.js"];
export const stylesheets = ["_app/immutable/assets/index.CScxpvdQ.css"];
export const fonts = [];
