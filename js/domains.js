/*jslint esversion: 6*/
Domains = (function (lexic) {
	'use strict';

	let domains = {};

	domains.all = {};

	// domain entry
	class Entry
	{
		constructor (type, filter, modify)
		{
			this.type = type;
			if (filter) this.filter = filter;
			if (modify) this.modify = modify;
		}

		filter () { console.warn('Default Domains.Entry.filter fallback!'); return false; }
		modify () { console.warn('Default Domains.Entry.modify fallback!'); }

		toString () { return `[Entry] type="${this.type}"`; }
	}
	domains.Entry = Entry;

	class Entity
	{
		constructor (word)
		{
			this.source = word;
			this.root = word.toLowerCase();
			this.type = 'unknown';
		}

		toString () { return `[Entity "${this.type}"]`; }
	}
	domains.Entity = Entity;

	function defineEntity (domain, entity)
	{
		if (typeof entity === typeof '')
		{
			entity = new Entity(entity);
			lexic.processEntity(entity);
		}

		for (let di = 0; di < domain.length; di++)
		{
			if (domain[di].filter(entity))
			{
				entity.type = domain[di].type;
				domain[di].modify(entity);
			}
		}
		return entity;
	}

	domains.defineEntities = function defineEntities (domain, scopes) {
		for (let si = 0; si < scopes.length; si++)
		{
			let scope = scopes[si];
			if (Array.isArray(scope) && scope.length)
			{
				defineEntities(domain, scope);
			}
			else
			{
				scopes[si] = defineEntity(domain, scope);
			}
		}
	};

	return domains;
})(Lexic);