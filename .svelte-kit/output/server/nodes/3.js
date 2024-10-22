

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BIiTqOdI.js","_app/immutable/chunks/index.iamTWUmX.js","_app/immutable/chunks/vendor.DOSvRLiO.js"];
export const stylesheets = ["_app/immutable/assets/index.BX7P7LMc.css"];
export const fonts = [];
