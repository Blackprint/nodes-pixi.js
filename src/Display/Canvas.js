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
	async init(){
		// Initialize and save data to iface
		// So it can persist if current scope is hot reloaded

		let time;
		if(canvasFirstInit) time = Date.now();

		this.app = new PIXI.Application();
		await this.app.init({
			background: '#1099bb',
			autoStart: false,
			//resizeTo: window
		});

		if(canvasFirstInit){
			let info = "Pixi.js init time: "+(Date.now() - time)+'ms';
			window.SmallNotif ? SmallNotif.add(info) : console.log(info);

			canvasFirstInit = false;
		}

		this.container = this.app.stage;
		this.canvas = this.app.canvas;

		this.app.renderer.resize(512, 256);
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
			if(!cable.value || cable.value.length === 0) return;

			My.app.stage.addChild(cable.value);
			My.app.start();
		});

		IInput.Sprite.on('disconnect', Context.EventSlot, function({ target }){
			My.app.stage.removeChild(target.value);
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