

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Co1FYbrI.js","_app/immutable/chunks/index.BCZJQZks.js","_app/immutable/chunks/vendor.B8YRBMZG.js"];
export const stylesheets = ["_app/immutable/assets/index.BcLjx6IU.css"];
export const fonts = [];
