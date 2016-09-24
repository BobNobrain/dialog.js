/*jslint esversion:6*/
window.addEventListener('load', () => {
	window.el = {};
	window.el.reply = document.getElementById('reply');
	window.el.output = document.getElementById('output');
});

function reply ()
{
	let text = window.el.reply.value;

	// the processing itself
	let scopes = Parser.createScopes(text);
	Domains.defineEntities(Domains.all.Basic, scopes);

	// rendering
	window.el.output.innerHTML = renderArray('scopes', scopes);
	bindCollapses();
	console.log('parsed:', scopes);
}

function renderGeneric(name, generic)
{
	if (Array.isArray(generic)) return renderArray(name, generic);
	if (typeof generic === typeof {} && generic !== null) return renderObject(name, generic);
	return renderPrimitive(name, generic);
}

function renderArray (name, arr)
{
	let type = `Array[${arr.length}]`;
	let html = [];

	for (let i = 0; i < arr.length; i++)
	{
		html.push(renderGeneric(i, arr[i]));
	}
	return `<div class="prop compound array${ html.length? '':' empty' }">
				<div class="name">${name} <i>${type}</i></div>
				<div class="content">${html.join('')}</div>
			</div>`;
}

function renderObject (name, obj)
{
	let type = obj.toString();
	let html = [];

	for (let key in obj)
	{
		if (!obj.hasOwnProperty(key)) continue;
		html.push(renderGeneric(key, obj[key]));
	}

	let style = '';
	if (!html.length) style += ' empty';
	if (obj[Symbol.for('auto-collapse')]) style += ' collapsed';

	return `<div class="prop compound object${style}">
				<div class="name">${name} <i>${type}</i></div>
				<div class="content">${html.join('')}</div>
			</div>`;
}

function renderPrimitive (name, val)
{
	let type = typeof val;
	return `<div class="prop primitive">
				<span class="name">${name}</span>
				<span class="content ${type}">${val}</span>
			</div>`;
}

function bindCollapses ()
{
	let elements = Array.from(document.querySelectorAll('#output .compound:not(.empty) > .name'));
	elements.forEach(element => {
		element.addEventListener('click', function ()
		{
			this.parentElement.classList.toggle('collapsed');
		});
	});
}
