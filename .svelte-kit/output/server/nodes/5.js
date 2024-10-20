

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BE9FAf0R.js","_app/immutable/chunks/index.BqsOk57Y.js","_app/immutable/chunks/vendor.C1fOrgpL.js"];
export const stylesheets = ["_app/immutable/assets/index.CSN47-Hr.css"];
export const fonts = [];
