import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.B2-pWjFt.js","_app/immutable/chunks/Cx6eLdTQ.js","_app/immutable/chunks/uL9Q_Rlz.js","_app/immutable/chunks/CIgPKQdI.js","_app/immutable/chunks/1_My58TF.js","_app/immutable/chunks/Bc0ki6bg.js","_app/immutable/chunks/BJd2pZ_f.js"];
export const stylesheets = ["_app/immutable/assets/2.CfHMdV8_.css"];
export const fonts = [];
