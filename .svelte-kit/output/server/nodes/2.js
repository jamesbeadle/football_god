

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BqaP16V8.js","_app/immutable/chunks/index.BqsOk57Y.js","_app/immutable/chunks/vendor.C1fOrgpL.js"];
export const stylesheets = ["_app/immutable/assets/index.CSN47-Hr.css"];
export const fonts = [];
