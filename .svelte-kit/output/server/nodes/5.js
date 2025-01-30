

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CISHiPLF.js","_app/immutable/chunks/index.Bdd7cHJ-.js","_app/immutable/chunks/vendor.DJ37lWIE.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
