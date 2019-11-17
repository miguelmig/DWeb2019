import xmltodict, json
import io
with io.open('compositores.xml', 'r', encoding='UTF-8') as f:
	data = f.read()
	o = xmltodict.parse(data, encoding='UTF-8')
	## Assign each one a id
	id = 0
	
	out = io.open('compositores.json', 'w+', encoding='utf-8')
	output = json.dumps(o['compositores']['compositor'], indent=4, ensure_ascii=False)
	out.write(output)
	out.close()
	