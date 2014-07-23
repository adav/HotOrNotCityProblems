from django.conf.urls import patterns, include, url
from zorgapp import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = patterns('',
	url(r'^battle/$', views.BattleView.as_view(), name='battle'),
	url(r'^topic/', views.TopicView.as_view(), name='topic'),
    url(r'^top/', views.TopView.as_view(), name='top'),
    url(r'^$', views.index, name='index'),
)

urlpatterns = format_suffix_patterns(urlpatterns)