from django.conf.urls import patterns, include, url
from zorgapp import views

urlpatterns = patterns('',
	url(r'^next', views.getNextBattle, name='next'),
)
