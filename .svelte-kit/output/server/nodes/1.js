

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B8g0Fm9x.js","_app/immutable/chunks/index.dZLXHk-T.js","_app/immutable/chunks/vendor.y88Ldc1J.js"];
export const stylesheets = ["_app/immutable/assets/index.l9X8_Dha.css"];
export const fonts = [];
