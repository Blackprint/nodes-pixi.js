/**
 * @jest-environment jsdom
 */

require("@blackprint/engine");

// === For Browser Environment ===
window.ResizeObserver = class{};
window.sf = require("scarletsframe/dist/scarletsframe.min.js");

// Disable loader for browser, because we're testing with Node.js
sf.loader.turnedOff = true;
sf.loader.task = false;

require("@blackprint/sketch/dist/blackprint.min.js");
require("@blackprint/sketch/dist/blackprint.sf.js");
// === For Browser Environment ===

let instance = null;
test('Blackprint.Sketch does exist on window', async () => {
	expect(window.Blackprint.Sketch).toBeDefined();

	// Create an instance where we can create nodes or import JSON
	instance = new Blackprint.Sketch();
});

// test('Load custom node modules', () => {
// 	require('../dist/nodes-rename-me.mjs');
// 	require('../dist/nodes-rename-me.sf.mjs');
// });