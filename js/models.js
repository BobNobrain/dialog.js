/*jslint esversion: 6*/
Models = (function () {
	'use strict';
	let models = {};

	class Model
	{
		constructor (modelParts)
		{
			this.parts = modelParts;
		}

		match (scope)
		{
			return null; // no match
		}
	}
	models.Model = Model;

	class ModelPart
	{
		constructor (name, matcher)
		{
			this.name = name;
			if (typeof matcher === typeof Function)
				this.match = matcher;
		}

		match (entity)
		{
			return false;
		}
	}
	models.ModelPart = ModelPart;

	models.all = [];

	models.applyModifiers = function (scopes) {
		// ...
	};

	return models;
})();