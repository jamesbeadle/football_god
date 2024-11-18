

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C7yXNkuB.js","_app/immutable/chunks/index.jGLts1cx.js","_app/immutable/chunks/vendor.AI0_njCh.js"];
export const stylesheets = ["_app/immutable/assets/index.CYit8I-Q.css"];
export const fonts = [];
