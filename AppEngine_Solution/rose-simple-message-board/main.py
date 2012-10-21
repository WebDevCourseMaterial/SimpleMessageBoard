#!/usr/bin/env python
#
# Simple message board

from google.appengine.ext import ndb
from google.appengine.ext.webapp import template
import json
import logging
import webapp2

class Message(ndb.Model):
    author = ndb.StringProperty(default='')
    comment = ndb.StringProperty(default='')
    created_date_time = ndb.DateTimeProperty(auto_now_add=True)
    
class MainHandler(webapp2.RequestHandler):
    def get(self):
        messages = Message.query().order(-Message.created_date_time).fetch(20)
        self.response.out.write(template.render('templates/main.html', {'messages': messages}))

    def post(self):
        new_message = Message(author = self.request.get('author'), comment = self.request.get('comment'))
        new_message.put()
        self.redirect('/')

class ApiHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        messageList =[]
        messages = Message.query().order(-Message.created_date_time).fetch(20)        
        for message in messages:
            messageList.append(message.to_dict())
        response = {'messages': messageList}
        self.response.out.write(json.dumps(response, default=self.date_time_handler))

    def date_time_handler(self, obj):
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        return obj
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        postBody = json.loads(self.request.body)
        newMessage = Message(author = postBody['author'], comment = postBody['comment'])
        newMessage.put()
        self.response.out.write(json.dumps(newMessage.to_dict(), default=self.date_time_handler))

app = webapp2.WSGIApplication([
    ('/api', ApiHandler),
    ('/', MainHandler)
], debug=True)
