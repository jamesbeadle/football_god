

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.Dab2WdKf.js","_app/immutable/chunks/index.CIcVlp8P.js","_app/immutable/chunks/vendor.DIu6ILCq.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
