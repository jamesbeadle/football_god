

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CGmsP1Sg.js","_app/immutable/chunks/index.14BV5vw9.js","_app/immutable/chunks/vendor.CLYXhiNu.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
