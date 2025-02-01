

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.B2e1IPnz.js","_app/immutable/chunks/index.DBCJtWTx.js","_app/immutable/chunks/vendor.CYT-VsSr.js"];
export const stylesheets = ["_app/immutable/assets/index.BUXnEE9B.css"];
export const fonts = [];
