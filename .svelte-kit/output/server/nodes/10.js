

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.D_txs9Az.js","_app/immutable/chunks/index.BGy6ezKk.js","_app/immutable/chunks/vendor.DpDJDq4E.js"];
export const stylesheets = ["_app/immutable/assets/index.CxFGGsA5.css"];
export const fonts = [];
