/*jslint esversion: 6*/
(function ({ ModelPart, Model, all }, BNF) {
	'use strict';

	// simple actor-action-object model
	let actorPart = new ModelPart('actor', function aaoActorMatcher (entity)
	{
		if (!entity.lexic.probableParts.indexOf('noun') && !entity.lexic.isPronoun) return false;
		return true;
	});

	let actionPart = new ModelPart('action', function aaoActionMatcher (entity)
	{
		if (!entity.lexic.probableParts.indexOf('verb')) return false;
		return true;
	});

	let objectPart = new ModelPart('object', function aaoObjectMatcher (entity)
	{
		if (!entity.lexic.probableParts.indexOf('noun') && !entity.lexic.isPronoun) return false;
		return true;
	});

	let parts = [actorPart, actionPart, objectPart];

	let aaoModel = new Model(parts, new BNF('aao', '<actor> <action> <object>', parts).getMatcher());
})(Models, BNF);
