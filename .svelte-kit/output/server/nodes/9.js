

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/whitepaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.D4xSoSe1.js","_app/immutable/chunks/index.8OvprEYt.js","_app/immutable/chunks/vendor.5EGZ7AZB.js"];
export const stylesheets = ["_app/immutable/assets/index.D7eaxdDC.css"];
export const fonts = [];
