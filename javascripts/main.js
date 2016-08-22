window.AudioContext = window.AudioContext || window.webkitAudioContext;

function recordCap() {
	
	this.audioContext = new AudioContext();
	this.audioRecorder = null;
	this.Track = null;
	this.rafID = null;
	this.canvasID = null;
	this.analyserContext = null;
	this.canvasWidth, canvasHeight;
	this.recIndex = 0;
	this.lrecord = null;
	this.firstlink = null;
	this.tracklink = null;

	this.gotBuffers = function(buffers){
		var ci = "c"+canvasID;
		var canvas = document.getElementById(ci);
		
		drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);
		audioRecorder.exportWAV( doneEncoding);
	};
	
	this.play = function(e) {
		console.log(e);
		var trackline = document.createElement('a');
		tracklink.id = lrecord;
		tracklink.href = link.href;
		e.appendChild(tracklink);
		this.track = new Audio(tracklink.href);
		track.play();
	};
	
	this.toggleRecording = function(e) {
		canvasID = e.id;
		var imgchange = e;
		if(e.classList.contains("recording")) {
			audioRecorder.stop();
			e.classList.remove("recording");
			audioRecorder.getBuffers(gotBuffers);
			imgchange.src = 'images/mic.png';
			link = document.getElementById('save');
			lrecord = "l"+e.id;
		}
		else {
			if(!audioRecorder)
				return;
			e.classList.add("recording");
			audioRecorder.clear();
			audioRecorder.record();
			imgchange.src = 'images/micrec.png';
		}
	};
	
	this.doneEncoding = function(blob) {
		Recorder.setupDownload(blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav");
		recIndex++;
	};
	
	this.gotDevices = function(deviceInfos) {
		for( var i = 0; i !== deviceInfos.length; ++i ) {
			var deviceInfo = deviceInfos[i];
			var option = document.createElement('option');
			option.value = deviceInfo.deviceId;
			if( deviceInfo.kind === 'audioInput' ) {
				option.text = deviceInfo.label || 'microphone' + ( masterInputSelector.length + 1);
				masterInputSelector.appendChild(option);
			}
		}
		
		var audioInputSelect = document.querySelectorAll('select#change');
		for ( var selector = 0; selector < audioInputSelect.length; selector++ ) {
			var newInputSelector = masterInputSelector.cloneNode(true);
			newInputSelector.addEventListener('change', changeAudioDestination);
			audioInputSelect[selector].parentNode.replaceChild(newInputSelector, audioInputSelect[selector]);
		}
	};
	
	this.changeAudioDestination = function(event) {
		var InputSelector = event.path[0];
		initAudio(InputSelector);
	};
	
	this.gotStream = function (stream) {
		window.stream = stream;
		
		var realAudioInput = audioContext.createMediaStreamSource(stream);
		var audioInput = realAudioInput;
		
		var inputPoint = audioContext.createGain();
		inputPoint.gain.value = 1.0;
		audioInput.connect(inputPoint);
		
		analyserNode = audioContext.createAnalyser();
		analyserNode.fftSize = 2048;
		inputPoint.connect(analyserNode);
		
		audioRecorder = new Recorder( inputPoint );
		
		inputPoint.connect(audioContext.destination);
	};
	
	this.initAudio = function(index) {
		if( window.stream ) { 
			window.stream.getTracks().forEach(function(track) {
				track.stop();
			});
		}
		
		var audioSoutce = index.value;
		var constraints = {
			audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
		};
		navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
	};
	
	this.handleError = function(error) {
		console.log('navigator.getUserMedia error: ', error);
	};
	
	navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
	
	initAudio(0);
}

var onetrack = recordCap();
