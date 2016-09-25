/*jslint esversion: 6*/
BNF = (function () {
	'use strict';

	let bnfEntityPattern = /<[A-Za-z0-9]*?>/g;

	class BNF
	{
		constructor (name, bnf, dependencies = [])
		{
			this.name = name;
			this.source = bnf;
			this.deps = dependencies;
			parseBnf(this);
		}

		match (entities)
		{
			return false;
		}

		createMatcher ()
		{
			return this.match.bind(this);
		}
	}

	// enum
	let BETypes = { UNKNOWN: 0, SINGLE: 1, CONSEQUENT: 2, OR: 3, GROUP: 4 };

	let BETypeEaters = [
		() => 0,

		// SINGLE: typeof content == BNF
		(content, entities, idx) => content.match(entities, idx)? 1 : 0,

		// CONSEQUENT: typeof content = BnfEntities[]
		(content, entities, idx) => {
			let result = 0;
			for (let i = 0; i < content.length; i++)
			{
				let res = content[i].eat(entities[idx + result]);
				if (res === 0) return 0;
				result += res;
			}
			return result;
		},

		// OR: typeof content = BnfEntities[]
		(content, entities, idx) => {
			for (let i = 0; i < content.length; i++)
			{
				let res = content[i].eat(entities, idx);
				if (res !== 0) return res;
			}
			return 0;
		},

		// GROUP: typeof content = BnfEntities[]
	];

	class BnfEntity
	{
		constructor (type, content)
		{
			this.type = type;
			this.content = content;
			this.eat = entities => BETypeEaters[this.type](this.content, entities, 0);
		}
	}

	let operators = [ '|' ];
	let quantifiers = [ '+', '*' ];

	function parseBnf (bnf)
	{
		let root = new BnfEntity(BETypes.CONSEQUENT, []);
	}

	return BNF;
})();