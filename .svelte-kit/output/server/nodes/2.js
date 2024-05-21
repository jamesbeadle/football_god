

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D7HTPts0.js","_app/immutable/chunks/index.BCZJQZks.js","_app/immutable/chunks/vendor.B8YRBMZG.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
