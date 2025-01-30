

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.bCPMmCOy.js","_app/immutable/chunks/index.Bdd7cHJ-.js","_app/immutable/chunks/vendor.DJ37lWIE.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
