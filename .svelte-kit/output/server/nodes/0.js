

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CWmYdppt.js","_app/immutable/chunks/index.BkeK0Bng.js","_app/immutable/chunks/vendor.DrfXxipA.js"];
export const stylesheets = ["_app/immutable/assets/index.BjsZ1T7E.css"];
export const fonts = [];
