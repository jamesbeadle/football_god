

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CUfs0ENJ.js","_app/immutable/chunks/index.BsdwlMyZ.js","_app/immutable/chunks/vendor.B1OkKqNd.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
