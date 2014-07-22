from django.contrib import admin
from zorgapp.models import User,Battle,Topic

admin.site.register(User)




class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'views', 'hits']
	
class BattleAdmin(admin.ModelAdmin):
    list_display = ['winning_topic_name', 'losing_topic_name', 'user_name']
		
    def winning_topic_name(self, instance):
        return instance.winning_topic.name
		
    def losing_topic_name(self, instance):
        return instance.losing_topic.name
		
    def user_name(self, instance):
        return instance.user.user_id

	
	
	
admin.site.register(Topic, TopicAdmin)
admin.site.register(Battle, BattleAdmin)