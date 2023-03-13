(()=>{
	//styles
    [
        'style',
        'playfield',
        'bg',
        'info'
    ].forEach((fn)=>{
        addGlobalReference(1, fn);
    });
	
    //scripts
    [
		'/common/lib/color-thief.umd',

        'etc',
        'controls',
        'audio',
		'bottomStage',
        'draw',
        'drawNoteTools',
        'drawSelect',
        'infoAndScore',
        'autoplay',
        'pause',
		'graphs',
        'end',
		'endDetailed',
        'timer',
        'game',
        'timeAdjust',
        'load'
    ].forEach((fn)=>{
        addGlobalReference(0, fn);
    });
})();