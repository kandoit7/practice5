/* 
window.AudioContext = window.AudioContext || window.webkitAudioContext;

function recordCap() {
	this.masterInputSelector = document.createElement('select');
	this.audioContext = new AudioContext();
	this.audioRecorder = null;
	this.Track = null;
	this.rafID = null;
	this.canvasID = null;
	this.analyserContext = null;
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
		
		var audioSource = index.value;
		var constraints = {
			audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
		};
		navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
		console.log("start");
	};
	
	this.handleError = function(error) {
		console.log('navigator.getUserMedia error: ', error);
	};
	
	navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
	
	initAudio(0);
}

var onetrack = recordCap();
var twotrack = recordCap();
*/
/* Copyright 2013 Chris Wilson
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var audioInputSelect1 = document.querySelector('select#change1');
var audioInputSelect2 = document.querySelector('select#change2');

var selectors1 = [audioInputSelect1];
var selectors2 = [audioInputSelect2];
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
//var audioInput = null;
//var realAudioInput = null;
var audioRecorder1 = null;
var audioRecorder2 = null;
var Track = null;    
var rafID = null;
var canvasID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var lrecord = null;
var firstlink = null;
var tracklink = null;
//var link = null;

function gotBuffers( buffers ) {
	var ci = "c"+canvasID;
   	var canvas = document.getElementById(ci);
	//reference audiodisplay.js 
	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
	// the ONLY time gotBuffers is called is right after a new recording is completed - 
	// so here's where we should set up the download.
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

function toggleRecording1( e ) {
	canvasID = e.id;
	var imgchange = e;
	if (e.classList.contains("recording")) {
	// stop recording
		audioRecorder1.stop();
		e.classList.remove("recording");
		audioRecorder1.getBuffers( gotBuffers );
		imgchange.src = 'images/mic.png'
		link = document.getElementById('save');
		lrecord = "l" + e.id;
	} else {
	// start recording  
		if (!audioRecorder1)
	    		return;
	
		e.classList.add("recording");
		audioRecorder1.clear();
		audioRecorder1.record();
		imgchange.src = 'images/micrec.png'
	}

}
function toggleRecording2( e ) {
	canvasID = e.id;
	var imgchange = e;
	if (e.classList.contains("recording")) {
	// stop recording
		audioRecorder2.stop();
		e.classList.remove("recording");
		audioRecorder2.getBuffers( gotBuffers );
		imgchange.src = 'images/mic.png'
		link = document.getElementById('save');
		lrecord = "l" + e.id;
	} else {
	// start recording  
		if (!audioRecorder2)
	    		return;
	
		e.classList.add("recording");
		audioRecorder2.clear();
		audioRecorder2.record();
		imgchange.src = 'images/micrec.png'
	}
}

function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function gotDevices1(deviceInfos) {
   var values = selectors1.map(function(select) {
    return select.value;
  });
  selectors1.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || 'microphone ' + (audioInputSelect1.length + 1);
      audioInputSelect1.appendChild(option);
    } 
  }
  selectors1.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });
}

function gotDevices2(deviceInfos) {
   var values = selectors2.map(function(select) {
    return select.value;
  });
  selectors2.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || 'microphone ' + (audioInputSelect2.length + 1);
      audioInputSelect2.appendChild(option);
    } 
  }
  selectors2.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });
}

function gotStream1(stream) {
	window.stream = stream; // make stream available to console
	
	// Create an AudioNode from the stream.
	var realAudioInput = audioContext.createMediaStreamSource(stream);
	var audioInput = realAudioInput;
	
	var inputPoint = audioContext.createGain();
	inputPoint.gain.value = 1.0;
	audioInput.connect(inputPoint);
	//audioInput = convertToMono( input );
	
	var analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );
	
	audioRecorder1 = new Recorder( inputPoint ); // this fuck what the fuck
	// speak / headphone feedback initial settings
	
	//changeGain.gain.value = 1.0;
	//inputPoint.connect(changeGain);
	//changeGain.connect(audioContext.destination);
	inputPoint.connect(audioContext.destination);
	
	return navigator.mediaDevices.enumerateDevices();
}

function gotStream2(stream) {
	window.stream = stream; // make stream available to console
	
	// Create an AudioNode from the stream.
	var realAudioInput = audioContext.createMediaStreamSource(stream);
	var audioInput = realAudioInput;
	
	var inputPoint = audioContext.createGain();
	inputPoint.gain.value = 1.0;
	audioInput.connect(inputPoint);
	//audioInput = convertToMono( input );
	
	var analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );
	
	audioRecorder2 = new Recorder( inputPoint ); // this fuck what the fuck
	// speak / headphone feedback initial settings
	
	//changeGain.gain.value = 1.0;
	//inputPoint.connect(changeGain);
	//changeGain.connect(audioContext.destination);
	inputPoint.connect(audioContext.destination);
	
	return navigator.mediaDevices.enumerateDevices();
}
function initAudio1() {
	if (window.stream) {
    		window.stream.getTracks().forEach(function(track) {
        		track.stop();
        	});
    	}
    	
	var audioSource = audioInputSelect1.value;
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
    	navigator.mediaDevices.getUserMedia(constraints).then(gotStream1).then(gotDevices1).catch(handleError);
    	console.log("initAudio");
}
function initAudio2() {
	if (window.stream) {
    		window.stream.getTracks().forEach(function(track) {
        		track.stop();
        	});
    	}
    	
	var audioSource = audioInputSelect2.value;
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
    	navigator.mediaDevices.getUserMedia(constraints).then(gotStream2).then(gotDevices2).catch(handleError);
    	console.log("initAudio");
}


function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.enumerateDevices().then(gotDevices1).catch(handleError);
navigator.mediaDevices.enumerateDevices().then(gotDevices2).catch(handleError);
initAudio1();
initAudio2();
/*

var masterInputSelector = document.createElement('select');

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

function initAudio(index) {
	if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
			track.stop();
		});
	}
	
	var audioSource = index.value;
	var constraints = {
		audio: { deviceId: audioSource ? {exact: audioSource} : undefined}
	};
	navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

*/
