

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.B3X6WL1M.js","_app/immutable/chunks/index.BJvcKfCV.js","_app/immutable/chunks/vendor.DbRZrJzJ.js"];
export const stylesheets = ["_app/immutable/assets/index.CAY1JKm4.css"];
export const fonts = [];
