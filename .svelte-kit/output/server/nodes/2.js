

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Di3W0xrt.js","_app/immutable/chunks/index.CqvD32_S.js","_app/immutable/chunks/vendor.q3FD-pq3.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
