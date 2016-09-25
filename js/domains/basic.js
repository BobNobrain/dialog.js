/*jslint esversion: 6*/
(function (domains) {
	let Basic = [];

	let junkRoots = ['a', 'the', 'also', 'oh', 'wow', 'hello', 'please', 'plz', 'pls', 'sorry'];

	let junkEntry = new domains.Entry('junk',
		function filterJunk (entity)
		{
			if (junkRoots.indexOf(entity.root) !== -1) return true;
			return false;
		});
	Basic.push(junkEntry);

	let numberEntry = new domains.Entry('number',
		function filterNumber (entity)
		{
			return !isNaN(+entity.root) && entity.root.length;
		},
		function modifyNumber (entity)
		{
			entity.decimalValue = +entity.root;
		});
	Basic.push(numberEntry);

	let closureIndex = -1;

	let modifiers = [
		{ value: 'not', type: 'point.negation' },
		{ value: 'very', type: 'point.enlarge' },
		{ value: 'quite', type: 'ensurancy.quite' },

		{ value: 'will', type: 'time.future' }
	];
	let modifierEntry = new domains.Entry('modifier',
		function filterModifier (entity)
		{
			for (let i = 0; i < modifiers.length; i++)
			{
				if (modifiers[i].value === entity.root)
				{
					closureIndex = i;
					return true;
				}
			}
			return false;
		},
		function modifyModifier (entity)
		{
			entity.modifierType = modifiers[closureIndex];
			closureIndex = -1;
		});
	Basic.push(modifierEntry);

	let modalVerbs = [
		{ value: 'can', type: 'ability' },
		{ value: 'cannot', type: 'ability', modifiers: ['point.negation'] },
		{ value: 'able', type: 'ability' }
	];
	let modalVerbEntry = new domains.Entry('modalVerb',
	function modalVerbFilter (entity)
	{
		for (let i = 0; i < modalVerbs.length; i++)
		{
			if (modalVerbs[i].value === entity.root)
			{
				closureIndex = i;
				return true;
			}
		}
		return false;
	},
	function modifyModalVerb (entity)
	{
		entity.modalType = modalVerbs[closureIndex];
		closureIndex = -1;
	});
	Basic.push(modalVerbEntry);

	domains.all.Basic = Basic;
})(Domains);