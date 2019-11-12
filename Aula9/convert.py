import xmltodict, json
import io
with io.open('obras.xml', 'r', encoding='UTF-8') as f:
	data = f.read()
	o = xmltodict.parse(data, encoding='UTF-8')
	## Assign each one a id
	id = 0
	
	out = io.open('obras.json', 'w+', encoding='utf-8')
	output = json.dumps(o['obras']['obra'], indent=4, ensure_ascii=False)
	out.write(output)
	out.close()
	