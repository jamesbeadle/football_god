

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CCvE204_.js","_app/immutable/chunks/index.CvGypmqO.js","_app/immutable/chunks/vendor.CWlgTyQ2.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
