

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.B7u1cIPf.js","_app/immutable/chunks/index.BJvcKfCV.js","_app/immutable/chunks/vendor.DbRZrJzJ.js"];
export const stylesheets = ["_app/immutable/assets/index.CAY1JKm4.css"];
export const fonts = [];
