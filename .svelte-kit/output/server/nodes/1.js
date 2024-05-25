

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.773lygji.js","_app/immutable/chunks/index.Cj7Rp3vF.js","_app/immutable/chunks/vendor.C0IfeU0o.js"];
export const stylesheets = ["_app/immutable/assets/index.D5fZHd_6.css"];
export const fonts = [];
