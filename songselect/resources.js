(()=>{
	//styles
    [
        'style'
    ].forEach((fn)=>{
        addGlobalReference(1, fn);
    });
	
    //scripts
    [
        //'exampledata',

        'songListMananger',
        'modsDisplay',
		'groupSortManager',
        'misc',
        'speedControl',
        'options',
        'intro',
		'media',
		'hintsDisplay',
		'updateSongInfoDisplay',
        'script',
		'listSong',
		'listDifficulty'
    ].forEach((fn)=>{
        addGlobalReference(0, fn);
    });
})();