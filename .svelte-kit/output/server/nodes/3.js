

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CtUtLdow.js","_app/immutable/chunks/index.z75Ogwc8.js","_app/immutable/chunks/vendor.TRGMQCjR.js"];
export const stylesheets = ["_app/immutable/assets/index.C2Y87wS7.css"];
export const fonts = [];
