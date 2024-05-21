

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.De0yfwWX.js","_app/immutable/chunks/index.DwVxoJWs.js","_app/immutable/chunks/vendor.Bxn6vofx.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
