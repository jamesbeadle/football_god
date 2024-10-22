

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B9DvXqM-.js","_app/immutable/chunks/index.iamTWUmX.js","_app/immutable/chunks/vendor.DOSvRLiO.js"];
export const stylesheets = ["_app/immutable/assets/index.BX7P7LMc.css"];
export const fonts = [];
