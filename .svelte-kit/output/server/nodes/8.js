

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.B_iGSQFE.js","_app/immutable/chunks/index.CFONCfej.js","_app/immutable/chunks/vendor.BdkuDQEJ.js"];
export const stylesheets = ["_app/immutable/assets/index.dzohRDD9.css"];
export const fonts = [];
