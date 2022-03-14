// We don't have graphics node for non-browser :3
// Let's just use this file to load .sf.mjs and .sf.css

if(!window.Blackprint.Environment.isBrowser){
	console.log("@blackprint/nodes-pixi.js is only for browser, nodes will not be registered");
	return;
}

var [  , PIXI] = await imports([
    "https://cdn.jsdelivr.net/npm/gifler@0.1.0/gifler.min.js",
    "https://cdn.jsdelivr.net/npm/pixi.js-legacy@6.2.2/dist/browser/pixi-legacy.min.mjs",
]);

let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,
});

// Global shared context
let Context = Blackprint.createContext('Pixi.js');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};

// Fix minified class name
Blackprint.utils.renameTypeName({
	'CanvasResource': PIXI.CanvasResource,
	'Texture': PIXI.Texture,
	'Sprite': PIXI.Sprite,
});