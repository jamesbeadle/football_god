

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.73H_zu_q.js","_app/immutable/chunks/index.CICCmttX.js","_app/immutable/chunks/vendor.cTfe9MiI.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
