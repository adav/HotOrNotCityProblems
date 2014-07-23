from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from zorgapp.models import Battle,Topic,User
from zorgapp.serializers import BattleSerializer, TopicSerializer
from rest_framework import mixins, generics, status
from django.template import RequestContext, loader
from django.http import HttpResponse
from django.db import IntegrityError
import images
import json

def get_topic_name(text):
    from nlp import tokenizeWorry
    return tokenizeWorry(text)
    
def index(request):
    user_id = request.session.get('zorguser')
    if not user_id:
        user = User()
        user.save()
        user_id = user.user_id
        request.session['zorguser'] = user_id
        

    template = loader.get_template('zorgapp/index.html')
    return HttpResponse(template.render(RequestContext(request, {'user_id':user_id})))
    
    
class TopicView(APIView):
    def get(self, request):
        #TODO filter out battles the user has done before
        topics = Topic.objects.order_by('?')[0:20]
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)
        
    def post(self, request):
        name = get_topic_name(request.DATA['text'])
        if len(name) < 4:
            return Response(status = status.HTTP_200_OK)
            
        # Fetch Image URL for name
        url = images.get_url(name)
        topic = Topic(name=name,hits=0,views=0,img_url=url)
        
        # Have duplicates return gracefully (hits++, views++ or something)
        stat = status.HTTP_201_CREATED
        try:
            topic.save()
        except IntegrityError:
            topic = Topic.objects.filter(name=name)[0]
            topic.hits += 1
            topic.views += 1
            topic.save()
            stat = status.HTTP_200_OK
        
        serializer = TopicSerializer(topic)
        return Response(serializer.data, status=stat)
      
      
class BattleView(mixins.CreateModelMixin,
                 generics.GenericAPIView):

    queryset = Battle.objects.all()
    serializer_class = BattleSerializer
    
    def post(self, request, *args, **kwargs):
        winning_id = request.DATA['winning_topic']
        losing_id = request.DATA['losing_topic']
        tmp_topic = Topic.objects.get(pk=winning_id)
        tmp_topic.views = tmp_topic.views + 1
        tmp_topic.hits = tmp_topic.hits + 1
        tmp_topic.save()    
        tmp_topic = Topic.objects.get(pk=losing_id)
        tmp_topic.views = tmp_topic.views + 1
        tmp_topic.save()        
        return self.create(request, *args, **kwargs)
        
        

default_count_top = 10;
thresh_hold_min_views = 5;   
class TopView(APIView):
    def get(self, request):
        #TODO filter out battles the user has done before
        topics = Topic.objects.all()    
        new_topics = sorted(topics, key=lambda x: float(x.hits)/x.views if x.views > thresh_hold_min_views else 0, reverse=True)
        serializer = TopicSerializer(new_topics[0:default_count_top], many=True)
        return Response(serializer.data)
        
        
class TopicCompareView(APIView):
    def post(self, request):
        left_topic_id = request.DATA['left']
        right_topic_id = request.DATA['right']
        
        left = Topic.objects.filter(pk=left_topic_id)[0]
        right = Topic.objects.filter(pk=right_topic_id)[0]
        
        left_win = Battle.objects.filter(winning_topic=left,losing_topic=right)
        left_win_count = len(left_win)
        
        
        right_win = Battle.objects.filter(winning_topic=right,losing_topic=left)
        right_win_count = len(right_win)
        
        response_data = {}
        response_data['right_name'] = right.name
        response_data['left_name'] = left.name
        response_data['left_wins'] = left_win_count
        response_data['right_wins'] = right_win_count
        response_data['left_img_url'] = left.img_url
        response_data['right_img_url'] = right.img_url
        return HttpResponse(json.dumps(response_data), content_type="application/json")
