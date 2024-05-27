

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BwcAn10w.js","_app/immutable/chunks/index.BPeZrDvC.js","_app/immutable/chunks/vendor.B4wetm6U.js"];
export const stylesheets = ["_app/immutable/assets/index.BRhm3dn0.css"];
export const fonts = [];
