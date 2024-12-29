

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.DET0uTZd.js","_app/immutable/chunks/index.CvGypmqO.js","_app/immutable/chunks/vendor.CWlgTyQ2.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
