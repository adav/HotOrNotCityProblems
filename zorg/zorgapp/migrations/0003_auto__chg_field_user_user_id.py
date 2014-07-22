# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'User.user_id'
        db.alter_column(u'zorgapp_user', 'user_id', self.gf('django.db.models.fields.AutoField')(primary_key=True))

    def backwards(self, orm):

        # Changing field 'User.user_id'
        db.alter_column(u'zorgapp_user', 'user_id', self.gf('django.db.models.fields.IntegerField')(primary_key=True))

    models = {
        u'zorgapp.battle': {
            'Meta': {'object_name': 'Battle'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location_lat': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '6'}),
            'location_long': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '6'}),
            'losing_topic': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'Battle_Topic_Loser'", 'to': u"orm['zorgapp.Topic']"}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['zorgapp.User']"}),
            'winning_topic': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'Battle_Topic_Winner'", 'to': u"orm['zorgapp.Topic']"})
        },
        u'zorgapp.topic': {
            'Meta': {'object_name': 'Topic'},
            'hits': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'img_url': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'}),
            'views': ('django.db.models.fields.IntegerField', [], {})
        },
        u'zorgapp.user': {
            'Meta': {'object_name': 'User'},
            'last_location_lat': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '6'}),
            'last_location_long': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '6'}),
            'user_id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        }
    }

    complete_apps = ['zorgapp']