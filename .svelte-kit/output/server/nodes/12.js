

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.Ci9Enp9g.js","_app/immutable/chunks/index.BFOBR8M7.js","_app/immutable/chunks/vendor.CxWKPZdM.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
