

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Kd6qgNa8.js","_app/immutable/chunks/index.dZLXHk-T.js","_app/immutable/chunks/vendor.y88Ldc1J.js"];
export const stylesheets = ["_app/immutable/assets/index.l9X8_Dha.css"];
export const fonts = [];
