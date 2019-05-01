var app = new Framework7();

var $$ = Dom7;

// DOM events for About popup
$$('.popup-about').on('popup:open', function (e, popup) {
  //console.log('About popup open');
});
$$('.popup-about').on('popup:opened', function (e, popup) {
  //console.log('About popup opened');
});

function initPlayers() {
	console.log("initplayers");
	$$('#play-btn').addClass('pause');
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
