from rest_framework import serializers
from zorgapp.models import Battle,Topic

class BattleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Battle
        fields = ('winning_topic', 'losing_topic', 'location_lat', 'location_long', 'user')
		
		
class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'name', 'img_url', 'hits','views')
