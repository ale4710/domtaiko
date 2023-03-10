(()=>{
    var bg = '/common/',
    lib = 'lib/',
    user = 'js/';
	
	//styles
    [
        'utilStyle',
        'widgets',
        'style',
        'misc',
        'theme'
    ].forEach((fn)=>{
        addGlobalReference(1, 
            bg + 'css/' + fn
        );
    });
	
    //scripts
    [
        //lib
        //lib+'localforage',
        lib+'md5',
		lib+'taffy-min',
        //normal scripts
		user+'frameShowManager',
		user+'compat',
        user+'etcf',
        user+'settings',
        user+'gameFn',
        user+'textEncoding',
        user+'classes',
		user+'control',
        user+'mods',
        user+'volumeControl',
        user+'deviceStorage',
		user+'databaseTools',
        user+'database',
        user+'messageBox',
        user+'elements',
        user+'tjaParse',
        user+'osuParse',
        user+'resourceAdder',
		
		//user+'test'
    ].forEach((fn)=>{
        addGlobalReference(0, 
            bg + fn
        );
    });
})();