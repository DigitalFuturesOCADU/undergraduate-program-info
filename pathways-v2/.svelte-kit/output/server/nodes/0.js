import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CKpLYMkf.js","_app/immutable/chunks/Cx6eLdTQ.js","_app/immutable/chunks/uL9Q_Rlz.js","_app/immutable/chunks/1_My58TF.js"];
export const stylesheets = ["_app/immutable/assets/0.CgVaJfPq.css"];
export const fonts = [];
