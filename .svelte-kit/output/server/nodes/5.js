

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CKypFMUA.js","_app/immutable/chunks/index.CNVc3cfa.js","_app/immutable/chunks/vendor.Ctqju97e.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
