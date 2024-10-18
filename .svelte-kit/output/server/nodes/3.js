

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C84RmTkC.js","_app/immutable/chunks/index.BsdwlMyZ.js","_app/immutable/chunks/vendor.B1OkKqNd.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
