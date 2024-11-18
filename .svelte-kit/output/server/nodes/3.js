

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Czjb7ycq.js","_app/immutable/chunks/index.jGLts1cx.js","_app/immutable/chunks/vendor.AI0_njCh.js"];
export const stylesheets = ["_app/immutable/assets/index.CYit8I-Q.css"];
export const fonts = [];
