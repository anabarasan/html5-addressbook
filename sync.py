#!/usr/bin/env python
#

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

class addressbook(db.Model):
	name = db.StringProperty()
	book = db.TextProperty()

class MainHandler(webapp.RequestHandler):
	def get(self):
		syncType = self.request.get("sync")
		
		payload = ''
		qry = db.GqlQuery("SELECT * FROM addressbook WHERE name = :1","anbarasan")
		contacts = qry.fetch(1)
		
		for contact in contacts:
			self.response.out.write(contact.book)


	def post(self):
		syncType = self.request.get("sync")
		payload = self.request.get("payload")
		
		contacts = addressbook(
			key_name='anbarasan',
			name = 'anbarasan',
			book = payload)
		contacts.put()
		
		self.response.out.write('successfully synced data to server')


def main():
    application = webapp.WSGIApplication([('/sync', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
