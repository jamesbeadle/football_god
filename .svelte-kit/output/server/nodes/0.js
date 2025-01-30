

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.D3AfehvR.js","_app/immutable/chunks/index.BOq3tOCX.js","_app/immutable/chunks/vendor.yzhjgpC4.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
