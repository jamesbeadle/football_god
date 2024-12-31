

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.B-Q4PABh.js","_app/immutable/chunks/index.DuTms-2r.js","_app/immutable/chunks/vendor.DJzUGvAj.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
