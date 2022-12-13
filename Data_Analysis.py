from typing import ItemsView
from urllib.request import urlopen
import json
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
response = urlopen(url)
data_json = json.loads(response.read())
data = json.dumps(data_json, indent = 4, sort_keys = True)
#print(data)
output=set()
for p in range(len(data_json)):
    person=data_json[p]
    dope=person["Doping"]
    output.add(dope)
    #print(dope)
output=list(output)
print("now printing (unique?) list: ")
for i in output:
    print(i)
print("number of cyclists: ", str(len(data_json)))
print("number of unique doping incidents: ", str(len(output)))

