

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Cfz014Yj.js","_app/immutable/chunks/index.Gc3bSBq5.js","_app/immutable/chunks/vendor.BJ_iENKD.js"];
export const stylesheets = ["_app/immutable/assets/index.BUgnsisD.css"];
export const fonts = [];
