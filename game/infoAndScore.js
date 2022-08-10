function outputInfo(title,artist,difficulty) {
    eid('info-title').textContent = title;
    eid('info-artist').textContent = artist;
    eid('info-difficulty').textContent = difficulty;
}

var statistics,
hitData = [],
hitDataMs = [],
combo = 0;
function infoReset() {
    statistics = {
        normalNoteCount: 0,
        maxCombo: 0,
        drumrollTotal: 0,
        hits: {
            good: 0,
            okay: 0,
            miss: 0
        }
    };
    combo = 0;

    eid('game-stats-dg-accuracy').textContent = '--.--%';
    eid('game-stats-dg-combo').textContent = 0;
	
	hitData.length = 0;
	hitDataMs.length = 0;
}
function infoAddHit(hit) {
    if(hit in statistics.hits) {
        statistics.hits[hit]++;
		hitData.push(hit);
    
		if(hit === 'miss') {
			combo = 0;
		} else {
			combo++;
			statistics.maxCombo = Math.max(
				statistics.maxCombo,
				combo
			);
		}
		outputGameplayInfo();
	}
}
function infoAddDrumroll() {
    statistics.drumrollTotal++;
}
function getAccuracy() {
    return (getAccuracyRaw() * 100).toFixed(2) + '%';
}
function getAccuracyRaw() {
    return (
        (statistics.hits.good + (statistics.hits.okay * 0.5)) / 
        (statistics.hits.good + statistics.hits.okay + statistics.hits.miss)
    );
}
function outputGameplayInfo() {
    eid('game-stats-dg-accuracy').textContent = getAccuracy();
    eid('game-stats-dg-combo').textContent = combo;
}
function isFullCombo() {return statistics.hits.miss === 0}
function isPerfectAccuracy() {return getAccuracyRaw() === 1}

function outputGameplayInfoFinal() {
    eid('game-stats-good').textContent = statistics.hits.good;
    eid('game-stats-okay').textContent = statistics.hits.okay;
    eid('game-stats-miss').textContent = statistics.hits.miss;

    //accuracy
    eid('game-stats-accuracy').textContent = getAccuracy();
    if(isPerfectAccuracy()) {eid('game-stats-accuracy').classList.add('hilight')}

	//max combo
    eid('game-stats-max-combo').textContent = statistics.maxCombo;
    if(isFullCombo()) {eid('game-stats-max-combo').classList.add('hilight')}

	//drumroll
    eid('game-stats-drumroll').textContent = statistics.drumrollTotal;
	
	//timedata
	var td = analyzeTimeData();
	//  img
	eid('game-stats-histogram').src = createTimeGraph(td.histogram);
	//  misc data
	eid('game-stats-late').textContent = td.late;
	eid('game-stats-early').textContent = td.early;
	eid('game-stats-average').textContent = td.average.toFixed(2);
}

function analyzeTimeData(histogramScale) {
	if(!histogramScale) {histogramScale = 2}
	var histogram = {
		max: 0,
		scale: histogramScale
	};
	var late = 0, early = 0, allMs = 0;

	hitDataMs.forEach((ms)=>{
		//histogram
		var ths = Math.floor(ms / histogramScale),
		thsa = histogram[ths];
		if(ths in histogram) {
			histogram[ths]++;
		} else {
			histogram[ths] = 1;
		}
		histogram.max = Math.max(
			histogram.max,
			histogram[ths]
		);
		
		//late/early
		if(ms > 0) {
			late++;
		} else {
			early++;
		}
		
		//for average
		allMs += ms;
	});
	
	return {
		histogram: histogram,
		late: late,
		early: early,
		average: (allMs / hitDataMs.length)
	};
}
var createTimeGraph = (function(){
	var cv,
	ctx;
	
	return function(
		histogram,
		mainColor,
		targetColor,
		w,h
	) {
		if(!histogram) {throw 'please pass a histogram';}

		if(!w) {w = 200}
		if(!h) {h = 70}
		if(!mainColor) {mainColor = '#fff'}
		if(!targetColor) {targetColor = null}
		
		if(!cv) {
			cv = document.createElement('canvas'),
			ctx = cv.getContext('2d');
		}
		
		cv.width = w;
		cv.height = h;
		
		ctx.clearRect(
			0, 0,
			w, h
		);
		
		var histogramScale = histogram.scale,
		histogramMax = histogram.max;
		delete histogram.scale;
		delete histogram.max;
		var histogramScaledEdge = Math.ceil(hitWindow.miss / histogramScale);
		
		var recW = Math.floor((1 / (histogramScaledEdge * 2)) * w);

		ctx.fillStyle = mainColor;
		var hsk = Object.keys(histogram);
		hsk.forEach((hb)=>{
			var count = histogram[hb];
			hb = parseInt(hb);
			
			var recH = Math.ceil((count / histogramMax) * h);
			
			ctx.fillRect(
				(hb + histogramScaledEdge) * recW,
				h - recH,
				recW,
				recH
			);
		});
		
		if(targetColor !== null) {
			ctx.fillStyle = targetColor;
			ctx.fillRect(
				((recW * histogramScaledEdge) - 1),
				0, 2, h
			);
		}
		
		//center the image
		var i = ctx.getImageData(0,0,w,h);
		ctx.clearRect(0,0,w,h);
		ctx.putImageData(
			i,
			Math.floor(((w - (histogramScaledEdge * 2)) / 2) - histogramScaledEdge),
			0
		);
		
		return cv.toDataURL();
	}
})();

var showJudgeOffset = getSettingValue('show-judge-offset') === 1;
function outputJudgeOffset(offset,manLate) {
    if(showJudgeOffset) {
        if(typeof(offset) === 'number') {
            if(typeof(manLate) === 'undefined') {
                manLate = (offset > 0);
            }

            offset = offset.toFixed(0);
        }

        eid('judge-offset').textContent = offset;
        eid('judge-offset').classList.remove('late','early');
        
        if(typeof(manLate) === 'boolean') {
            eid('judge-offset').classList.add(
                manLate? 'late' : 'early'
            );
        }
    }
    
}

function updateBpm(e) {
    var bpm;
    if(e) {
        bpm = e.detail.newBpm;
    } else {
        bpm = metronome.getBpm().bpm;
    }

    var tf = 0,
    bpmSigCheck = bpm % 1;
    if(
        bpmSigCheck > 0.01 &&
        bpmSigCheck < 0.99
    ) {
        tf = 2;
    }
    bpm = bpm.toFixed(tf);

    eid('bpm-display').textContent = bpm;
}
window.addEventListener('bpmchange',updateBpm);
