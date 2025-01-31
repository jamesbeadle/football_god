

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.1oEqI35Y.js","_app/immutable/chunks/index.BZ-81D-o.js","_app/immutable/chunks/vendor.DteFJDNw.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
