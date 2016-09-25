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
			this.prefixes = [];
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
			assemblyBack(this);
		}

		toString ()
		{
			return this.prefixes.join(':') + '|' + this.root + '|' + this.suffixes.reverse().join(':');
		}
	}
	Lexic.prototype[Symbol.for('auto-collapse')] = true;
	lexic.Lexic = Lexic;

	let suffixes = [
		{ value: 'ed', parts: [ 'verb', 'adjective' ] },
		{ value: 'ize', parts: [ 'verb' ] },

		{ value: 'al', parts: [ 'adjective' ] },
		{ value: 'ish', parts: [ 'adjective' ] },
		{ value: 'able', parts: [ 'adjective' ] },
		{ value: 'ible', parts: [ 'adjective' ] },
		{ value: 'less', parts: [ 'adjective' ], modifiers: [ 'point.negation' ] },
		{ value: 'ful', parts: [ 'adjective' ], modifiers: [ 'point.enlarge' ] },

		//{ value: 'y', parts: [ 'adverb' ] },

		{ value: 'ing', parts: [ 'noun', 'adjective' ] },

		{ value: 'er', parts: [ 'noun' ] },
		{ value: 'or', parts: [ 'noun' ] },
		{ value: 'ness', parts: [ 'noun' ] },
		{ value: 'ment', parts: [ 'noun' ] }
	];

	let prefixes = [
		{ value: 'pre' },
		{ value: 're' },
		{ value: 'in', modifiers: [ 'point.negation' ] },
		{ value: 'im', modifiers: [ 'point.negation' ] },
		{ value: 'un', modifiers: [ 'point.negation' ] },
		{ value: 'un', modifiers: [ 'point.negation' ] },
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

		// suffixes
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
					if (suffixes[i].modifiers)
					{
						if (!lex.modifiers) lex.modifiers = [];
						lex.modifiers = lex.modifiers.concat(suffixes[i].modifiers);
					}
					if (!lex.probableParts) 
						lex.probableParts = suffixes[i].parts;
					root = found;
				}
			}
		}

		// prefixes
		done = false;
		let untriedPrefixes = prefixes.slice();
		while (!done)
		{
			done = true;
			for (let i = 0; i < untriedPrefixes.length; i++)
			{
				if (root.startsWith(untriedPrefixes[i].value))
				{
					done = false;
					root = root.substr(untriedPrefixes[i].value.length, root.length);
					lex.prefixes.push(untriedPrefixes[i].value);
					if (untriedPrefixes[i].modifiers)
					{
						if (!lex.modifiers) lex.modifiers = [];
						lex.modifiers = lex.modifiers.concat(untriedPrefixes[i].modifiers);
					}

					untriedPrefixes.splice(i, 1);
					break;
				}
			}
		}

		lex.root = root;

		return lex;
	}

	function assemblyBack (lex)
	{
		// TODO: obtain a database with existing word roots,
		// then check the existence of lex.root in it;
		// if not, try to append some suffixes back and search again
		// if succedeed, save assemblied root and the rest suffixes/prefixes
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
