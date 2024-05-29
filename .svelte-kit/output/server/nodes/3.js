

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BzNOwijz.js","_app/immutable/chunks/index.CvZbRjaM.js","_app/immutable/chunks/vendor.CpGgC2oA.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
