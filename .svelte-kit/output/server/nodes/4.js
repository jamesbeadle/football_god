

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-proposal/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.C1y_ekSL.js","_app/immutable/chunks/index.BsdwlMyZ.js","_app/immutable/chunks/vendor.B1OkKqNd.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
