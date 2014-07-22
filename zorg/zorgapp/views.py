# from django.shortcuts import render
# import json
# from django.http import HttpResponse

##Create your views here.
# def getNextBattle(request):
    
    # id1 = '1'
    # name1 = 'avi nimni'
    # img_url1 = 'blablabla'
    # id2 = '2'
    # name2 = 'avi bimi'
    # img_url2 = 'blablabla'
    
    # jsonResponse = {'topic1':{'id':id1, 'name':name1, 'img_url':img_url1},'topic2':{'id':id2, 'name':name2, 'img_url':img_url2}}
    
    # return HttpResponse(json.dumps(jsonResponse), content_type="application/json")
    
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from zorgapp.models import Battle,Topic
from zorgapp.serializers import BattleSerializer, TopicSerializer
from rest_framework import mixins, generics

# Create your views here.
class TopicView(APIView):
    def get(self, request):
        # TODO Pick two random ones
        b1 = Topic()
        b1.name = 'avi nimni'
        b1.img_url = 'http://example.com/img1.png'
        
        b2 = Topic()
        b2.name = 'avi bimi'
        b2.img_url = 'http://example.com/img2.png'
        
        topics = [b1, b2]
        
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

class BattleView(mixins.CreateModelMixin,
                 generics.GenericAPIView):

    queryset = Battle.objects.all()
    serializer_class = BattleSerializer
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)