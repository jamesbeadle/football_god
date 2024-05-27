export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".ic-assets.json",".well-known/ic-domains",".well-known/ii-alternative-origins","FPLCoin.png","ICPCoin.png","banner.jpg","favicons/.DS_Store","favicons/apple-touch-icon.png","favicons/browserconfig.xml","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/icon-192x192.png","favicons/icon-512x512.png","favicons/mstile-150x150.png","favicons/safari-pinned-tab.svg","manifest.webmanifest","openfpl.png","poppins-regular-webfont.woff2","profile_placeholder.png","whitepaper.jpg"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".xml":"text/xml",".svg":"image/svg+xml",".webmanifest":"application/manifest+json",".woff2":"font/woff2"},
	_: {
		client: {"start":"_app/immutable/entry/start.CsySXY99.js","app":"_app/immutable/entry/app.yQjoHt4H.js","imports":["_app/immutable/entry/start.CsySXY99.js","_app/immutable/chunks/index.UtPihMp7.js","_app/immutable/chunks/vendor.Ds731QS1.js","_app/immutable/entry/app.yQjoHt4H.js","_app/immutable/chunks/index.UtPihMp7.js","_app/immutable/chunks/vendor.Ds731QS1.js"],"stylesheets":["_app/immutable/assets/index.CTG9qjY3.css","_app/immutable/assets/index.CTG9qjY3.css"],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/betting",
				pattern: /^\/betting\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/euro2024",
				pattern: /^\/euro2024\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/games",
				pattern: /^\/games\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/leaderboard",
				pattern: /^\/leaderboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/lightpaper",
				pattern: /^\/lightpaper\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/manage-euro2024",
				pattern: /^\/manage-euro2024\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/presale",
				pattern: /^\/presale\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
