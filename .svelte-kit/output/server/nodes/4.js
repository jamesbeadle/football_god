

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.AFZgs56d.js","_app/immutable/chunks/index.BJuWJoym.js","_app/immutable/chunks/vendor.BLMaGit4.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
