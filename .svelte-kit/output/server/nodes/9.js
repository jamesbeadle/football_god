

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.BTaRjdCP.js","_app/immutable/chunks/index.C6UDe7g2.js","_app/immutable/chunks/vendor.BXHbztQ0.js"];
export const stylesheets = ["_app/immutable/assets/index.CYit8I-Q.css"];
export const fonts = [];
