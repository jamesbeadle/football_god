

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DZ0A2J-H.js","_app/immutable/chunks/index.Hq7qCnt6.js","_app/immutable/chunks/vendor.BSedk8ia.js"];
export const stylesheets = ["_app/immutable/assets/index.dzohRDD9.css"];
export const fonts = [];
