

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.B9RFYiZU.js","_app/immutable/chunks/index.jZt5a3qK.js","_app/immutable/chunks/vendor.Dnzxq6Ib.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
