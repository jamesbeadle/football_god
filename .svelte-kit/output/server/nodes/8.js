

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.B6-kEgIa.js","_app/immutable/chunks/index.DwVxoJWs.js","_app/immutable/chunks/vendor.Bxn6vofx.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
