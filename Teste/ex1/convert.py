import xmltodict, json
import io

def replaceId(obj):
	obj['_id'] = obj['@id']
	del obj['@id']
	if not "instrumentos" in obj:
		obj['instrumentos'] = {}
		obj['instrumentos']['instrumento'] = []
	instrumento = obj['instrumentos']['instrumento']
	if not isinstance(instrumento, list):
		obj['instrumentos']['instrumento'] = [instrumento]

with io.open('arquivo.xml', 'r', encoding='UTF-8') as f:
	data = f.read()
	o = xmltodict.parse(data, encoding='UTF-8')
	## Assign each one a id
	id = 0
	
	out = io.open('arquivo.json', 'w+', encoding='utf-8')
	map(lambda x: replaceId(x), o['arquivo-musical']['obra'])
	output = json.dumps(o['arquivo-musical']['obra'], indent=4, ensure_ascii=False)
	out.write(output)
	out.close()
	