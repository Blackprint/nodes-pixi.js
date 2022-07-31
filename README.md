Pixi.js nodes collection for Browser

[![NPM](https://img.shields.io/npm/v/@blackprint/nodes-pixi.js.svg)](https://www.npmjs.com/package/@blackprint/nodes-pixi.js)
[![Build Status](https://github.com/Blackprint/nodes-pixi.js/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Blackprint/nodes-pixi.js/actions/workflows/build.yml)

ToDo: https://github.com/pixijs/filters

## Import this nodes from URL
Please specify the version to avoid breaking changes.

```js
Blackprint.loadModuleFromURL([
	'https://cdn.jsdelivr.net/npm/@blackprint/nodes-pixi.js@0.4/dist/nodes-pixijs.mjs'
], {
	// Turn this on if you want to load .sf.js, and .sf.css
	// only with single .mjs
	loadBrowserInterface: true // set to "false" for Node.js/Deno
});
```

## Development URL
You can use this link to load unpublished nodes and still under development on GitHub.
> `https://cdn.jsdelivr.net/gh/Blackprint/nodes-pixi.js@dist/nodes-pixijs.mjs?1`

Please append `/url-here?random-number` if your browser still using the cached files after the repository was updated.

### License
MIT