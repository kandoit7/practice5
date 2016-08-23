var masterInputSelector = document.createElement('select');

var audioContext1 = new (window.AudioContext || window.webkitAudioContext)();
var audioContext2 = new (window.AudioContext || window.webkitAudioContext)();
var audioRecorder1 = null;
var audioRecorder2 = null;
var Track = null;    
var rafID = null;
var canvasID1 = null;
var canvasID2 = null;
var recIndex = 0;
var lrecord1 = null;
var lrecord2 = null;
var link1 = null;
var link2 = null;

function gotBuffers1( buffers ) {
	var ci = "c"+canvasID1;
   	var canvas = document.getElementById(ci);
	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
	audioRecorder1.exportWAV( doneEncoding );
}

function gotBuffers2( buffers ) {
	var ci = "c"+canvasID2;
   	var canvas = document.getElementById(ci);
	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
	audioRecorder2.exportWAV( doneEncoding );
}

function play1( e ) {
	console.log(e);
	
	var track = new Audio(tracklink.href);
	track.play();
}

function play2( e ) {
	console.log(e);
	
	var track = new Audio(tracklink.href);
	track.play();
}

function toggleRecording1( e ) {
	canvasID1 = e.id;
	var imgchange = e;
	if (e.classList.contains("recording")) {
		// stop recording
		audioRecorder1.stop();
		e.classList.remove("recording");
		imgchange.src = 'images/mic.png'
		lrecord1 = "l" + e.id;
		audioRecorder1.getBuffers( gotBuffers1 );
		link1 = document.getElementById('save');
		var tracklink = document.createElement('a');
		tracklink.id = lrecord1;
		tracklink.href = link1.href;
		e.appendChild(tracklink);
	} else {
		// start recording  
		if (!audioRecorder1)
	    		return;
	
		e.classList.add("recording");
		imgchange.src = 'images/micrec.png'
		audioRecorder1.clear();
		audioRecorder1.record();
	}
}

function toggleRecording2( e ) {
	canvasID2 = e.id;
	var imgchange = e;
	if (e.classList.contains("recording")) {
		// stop recording
		audioRecorder2.stop();
		e.classList.remove("recording");
		imgchange.src = 'images/mic.png'
		lrecord2 = "l" + e.id;
		audioRecorder2.getBuffers( gotBuffers2 );
		link2 = document.getElementById('save');
		var tracklink = document.createElement('a');
		tracklink.id = lrecord2;
		tracklink.href = link2.href;
		e.appendChild(tracklink);
	} else {
		// start recording  
		if (!audioRecorder2)
	    		return;
	
		e.classList.add("recording");
		imgchange.src = 'images/micrec.png'
		audioRecorder2.clear();
		audioRecorder2.record();
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
	
function gotStream1(stream) {
	window.stream = stream; // make stream available to console
	
	// Create an AudioNode from the stream.
	var realAudioInput = audioContext1.createMediaStreamSource(stream);
	var audioInput = realAudioInput;
	
	var inputPoint = audioContext1.createGain();
	inputPoint.gain.value = 1.0;
	audioInput.connect(inputPoint);
	//audioInput = convertToMono( input );
	
	analyserNode = audioContext1.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );
	
	audioRecorder1 = new Recorder( inputPoint ); // this fuck what the fuck
	// speak / headphone feedback initial settings
	
	//changeGain.gain.value = 1.0;
	//inputPoint.connect(changeGain);
	//changeGain.connect(audioContext.destination);
	inputPoint.connect(audioContext1.destination);
	
	return navigator.mediaDevices.enumerateDevices();
}

function gotStream2(stream) {
	window.stream = stream; // make stream available to console
	
	// Create an AudioNode from the stream.
	var realAudioInput = audioContext2.createMediaStreamSource(stream);
	var audioInput = realAudioInput;
	
	var inputPoint = audioContext2.createGain();
	inputPoint.gain.value = 1.0;
	audioInput.connect(inputPoint);
	//audioInput = convertToMono( input );
	
	analyserNode = audioContext2.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );
	
	audioRecorder2 = new Recorder( inputPoint ); // this fuck what the fuck
	// speak / headphone feedback initial settings
	
	//changeGain.gain.value = 1.0;
	//inputPoint.connect(changeGain);
	//changeGain.connect(audioContext.destination);
	inputPoint.connect(audioContext2.destination);
	
	return navigator.mediaDevices.enumerateDevices();
}
function initAudio(index) {
	if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
			track.stop();
		});
	}
	
	var audioSource = index.value;
	var idconfirm = index.parentNode;
	console.log(idconfirm);
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
	
	if(idconfirm.id == "track1")
		navigator.mediaDevices.getUserMedia(constraints).then(gotStream1).catch(handleError);
	if(idconfirm.id == "track2")
		navigator.mediaDevices.getUserMedia(constraints).then(gotStream2).catch(handleError);
	
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

