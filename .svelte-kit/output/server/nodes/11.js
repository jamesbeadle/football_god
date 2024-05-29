

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.dxE8sx1F.js","_app/immutable/chunks/index.CvZbRjaM.js","_app/immutable/chunks/vendor.CpGgC2oA.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
