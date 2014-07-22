from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from zorgapp.models import Battle,Topic
from zorgapp.serializers import BattleSerializer, TopicSerializer
from rest_framework import mixins, generics

class TopicView(APIView):
    def get(self, request):

        topics = Topic.objects.order_by('?')[0:2]
        
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

class BattleView(mixins.CreateModelMixin,
                 generics.GenericAPIView):

    queryset = Battle.objects.all()
    serializer_class = BattleSerializer
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)