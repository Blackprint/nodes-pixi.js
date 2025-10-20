// We don't have graphics node for non-browser :3
// Let's just use this file to load .sf.mjs and .sf.css

if(!window.Blackprint.Environment.isBrowser){
	console.log("@blackprint/nodes-pixi.js is only for browser, nodes will not be registered");
	return;
}

let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,

	// This will autoload (*.docs.json) for Browser
	hasDocs: true,
});

var [ PIXI, PIXIGif, PIXIBlendModes ] = await Blackprint.DepsLoader.js({
	window: ['PIXI', 'PIXIGif', 'PIXIBlendModes'],

	// need to use 'npm install' first or must exist on node_modules, will dynamically imported
	local: ['pixi.js', 'pixi.js/gif', 'pixi.js/advanced-blend-modes'],

	// for browser, Deno, or supported environment that have internet access
	cdn: [
		"https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/+esm",
		"https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/gif/+esm",
		"https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/advanced-blend-modes/+esm",
	]
});

PIXI.extensions.add(PIXI.TickerPlugin);
PIXI.extensions.add(PIXIGif.GifAsset);
Object.setPrototypeOf(PIXIGif.GifSprite.prototype, PIXI.Sprite.prototype); // Fix type error

// Global shared context
let Context = Blackprint.createContext('Pixi.js');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};

// Fix minified class name
Blackprint.utils.renameTypeName({
	'Texture': PIXI.Texture,
	'Sprite': PIXI.Sprite,
});