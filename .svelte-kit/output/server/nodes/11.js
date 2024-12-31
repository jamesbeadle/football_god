

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.Zrrn6YHi.js","_app/immutable/chunks/index.dZLXHk-T.js","_app/immutable/chunks/vendor.y88Ldc1J.js"];
export const stylesheets = ["_app/immutable/assets/index.l9X8_Dha.css"];
export const fonts = [];
