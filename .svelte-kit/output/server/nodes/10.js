

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.Clf6CbYD.js","_app/immutable/chunks/index.CvGypmqO.js","_app/immutable/chunks/vendor.CWlgTyQ2.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
