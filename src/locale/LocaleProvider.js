var LocaleProvider = (function(){
	var locales = {};

	return {
		register: function(localId, localeData){
			locales[localId] = localeData;
		},
		getLocale: function(localId){
			return locales[localId];
		}
	};
})();