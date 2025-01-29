

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.DKtl_NSi.js","_app/immutable/chunks/index.dOSeDm_k.js","_app/immutable/chunks/vendor.A-iKAwKu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
