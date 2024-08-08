

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.Rjwd_am1.js","_app/immutable/chunks/index.Cqp_4isq.js","_app/immutable/chunks/vendor.CAB3f8qr.js"];
export const stylesheets = ["_app/immutable/assets/index.9srkIUUE.css"];
export const fonts = [];
