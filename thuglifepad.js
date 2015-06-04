//utility
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};



var ThugLifePad = (function() {
	var container = document.getElementById('container');
	var player = new Audio();
	var timeout = null;
	var bar = document.getElementById('bar');
	var BARS_INTERVAL = 100;
	var barTimeoutId = null;

	var init = function(data) {
		for(var i=0; i<data.length; i++) {
			container.appendChild(loadElement(data[i]));
		}
	}

	var preload = function(e,div) {
		var audio = document.createElement('audio');
		audio.preload = true;
		audio.oncanplaythrough = function() {
			e.preloaded = true;
			div.style.opacity = '1';
		}
		audio.src = e.path;
	}

	var loadBar = function(e) {
		var bar = document.createElement('div');
		bar.className = 'bar songBar';
		e.bar = bar;

		return bar;
	}

	var loadElement = function(e) {
		var div = document.createElement('div');
		div.className = 'pad-element';
		div.style.backgroundColor = e.color;
		div.style.opacity = '0.5';
		div.innerText = e.title;
		div.onclick = getClickHandler(e,div);
		div.appendChild(loadBar(e));
		preload(e,div);
		return div;
	}

	var getBarIntervalHandler = function(e,div) {
		var myself = function() {
			//console.log(player.currentSrc)
			if(player.ended || player.paused || player.src.split('/').last() != e.path.split('/').last()) {
				e.bar.style.width = '0%';
				return;
			}

			var current = player.currentTime;
			var duration = player.duration;

			e.bar.style.width = 100*current/duration + '%';

			setTimeout(myself,BARS_INTERVAL);
		}

		return myself;
	}

	var getClickHandler = function(e,div) {
		return function() {
			if(!e.preloaded) {
				console.log("audio not preloaded yet");
				return;
			}

			timeout && clearTimeout(timeout);
			timeout = null;

			player.pause();
			player.volume = 1;
			bar.style.width = '0%';

			player.pause();
			player.src = e.path;
			player.play();

			player.onplay = function() {
				getBarIntervalHandler(e,div)();
			}
		}
	}

	var fadeOut = function() {
		if(timeout) return;

		var DELTA = 0.01;
		var TIMEDELTA = 40;
		var lowerVolume = function() {
			if(player.volume > 0 && !player.ended) {
				if(player.volume - DELTA >= 0) {
					player.volume -= DELTA;
				} else {
					player.volume = 0;
				}

				bar.style.width = player.volume*100 + '%';
				timeout = setTimeout(lowerVolume,TIMEDELTA);
			} else {
				player.pause();
				player.volume = 1;
				bar.style.width = '0%';
			}
		}

		lowerVolume();
	}


	return {
		init:init,
		fadeOut:fadeOut
	};
})();

var data = [
	{title: 'Smoke Weed Everyday', path: 'audio/swe.mp3', color: '#FF0000'},
	{title: 'Smoke Weed Everyday [FULL]', path: 'audio/swe_full.mp3', color: '#cccc00'},
	{title: 'Move [BOOM] bitch get out the way 2x', path: 'audio/move_bitch.mp3', color: '#00FF00'},
	{title: 'Dr Dre Snoop', path: 'audio/dr_dre_snoop.mp3', color: '#6666FF'},
	{title: 'Tequila!', path: 'audio/tequila.mp3', color: '#66FFFF'},
	{title: 'Tequila [FULL]', path: 'audio/tequila_full.mp3', color: '#FF66FF'},
	{title: 'Serial Killa', path: 'audio/serial_killa.mp3', color: '#0066FF'},
	{title: 'Ding Dong', path: 'audio/ding_dong.mp3', color: '#FF6600'},
	{title: 'Ice Cube Dre', path: 'audio/ice_cube_dre.mp3', color: '#FF0066'},
	{title: 'Fuck THA Police', path: 'audio/fuck_the_police.mp3', color: '#bbbbbb'},
	{title: 'snoopdoooog', path: 'audio/snoopdoooog.mp3', color: '#bb00bb'},
	{title: 'snoopdoooog [FULL]', path: 'audio/snoopdoooog_full.mp3', color: '#00bbbb'},
];

ThugLifePad.init(data);

document.getElementById('stop').onclick = ThugLifePad.fadeOut;