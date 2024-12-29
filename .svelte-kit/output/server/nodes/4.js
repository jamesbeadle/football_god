

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CfOm21RG.js","_app/immutable/chunks/index.CvGypmqO.js","_app/immutable/chunks/vendor.CWlgTyQ2.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
