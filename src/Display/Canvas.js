Blackprint.registerNode('Pixi.js/Display/Canvas',
class CanvasNode extends Blackprint.Node {
	constructor(instance){
		super(instance);

		let iface = this.setInterface('BPIC/Pixi.js/Display/Canvas');
		iface.title = 'Display Canvas';

		this.input = {
			Sprite: Blackprint.Port.ArrayOf(PIXI.Sprite),
			Start: Blackprint.Port.Trigger(function(){
				iface.app.ticker.start();
			}),
			Stop: Blackprint.Port.Trigger(function(){
				iface.app.ticker.stop();
			}),
		}

		this.output = {
			VideoTrack: MediaStreamTrack
		}
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
			IInput, IOutput, IProperty, // Port interface
			Input, Output, Property, // Port value
		} = My.const;

		// target == Port from other node, this == Port from current node
		IInput.Sprite.on('value', Context.EventSlot, function(target){
			var child = Object.create(target.value);
			child.parent = null;

			My.childs.set(target.value, child);
			My.app.stage.addChild(child);

			My.app.start();
		});

		IInput.Sprite.on('disconnect', Context.EventSlot, function(target){
			var child = My.childs.get(target.value);
			My.childs.delete(target.value);

			My.app.stage.removeChild(child);
			if(this.cables.length === 0)
				My.app.stop();
		});

		IOutput.VideoTrack.on('connect', Context.EventSlot, function(){
			My.mediaStream ??= My.canvas.captureStream();
			Output.VideoTrack ??= My.mediaStream.getVideoTracks()[0];
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