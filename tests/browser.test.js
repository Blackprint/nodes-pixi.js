/**
 * @jest-environment jsdom
 */

// === For Browser Environment ===
window.ResizeObserver = class{};

// This will automatically load ScarletsFrame + Engine + Sketch
require("@blackprint/sketch");

// Disable loader for browser, because we're testing with Node.js
sf.loader.turnedOff = true;
sf.loader.task = false;

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