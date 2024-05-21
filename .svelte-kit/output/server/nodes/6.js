

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.qXUUH76j.js","_app/immutable/chunks/index.DwVxoJWs.js","_app/immutable/chunks/vendor.Bxn6vofx.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
