

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.D7TYMFGE.js","_app/immutable/chunks/index.UJqspJr5.js","_app/immutable/chunks/vendor.BMxqKWS1.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
