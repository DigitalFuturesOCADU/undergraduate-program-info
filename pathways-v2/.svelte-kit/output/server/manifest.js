export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["data/creative-technologist.json","data/games-playable-media-maker.json","data/physical-interface-designer.json"]),
	mimeTypes: {".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.BdiKMQaq.js",app:"_app/immutable/entry/app.Bc68S4Kj.js",imports:["_app/immutable/entry/start.BdiKMQaq.js","_app/immutable/chunks/YgKo79Q6.js","_app/immutable/chunks/uL9Q_Rlz.js","_app/immutable/chunks/Bc0ki6bg.js","_app/immutable/chunks/NKbTvX0j.js","_app/immutable/entry/app.Bc68S4Kj.js","_app/immutable/chunks/uL9Q_Rlz.js","_app/immutable/chunks/BJd2pZ_f.js","_app/immutable/chunks/Cx6eLdTQ.js","_app/immutable/chunks/NKbTvX0j.js","_app/immutable/chunks/CIgPKQdI.js","_app/immutable/chunks/1_My58TF.js","_app/immutable/chunks/Bc0ki6bg.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/data/creative-technologist.json","/data/physical-interface-designer.json","/data/games-playable-media-maker.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
