

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CFX6jryu.js","_app/immutable/chunks/index.Bdd7cHJ-.js","_app/immutable/chunks/vendor.DJ37lWIE.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
