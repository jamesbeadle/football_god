

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BTDeqcGZ.js","_app/immutable/chunks/index.BJvcKfCV.js","_app/immutable/chunks/vendor.DbRZrJzJ.js"];
export const stylesheets = ["_app/immutable/assets/index.CAY1JKm4.css"];
export const fonts = [];
