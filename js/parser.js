/*jslint esversion: 6*/
Parser = (function () {
	'use strict';

	let parser = {};

	let scopeDelims = [ '!?.', ';', ',', ' -' ];
	parser.createScopes = function createScopes (text, level = 0) {
		if (level >= scopeDelims.length) return text;
		let globalScope = [];

		let textLen = text.length;
		let scopeStart = 0;
		for (let i = 0; i <= textLen; i++)
		{
			if (i === textLen || scopeDelims[level].indexOf(text[i]) !== -1)
			{
				if (i == scopeStart) {
					// empty entry
					scopeStart = i+1;
					continue;
				}
				globalScope.push(text.substring(scopeStart, i));
				scopeStart = i+1;
			}
		}

		for (let i = 0; i < globalScope.length; i++)
		{
			globalScope[i] = createScopes(globalScope[i], level + 1);
		}

		return globalScope;
	};

	return parser;
})();