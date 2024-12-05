

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.El4e2yAR.js","_app/immutable/chunks/index.CIcVlp8P.js","_app/immutable/chunks/vendor.DIu6ILCq.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
