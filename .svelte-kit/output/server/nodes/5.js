

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BDJI5OT3.js","_app/immutable/chunks/index.Cj7Rp3vF.js","_app/immutable/chunks/vendor.C0IfeU0o.js"];
export const stylesheets = ["_app/immutable/assets/index.D5fZHd_6.css"];
export const fonts = [];
