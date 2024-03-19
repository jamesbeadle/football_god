

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.D8C7GZMO.js","_app/immutable/chunks/index.FbCAQhZb.js","_app/immutable/chunks/vendor.CvdQPrfv.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
