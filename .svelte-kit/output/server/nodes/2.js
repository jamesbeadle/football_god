

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Xwz-yDrm.js","_app/immutable/chunks/index.CvZbRjaM.js","_app/immutable/chunks/vendor.CpGgC2oA.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
