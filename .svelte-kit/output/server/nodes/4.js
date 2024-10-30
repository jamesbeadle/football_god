

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BS17bE9X.js","_app/immutable/chunks/index.C95W9K3k.js","_app/immutable/chunks/vendor.C597RN51.js"];
export const stylesheets = ["_app/immutable/assets/index.3tPCJdae.css"];
export const fonts = [];
