

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DlkKtubS.js","_app/immutable/chunks/index.DBCJtWTx.js","_app/immutable/chunks/vendor.CYT-VsSr.js"];
export const stylesheets = ["_app/immutable/assets/index.BUXnEE9B.css"];
export const fonts = [];
