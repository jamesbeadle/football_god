

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.Czyw3Rp4.js","_app/immutable/chunks/index.BqB4qOgf.js","_app/immutable/chunks/vendor.DlEi7daW.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
