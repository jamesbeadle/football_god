

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DaT3ukka.js","_app/immutable/chunks/index.DdHCKr4y.js","_app/immutable/chunks/vendor.Bu5LLBrj.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
