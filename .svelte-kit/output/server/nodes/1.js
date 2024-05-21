

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.C_pgGvaA.js","_app/immutable/chunks/index.DwVxoJWs.js","_app/immutable/chunks/vendor.Bxn6vofx.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
