

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BiIdsCpE.js","_app/immutable/chunks/index.CvZbRjaM.js","_app/immutable/chunks/vendor.CpGgC2oA.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
