

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DVQi9OeG.js","_app/immutable/chunks/index.DXjgZ5fr.js","_app/immutable/chunks/vendor.Dsq-8qgF.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
