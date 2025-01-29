

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DPgkxh_E.js","_app/immutable/chunks/index.CukZxSJz.js","_app/immutable/chunks/vendor.4UjPoqbn.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
