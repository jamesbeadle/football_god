

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DhHA_kF3.js","_app/immutable/chunks/index.DLdNHLfP.js","_app/immutable/chunks/vendor.BrKaCvf-.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
