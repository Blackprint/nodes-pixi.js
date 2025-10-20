/**
 * Create a sprite from media source
 * @blackprint node
 * @summary Pixi.js
 */
Blackprint.registerNode('Pixi.js/Sprite',
class SpriteNode extends Blackprint.Node {
	static input = {
		/** Target media source */
		Source: Blackprint.Port.Union([
			String,
			HTMLImageElement,
			HTMLCanvasElement,
			HTMLVideoElement,
			SVGElement,
			PIXI.Texture
		]),
		/** Adjust the position in x-axis */
		x: Blackprint.Port.Default(Number, 0),
		/** Adjust the position in y-axis */
		y: Blackprint.Port.Default(Number, 0),
		/** Adjust the scale in x-axis */
		ScaleX: Blackprint.Port.Default(Number, 1),
		/** Adjust the scale in y-axis */
		ScaleY: Blackprint.Port.Default(Number, 1),
		/** Rotate the rendered sprite */
		Rotate: Blackprint.Port.Default(Number, 0),
		// SkewX: Blackprint.Port.Default(Number, 0),
		// SkewY: Blackprint.Port.Default(Number, 0),
		// PivotX: Blackprint.Port.Default(Number, 0),
		// PivotY: Blackprint.Port.Default(Number, 0),
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

		this.output.Sprite.updateTransform({
			x: this.input.x,
			y: this.input.y,
			scaleX: this.input.ScaleX,
			scaleY: this.input.ScaleY,
			rotate: this.input.Rotate,
			// skewX: this.input.SkewX,
			// skewY: this.input.SkewY,
			// pivotX: this.input.PivotX,
			// pivotY: this.input.PivotY,
		});
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
				node.routes.routeOut();
			})
			.on('disconnect', Context.EventSlot, function(){
				var sprite = node.output.Sprite;
				sprite.texture = sprite._emptyTexture;
				node.routes.routeOut();
			});
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Pixi.js/Sprite', {
	template: null
}, Context.IFace.Sprite);