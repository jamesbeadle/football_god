

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.D7-VNj98.js","_app/immutable/chunks/index.Jh9xyqtF.js","_app/immutable/chunks/vendor.BX35kGJf.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
