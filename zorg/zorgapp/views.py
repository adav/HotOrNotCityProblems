from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from zorgapp.models import Battle,Topic
from zorgapp.serializers import BattleSerializer, TopicSerializer
from rest_framework import mixins, generics, status
from django.template import RequestContext, loader
from django.http import HttpResponse

def get_topic_name(text):
    return text
    
def index(request):
    template = loader.get_template('zorgapp/index.html')
    return HttpResponse(template.render(RequestContext(request, {})))

class TopicView(APIView):
    def get(self, request):
        #TODO filter out battles the user has done before
        topics = Topic.objects.order_by('?')[0:20]
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)
        
    def post(self, request):
        name = get_topic_name(request.DATA['text'])
        
        #TODO Fetch Image URL for name
        topic = Topic(name=name,hits=0,views=0,img_url='')
        
        #TODO Have duplicates return gracefully (hits++, views++ or something)
        topic.save()
        
        serializer = TopicSerializer(topic)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class BattleView(mixins.CreateModelMixin,
                 generics.GenericAPIView):

    queryset = Battle.objects.all()
    serializer_class = BattleSerializer
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)