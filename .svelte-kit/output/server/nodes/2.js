

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DwqOkPFr.js","_app/immutable/chunks/index.BZ0W5rsa.js","_app/immutable/chunks/vendor.CUls1BbN.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
