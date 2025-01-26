

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.B2NMlZ5M.js","_app/immutable/chunks/index.POpOnzxv.js","_app/immutable/chunks/vendor.BqS1_B6o.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
