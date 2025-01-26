

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.xzpnhZBr.js","_app/immutable/chunks/index.DdHCKr4y.js","_app/immutable/chunks/vendor.Bu5LLBrj.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
