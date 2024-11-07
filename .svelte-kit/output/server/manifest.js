export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store",".ic-assets.json",".well-known/ic-domains",".well-known/ii-alternative-origins","FPLCoin.png","Gods.png","ICPCoin.png","banner.jpg","favicons/.DS_Store","favicons/apple-touch-icon.png","favicons/browserconfig.xml","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/icon-192x192.png","favicons/icon-512x512.png","favicons/mstile-150x150.png","favicons/safari-pinned-tab.svg","fpl.jpg","manifest.webmanifest","poppins-regular-webfont.woff2","profile_placeholder.png","transferkings.png","whitepaper.jpg","wsl.jpg"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".xml":"text/xml",".svg":"image/svg+xml",".webmanifest":"application/manifest+json",".woff2":"font/woff2"},
	_: {
		client: {"start":"_app/immutable/entry/start.Br_FdmQy.js","app":"_app/immutable/entry/app.Bi2B9sDk.js","imports":["_app/immutable/entry/start.Br_FdmQy.js","_app/immutable/chunks/index.C6UDe7g2.js","_app/immutable/chunks/vendor.BXHbztQ0.js","_app/immutable/entry/app.Bi2B9sDk.js","_app/immutable/chunks/index.C6UDe7g2.js","_app/immutable/chunks/vendor.BXHbztQ0.js"],"stylesheets":["_app/immutable/assets/index.CYit8I-Q.css","_app/immutable/assets/index.CYit8I-Q.css"],"fonts":[],"uses_env_dynamic_public":false},
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
			__memo(() => import('./nodes/9.js'))
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
				id: "/add-fixture-data",
				pattern: /^\/add-fixture-data\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/governance",
				pattern: /^\/governance\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/leagues",
				pattern: /^\/leagues\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/league",
				pattern: /^\/league\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/players",
				pattern: /^\/players\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
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
