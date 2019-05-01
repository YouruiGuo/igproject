var app = new Framework7();

var $$ = Dom7;

// DOM events for About popup
$$('.popup-about').on('popup:open', function (e, popup) {
  //console.log('About popup open');
});
$$('.popup-about').on('popup:opened', function (e, popup) {
  //console.log('About popup opened');
});

function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
  seconds_int = length - minutes * 60,
  seconds_str = seconds_int.toString(),
  seconds = seconds_str.substr(0, 2),
  time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
	var current_hour = parseInt(currentTime / 3600) % 24,
  current_minute = parseInt(currentTime / 60) % 60,
  current_seconds_long = currentTime % 60,
  current_seconds = current_seconds_long.toFixed(),
  current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}

function initProgressBar() {
  var player = document.getElementById('player');
  var length = player.duration
  var current_time = player.currentTime;

  // calculate total length of value
  var totalLength = calculateTotalValue(length)
  $$(".end-time").innherHTML = totalLength;

  // calculate current value time
  var currentTime = calculateCurrentValue(current_time);
  $$(".start-time").innerHTML = currentTime;

  var progressbar = document.getElementById('seekObj');
	console.log(player.currentTime / player.duration);
  progressbar.value = (player.currentTime / player.duration);
  progressbar.addEventListener("click", seek);

  if (player.currentTime == player.duration) {
    $$('#play-btn').removeClass('pause');
  }

  function seek(evt) {
    var percent = evt.offsetX / this.offsetWidth;
    player.currentTime = percent * player.duration;
    progressbar.value = percent / 100;
  }
};

function initPlayers() {
  // pass num in if there are multiple audio players e.g 'player' + i
		console.log("initplayers");
		//$$('#play-btn').addClass('pause');
	  // Variables
	  // ----------------------------------------------------------
	  // audio embed object
	  var playerContainer = document.getElementById('player-container'),
	    player = document.getElementById('player'),
	    isPlaying = false,
	    playBtn = document.getElementById('play-btn');
	  // Controls Listeners
	  // ----------------------------------------------------------
	  if (playBtn != null) {
	    playBtn.addEventListener('click', function() {
	      togglePlay()
	    });
	  }

	  // Controls & Sounds Methods
	  // ----------------------------------------------------------
	  function togglePlay() {
	//console.log("play button triggered");
			if ($$('#play-btn').hasClass('pause')) {
	      audio.resume();
	      $$('#play-btn').removeClass('pause');
	      isPlaying = true;
	    }
			else {
		    audio.suspend();
				isPlaying = false;
	      $$('#play-btn').addClass('pause');
		  }
	  }

}

initPlayers();
/*
class musicPlayer {
	constructor() {
		this.play = this.play.bind(this);
		this.playBtn = document.getElementById('play');
		this.playBtn.addEventListener('click', this.play);
		this.controlPanel = document.getElementById('control-panel');
	}

	play() {
		let controlPanelObj = this.controlPanel;
		playAndPause();
		Array.from(controlPanelObj.classList).find(function(element){
					return element !== "active" ?
controlPanelObj.classList.add('active') : 		controlPanelObj.classList.remove('active');
			});
	}
}

const newMusicplayer = new musicPlayer();
*/
