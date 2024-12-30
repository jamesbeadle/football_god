

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.ChTgzmaj.js","_app/immutable/chunks/index.ufLk4Ea7.js","_app/immutable/chunks/vendor.Bnawml4v.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
