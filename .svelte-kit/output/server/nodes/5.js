

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.8_z0Schb.js","_app/immutable/chunks/index.C6UDe7g2.js","_app/immutable/chunks/vendor.BXHbztQ0.js"];
export const stylesheets = ["_app/immutable/assets/index.CYit8I-Q.css"];
export const fonts = [];
