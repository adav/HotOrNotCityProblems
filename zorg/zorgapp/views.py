from django.shortcuts import render
import json
from django.http import HttpResponse

# Create your views here.
def getNextBattle(request):
	
	id1 = '1'
	name1 = 'avi nimni'
	img_url1 = 'blablabla'
	id2 = '2'
	name2 = 'avi bimi'
	img_url2 = 'blablabla'
	
	jsonResponse = {'topic1':{'id':id1, 'name':name1, 'img_url':img_url1},'topic2':{'id':id2, 'name':name2, 'img_url':img_url2}}
	
	return HttpResponse(json.dumps(jsonResponse), content_type="application/json")