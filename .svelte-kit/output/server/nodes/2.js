

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.KOubAGT5.js","_app/immutable/chunks/index.FbCAQhZb.js","_app/immutable/chunks/vendor.CvdQPrfv.js"];
export const stylesheets = ["_app/immutable/assets/index.BbIYF0S3.css"];
export const fonts = [];
