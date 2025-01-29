

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.NCET-9pw.js","_app/immutable/chunks/index.CukZxSJz.js","_app/immutable/chunks/vendor.4UjPoqbn.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
