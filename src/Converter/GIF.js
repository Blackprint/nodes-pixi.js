Blackprint.registerNode('Pixi.js/Converter/GIF',
class GIFNode extends Blackprint.Node {
	static input = { URL: String }
	static output = { Canvas: PIXI.CanvasResource }

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Pixi.js/Converter/GIF');
		iface.title = 'GIF Player';
	}
});

Blackprint.registerInterface('BPIC/Pixi.js/Converter/GIF',
Context.IFace.GIF = class GIFIFace extends Blackprint.Interface {
	constructor(node){
		super(node);

		this.canvas = null;
		this.gif = null;
		this.pixi = null;
	}

	init(){
		let iface = this;
		let node = this.node;
		let {Input, IInput, Output} = this.ref;

		this.canvas = document.createElement('canvas');
		this.pixi = new PIXI.CanvasResource(this.canvas);

		// This should be on property
		Output.Canvas = this.pixi;

		IInput.URL.on('value', Context.EventSlot, function({ cable }){
			gifler(cable.value).get(function(anim){
				iface.gif = anim;
				anim.onDrawFrame = function(ctx, frame){
					ctx.drawImage(frame.buffer, 0, 0);
					iface.pixi.update();
				}

				anim.animateInCanvas(iface.canvas);
			});
		});

		IInput.URL.on('disconnect', Context.EventSlot, function(){
			iface.gif.stop();
		});
	}
});

// For Sketch Editor (use default UI, and use similar interface)
Blackprint.Sketch.registerInterface('BPIC/Pixi.js/Converter/GIF', {
	template: null
}, Context.IFace.GIF);