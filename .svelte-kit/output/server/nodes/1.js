

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Pz915OBd.js","_app/immutable/chunks/index.UtPihMp7.js","_app/immutable/chunks/vendor.Ds731QS1.js"];
export const stylesheets = ["_app/immutable/assets/index.CTG9qjY3.css"];
export const fonts = [];
