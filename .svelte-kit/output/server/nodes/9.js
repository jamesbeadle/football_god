

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.B6RX_052.js","_app/immutable/chunks/index.C2PZWqcI.js","_app/immutable/chunks/vendor.B35hbfDq.js"];
export const stylesheets = ["_app/immutable/assets/index.BmQpRqHD.css"];
export const fonts = [];
