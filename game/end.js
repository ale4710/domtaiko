var endedPageN;
var ended = false;
var endedAllowContinue = false;
var modsDisplayEnd = (new ModsView(
	1,
	eid('game-stats-extra-info-mods')
));
function end(messageOverride) {
    ended = true;
    document.body.classList.remove('special');
    outputGameplayInfoFinal();

    var message;
	if(messageOverride) {
		message = messageOverride;
	} else if(isPerfectAccuracy()) {
        message = 'Perfect!';
    } else if(isFullCombo()) {
        message = 'Full Combo!';
    } else if(autoplayEnabled) {
        message = 'I tried my best.';
    } else {
        message = 'Song Complete!';
    }
    eid('end-display-in').textContent = message;

    document.body.classList.add('ended');
	
	bottomStage.finish();
	
    setTimeout(()=>{
        if('artistDisplayMode' in gameFile) {
            switch(gameFile.artistDisplayMode) {
                case 0: //hide it
                    outputInfo(
                        gameFile.title,
                        '',
                        gameFile.difficulty
                    );
                    break;
                case 1: //show next to title
                    outputInfo(
                        gameFile.title + ' ' + gameFile.artist,
                        '',
                        gameFile.difficulty
                    );
                    break;
            }
        }

        document.body.classList.add('show-stats');

        gameLoopStop();

        setTimeout(()=>{
			curpage = endedPageN;
			updatenavbar();
			showNavbar(true);
			transparentNavbar(true);
		}, 500);
    },1500);
}

function postExtraInfo(info) {
	if(typeof(info) === 'string') {
		info = [info];
	} else if(!Array.isArray(info)) {
		throw TypeError('info needs to be an array.');
	}
	info.forEach((infotype)=>{
		switch(infotype) {
			case 'time':
				//just steal the values from the html elements XD
				eid('game-stats-extra-info-progress').classList.remove('hidden');
				eid('game-stats-extra-info-progress-percent').textContent = (eid('progress').value * 100).toFixed(2);
				eid('game-stats-extra-info-progress-time-remain').textContent = eid('progress-text').textContent;
				break;
			default:
				return; //continue info foreach
		}
	});
}

function exitToSongSelect() {
	location = '/songselect/index.html#' + (new URLSearchParams({
		'goto': 'songlist',
		'select-random': 0
	})).toString();
}

var showDetailedStatsClassList = 'show-stats-detailed';

endedPageN = (function(){
	function endedK(k) {
		switch(k.key) {
			case 'Enter':
			case 'Backspace':
				exitToSongSelect();
				break;
			case 'SoftLeft':
				document.body.classList.toggle(showDetailedStatsClassList);
				break;
		}
	}
	
	function endedNavbar() {
		return [
			document.body.classList.contains(showDetailedStatsClassList)? 'hide' : 'details',
			'continue'
		]
	}
	
	return addPage(
		endedK,
		endedNavbar
	);
})();