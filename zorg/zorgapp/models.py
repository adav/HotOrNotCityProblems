from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    last_location_lat = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    last_location_long = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    city = models.CharField(max_length=255,null=True,blank=True)
    
class Topic(models.Model):
    name = models.CharField(max_length=255,unique=True)
    img_url = models.URLField()
    hits = models.IntegerField()
    views = models.IntegerField()

class Battle(models.Model):
    winning_topic = models.ForeignKey('Topic', related_name = 'Battle_Topic_Winner')
    losing_topic = models.ForeignKey('Topic', related_name = 'Battle_Topic_Loser')
    location_lat = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    location_long = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    user = models.ForeignKey('User')
