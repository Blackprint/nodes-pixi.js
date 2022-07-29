let _Port = Blackprint.Port;

/**
 * Create a sprite from media source
 * @blackprint node
 * @summary Pixi.js
 */
Blackprint.registerNode('Pixi.js/Sprite',
class SpriteNode extends Blackprint.Node {
	static input = {
		/** Target media source */
		Source: _Port.Union([
			String,
			HTMLImageElement,
			HTMLCanvasElement,
			HTMLVideoElement,
			SVGElement,
			PIXI.CanvasResource,
			PIXI.Texture
		]),
		/** Adjust the position in x-axis */
		x: _Port.Default(Number, 0),
		/** Adjust the position in y-axis */
		y: _Port.Default(Number, 0),
		/** Adjust the scale in x-axis */
		ScaleX: _Port.Default(Number, 1),
		/** Adjust the scale in y-axis */
		ScaleY: _Port.Default(Number, 1),
		/** Rotate the rendered sprite */
		Rotate: _Port.Default(Number, 0),
		// SkewX: _Port.Default(Number, 0),
		// SkewY: _Port.Default(Number, 0),
		// PivotX: _Port.Default(Number, 0),
		// PivotY: _Port.Default(Number, 0),
	};

	static output = {
		/** Pixi's sprite object */
		Sprite: PIXI.Sprite,
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Pixi.js/Sprite');
		iface.title = 'Sprite';
	}

	update(){
		if(this.iface.input.Source.cables.length === 0)
			return;

		this.output.Sprite.setTransform(
			this.input.x,
			this.input.y,
			this.input.ScaleX,
			this.input.ScaleY,
			this.input.Rotate,
			// this.input.SkewX,
			// this.input.SkewY,
			// this.input.PivotX,
			// this.input.PivotY,
		);
	}
});

Blackprint.registerInterface('BPIC/Pixi.js/Sprite',
Context.IFace.Sprite = class SpriteIFace extends Blackprint.Interface{
	constructor(node){
		super(node);
	}

	init(){
		let node = this.node;

		var sprite = new PIXI.Sprite();
		node.output.Sprite = sprite;

		// For replacing when texture source is disconnected
		sprite._emptyTexture = sprite.texture;

		this.input.Source
			.on('value', Context.EventSlot, function(){
				node.output.Sprite.texture = PIXI.Texture.from(node.input.Source);
				node.update();
			})
			.on('disconnect', Context.EventSlot, function(){
				var sprite = node.output.Sprite;
				sprite.texture = sprite._emptyTexture;
			});
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Pixi.js/Sprite', {
	template: null
}, Context.IFace.Sprite);