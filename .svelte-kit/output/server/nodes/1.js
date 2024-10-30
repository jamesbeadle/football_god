

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DdzJTLWU.js","_app/immutable/chunks/index.C95W9K3k.js","_app/immutable/chunks/vendor.C597RN51.js"];
export const stylesheets = ["_app/immutable/assets/index.3tPCJdae.css"];
export const fonts = [];
