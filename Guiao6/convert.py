import xmltodict, json
import io
with io.open('arq-son-EVO.xml', 'r', encoding='ISO-8859-1') as f:
	data = f.read()
	o = xmltodict.parse(data, encoding='ISO-8859-1')
	## Assign each one a id
	id = 0
	for arq in o['arq']['doc']:
		arq['id'] = id
		id = id + 1
	
	out = io.open('arq-son-EVO.json', 'w+', encoding='utf-8')
	output = json.dumps(o, indent=4, ensure_ascii=False)
	out.write(output)
	out.close()
	