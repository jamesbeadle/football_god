

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CgskGrcQ.js","_app/immutable/chunks/index.BCZJQZks.js","_app/immutable/chunks/vendor.B8YRBMZG.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
