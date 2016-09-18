/*jslint esversion: 6*/
Lexic = (function (){
	'use strict';
	let lexic = {};

	// enum
	lexic.Times = {
		UNKNOWN: 0,
		PRESENT: 1,
		PAST: 2,
		FUTURE: 3
	};

	class Lexic
	{
		constructor (word)
		{
			this.root = word;
			this.suffixes = [];
			this.time = lexic.Times.UNKNOWN;
			this.probableParts = false;
		}

		break ()
		{
			let isIrregular = processIrregulars(this);
			if (isIrregular)
			{
				// this.root = irregular.root;
				// this.time = irregular.time;
				// this.probableParts = ['verb'];
			}
			else
			{
				breakWord(this);
			}
		}

		toString () { return this.root + '|' + this.suffixes.join(':'); }
	}
	lexic.Lexic = Lexic;

	let suffixes = [
		{ value: 'ed', parts: [ 'verb', 'adjective' ] },
		{ value: 'ize', parts: [ 'verb' ] },
		{ value: 'al', parts: [ 'adjective' ] },
		{ value: 'er', parts: [ 'noun' ] },
		{ value: 'or', parts: [ 'noun' ] },
		{ value: 'ment', parts: [ 'noun' ] }
	];


	let helperVerbs = [
		{ value: 'is', root: 'be', time: lexic.Times.PRESENT },
		{ value: 'are', root: 'be', time: lexic.Times.PRESENT },
		{ value: 'am', root: 'be', time: lexic.Times.PRESENT },
		{ value: 'was', root: 'be', time: lexic.Times.PAST },
		{ value: 'were', root: 'be', time: lexic.Times.PAST },
		{ value: 'be', root: 'be', time: lexic.Times.PRESENT },

		{ value: 'do', root: 'do', time: lexic.Times.PRESENT },
		{ value: 'did', root: 'do', time: lexic.Times.PAST },
		{ value: 'done', root: 'do', time: lexic.Times.PAST }
	];

	function findSuffix (word, suffix)
	{
		if (word.endsWith(suffix)) return word.substr(0, word.length - suffix.length);
		if (suffix.endsWith('e')) // special case for 'ee' is able to be merged into 'e'
		{
			if ((word + 'e').endsWith(suffix)) return word.substr(0, word.length - suffix.length + 1);
		}
		return word;
	}

	function processIrregulars (lex)
	{
		// processing helpers
		for (let i = 0; i < helperVerbs.length; i++)
		{
			if (helperVerbs[i].value == lex.root)
			{
				lex.root = helperVerbs[i].root;
				lex.time = helperVerbs[i].time;
				lex.probableParts = ['verb'];
				return true;
			}
		}
		return false;
	}

	function breakWord (lex)
	{
		// let broken = {
		// 	suffixes: [],
		// 	probableParts: false
		// };

		let root = lex.root;
		let found = root;
		let done = false;

		while (!done)
		{
			done = true;
			for (let i = 0; i < suffixes.length; i++)
			{
				found = findSuffix(root, suffixes[i].value);
				if (found !== root)
				{
					done = false;
					lex.suffixes.push(suffixes[i].value);
					if (!lex.probableParts) 
						lex.probableParts = suffixes[i].parts;
					root = found;
				}
			}
		}

		lex.root = root;

		return lex;
	}

	lexic.processEntity = function (entity)
	{
		let lex = new Lexic(entity.root);
		lex.break();
		entity.root = lex.root;
		entity.lexic = lex;
		if (lex.probableParts && lex.probableParts.length)
			entity.type = lex.probableParts[0];
	};

	return lexic;
})();
