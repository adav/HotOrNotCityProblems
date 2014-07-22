# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'User'
        db.create_table(u'zorgapp_user', (
            ('user_id', self.gf('django.db.models.fields.IntegerField')(primary_key=True)),
            ('last_location_lat', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=6)),
            ('last_location_long', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=6)),
        ))
        db.send_create_signal(u'zorgapp', ['User'])

        # Adding model 'Topic'
        db.create_table(u'zorgapp_topic', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255)),
            ('img_url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('hits', self.gf('django.db.models.fields.IntegerField')()),
            ('views', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'zorgapp', ['Topic'])

        # Adding model 'Battle'
        db.create_table(u'zorgapp_battle', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('winning_topic', self.gf('django.db.models.fields.related.ForeignKey')(related_name='Battle_Topic_Winner', to=orm['zorgapp.Topic'])),
            ('losing_topic', self.gf('django.db.models.fields.related.ForeignKey')(related_name='Battle_Topic_Loser', to=orm['zorgapp.Topic'])),
            ('location_lat', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=6)),
            ('location_long', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=6)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['zorgapp.User'])),
        ))
        db.send_create_signal(u'zorgapp', ['Battle'])


    def backwards(self, orm):
        # Deleting model 'User'
        db.delete_table(u'zorgapp_user')

        # Deleting model 'Topic'
        db.delete_table(u'zorgapp_topic')

        # Deleting model 'Battle'
        db.delete_table(u'zorgapp_battle')


    models = {
        u'zorgapp.battle': {
            'Meta': {'object_name': 'Battle'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location_lat': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '6'}),
            'location_long': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '6'}),
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
            'last_location_lat': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '6'}),
            'last_location_long': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '6'}),
            'user_id': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'})
        }
    }

    complete_apps = ['zorgapp']