

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CidiBDeE.js","_app/immutable/chunks/index.BqsOk57Y.js","_app/immutable/chunks/vendor.C1fOrgpL.js"];
export const stylesheets = ["_app/immutable/assets/index.CSN47-Hr.css"];
export const fonts = [];
