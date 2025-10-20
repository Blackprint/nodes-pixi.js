/**
 * Load GIF For Pixi.js
 * @blackprint node
 */
Blackprint.registerNode('Pixi.js/Converter/GIF',
class GIFNode extends Blackprint.Node {
	static input = {
		/** URL to GIF file */
		URL: String,
	}
	static output = {
		Sprite: PIXI.Sprite,
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = 'GIF Loader';
	}

	async update(){
		if(this.input.URL){
			let gif = new PIXIGif.GifSprite({
				source: await PIXI.Assets.load({
					src: this.input.URL,
					format: 'gif',
					parser: 'gifLoader',
				}),
				animationSpeed: 1,   // Normal speed
				loop: true,          // Loop playback
				autoPlay: true,      // Start playing immediately
			});
			gif.play();

			console.log(gif, PIXIGif.GifSprite, PIXI.Sprite)
			this.output.Sprite = gif;
		}
		else {
			let gif = this.output.Sprite;
			this.output.Sprite = null;
			gif?.stop();
		}
	}
});