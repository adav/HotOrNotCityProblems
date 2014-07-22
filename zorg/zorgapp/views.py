from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from zorgapp.models import Battle,Topic
from zorgapp.serializers import BattleSerializer, TopicSerializer
from rest_framework import mixins, generics

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