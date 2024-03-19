

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.2sWuUvuC.js","_app/immutable/chunks/index.FbCAQhZb.js","_app/immutable/chunks/vendor.CvdQPrfv.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
