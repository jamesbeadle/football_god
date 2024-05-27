

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CLzYmG7Z.js","_app/immutable/chunks/index.UtPihMp7.js","_app/immutable/chunks/vendor.Ds731QS1.js"];
export const stylesheets = ["_app/immutable/assets/index.CTG9qjY3.css"];
export const fonts = [];
