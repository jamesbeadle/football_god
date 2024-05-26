

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.B6joKVUM.js","_app/immutable/chunks/index.DkI9z6_I.js","_app/immutable/chunks/vendor.tF8zXmIJ.js"];
export const stylesheets = ["_app/immutable/assets/index.DDmig223.css"];
export const fonts = [];
