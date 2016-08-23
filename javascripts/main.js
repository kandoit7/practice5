var masterInputSelector = document.createElement('select');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioRecorder = null;
var audioRecorder2 = null;
var Track = null;    
var rafID = null;
var canvasID = null;
var recIndex = 0;
var lrecord = null;
var link = null;

function gotBuffers( buffers ) {
	var ci = "c"+canvasID;
   	var canvas = document.getElementById(ci);
	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
	audioRecorder.exportWAV( doneEncoding );
}

function play( e ) {
	console.log(e);
	var tracklink = document.createElement('a');
	tracklink.id = lrecord;
	tracklink.href = link.href;
	e.appendChild(tracklink);
	
	var track = new Audio(tracklink.href);
	track.play();
}

function toggleRecording( e ) {
	canvasID = e.id;
	var imgchange = e;
	if (e.classList.contains("recording")) {
		// stop recording
		audioRecorder.stop();
		e.classList.remove("recording");
		imgchange.src = 'images/mic.png'
		lrecord = "l" + e.id;
		audioRecorder.getBuffers( gotBuffers );
		link = document.getElementById('save');
	} else {
		// start recording  
		if (!audioRecorder)
	    		return;
	
		e.classList.add("recording");
		imgchange.src = 'images/micrec.png'
		audioRecorder.clear();
		audioRecorder.record();
	}
}

function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function gotDevices(deviceInfos) {
	
	for (var i = 0; i !== deviceInfos.length; ++i) {
		var deviceInfo = deviceInfos[i];
		var option = document.createElement('option');
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'audioinput') {
			option.text = deviceInfo.label || 'microphone ' + (masterInputSelector.length + 1);
			masterInputSelector.appendChild(option);
		}
	}
	
	var audioInputSelect = document.querySelectorAll('select#change');
	for ( var selector = 0; selector < audioInputSelect.length; selector++) {
		var newInputSelector = masterInputSelector.cloneNode(true);
		newInputSelector.addEventListener('change', changeAudioDestination);
		audioInputSelect[selector].parentNode.replaceChild(newInputSelector, audioInputSelect[selector]);
	}
}
	
function changeAudioDestination(event) {
	var InputSelector = event.path[0];
	initAudio(InputSelector);
}
	
function gotStream(stream) {
	window.stream = stream; // make stream available to console
	
	// Create an AudioNode from the stream.
	var realAudioInput = audioContext.createMediaStreamSource(stream);
	var audioInput = realAudioInput;
	
	var inputPoint = audioContext.createGain();
	inputPoint.gain.value = 1.0;
	audioInput.connect(inputPoint);
	//audioInput = convertToMono( input );
	
	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );
	
	audioRecorder = new Recorder( inputPoint ); // this fuck what the fuck
	// speak / headphone feedback initial settings
	
	//changeGain.gain.value = 1.0;
	//inputPoint.connect(changeGain);
	//changeGain.connect(audioContext.destination);
	inputPoint.connect(audioContext.destination);
	
	return navigator.mediaDevices.enumerateDevices();
}

function initAudio(index) {
	if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
			track.stop();
		});
	}
	
	var audioSource = index.value;
	console.log(index);
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
	navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
initAudio(0);

