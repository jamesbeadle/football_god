

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.yF_FodbQ.js","_app/immutable/chunks/index.jZt5a3qK.js","_app/immutable/chunks/vendor.Dnzxq6Ib.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
