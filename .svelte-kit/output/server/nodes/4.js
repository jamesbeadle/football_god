

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Chd1nz1J.js","_app/immutable/chunks/index.C2PZWqcI.js","_app/immutable/chunks/vendor.B35hbfDq.js"];
export const stylesheets = ["_app/immutable/assets/index.BmQpRqHD.css"];
export const fonts = [];
