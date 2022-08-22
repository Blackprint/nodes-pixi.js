/**
 * Canvas node for diplaying sprites
 * @blackprint node
 * @summary Pixi.js
 */
Blackprint.registerNode('Pixi.js/Display/Canvas',
class CanvasNode extends Blackprint.Node {
	static input = {
		/** Sprites that will be displayed into this canvas */
		Sprite: Blackprint.Port.ArrayOf(PIXI.Sprite),
		/** Start rendering */
		Start: Blackprint.Port.Trigger(function({ iface }){
			iface.app.ticker.start();
		}),
		/** Stop rendering */
		Stop: Blackprint.Port.Trigger(function({ iface }){
			iface.app.ticker.stop();
		}),
	}

	static output = {
		/** MediaStream track */
		VideoTrack: MediaStreamTrack,
	}

	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Pixi.js/Display/Canvas');
		iface.title = 'Display Canvas';
	}
});

var canvasFirstInit = true;
Blackprint.registerInterface('BPIC/Pixi.js/Display/Canvas',
Context.IFace.Canvas = class CanvasIFace extends Blackprint.Interface {
	init(){
		// Initialize and save data to iface
		// So it can persist if current scope is hot reloaded

		let time;
		if(canvasFirstInit) time = Date.now();

		this.app = new PIXI.Application(); // First init could be slow
		this.app.ticker.maxFPS = 25;
		this.app.ticker.minFPS = 1;

		if(canvasFirstInit){
			let info = "Pixi.js init time: "+(Date.now() - time)+'ms';
			window.SmallNotif ? SmallNotif.add(info) : console.log(info);

			canvasFirstInit = false;
		}

		this.container = this.app.stage;
		this.canvas = this.app.view;
		this.childs = new Map();

		this.app.renderer.resize(512, 256);
		this.app.stop();
		this.app.ticker.stop();

		this.initEvent();
	}

	initEvent(){
		var My = this; // Shortcut
		const {
			IInput, IOutput, // Port interface
			Input, Output, // Port value
		} = My.ref;

		// target == Port from other node, this == Port from current node
		IInput.Sprite.on('value', Context.EventSlot, function({ cable }){
			var child = Object.create(cable.value);
			child.parent = null;

			My.childs.set(cable.value, child);
			My.app.stage.addChild(child);

			My.app.start();
		});

		IInput.Sprite.on('disconnect', Context.EventSlot, function({ cable }){
			var child = My.childs.get(cable.value);
			My.childs.delete(cable.value);

			My.app.stage.removeChild(child);
			if(IInput.Sprite.cables.length === 0)
				My.app.stop();
		});

		IOutput.VideoTrack.on('connect', Context.EventSlot, function(){
			My.mediaStream = My.canvas.captureStream();
			Output.VideoTrack = My.mediaStream.getVideoTracks()[0];
		});

		IOutput.VideoTrack.on('disconnect', Context.EventSlot, function(){
			if(this.cables.length === 0){
				My.mediaStream.removeTrack(Output.VideoTrack);
				Output.VideoTrack.stop();

				Output.VideoTrack = My.mediaStream = void 0;
			}
		});
	}
});