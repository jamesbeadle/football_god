

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.R4f9BBHQ.js","_app/immutable/chunks/index.BPeZrDvC.js","_app/immutable/chunks/vendor.B4wetm6U.js"];
export const stylesheets = ["_app/immutable/assets/index.BRhm3dn0.css"];
export const fonts = [];
