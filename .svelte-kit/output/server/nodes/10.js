

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.DIU3t9B2.js","_app/immutable/chunks/index.s4UHVwF_.js","_app/immutable/chunks/vendor.BExwtFph.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
