

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BUX2g8V9.js","_app/immutable/chunks/index.ufLk4Ea7.js","_app/immutable/chunks/vendor.Bnawml4v.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
