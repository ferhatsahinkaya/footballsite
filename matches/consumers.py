import json
import uuid
import logging
from channels import Group
from channels.sessions import channel_session
from matchfinder.filter import filtermatch
from matchfinder.footballapi import footballapi

competitions = footballapi.get_competitions()
logger = logging.getLogger()
logger.setLevel(logging.INFO)

@channel_session
def ws_connect(message):
	sessionId = str(uuid.uuid4())
	logger.info('connect sessionId: ' + sessionId)
	message.reply_channel.send({"accept": True})
	Group('competitions-' + sessionId).add(message.reply_channel)
	message.channel_session['sessionId'] = sessionId

@channel_session
def ws_receive(message):	
	logger.info('receive message for sessionId: ' + message.channel_session['sessionId'])
	publish_competitions(message.channel_session['sessionId'], json.loads(message['text']))

@channel_session
def ws_disconnect(message):
	sessionId = message.channel_session['sessionId']
	logger.info('disconnect sessionId: ' + sessionId)
	Group('competitions-' + sessionId).discard(message.reply_channel)

def publish_competition(sessionId, competition, query):
	c = filtermatch.get_matches(competition, query)
	Group('competitions-' + sessionId).send({'text': json.dumps({
		'name': c.name,
		'matches': [{
			'datetime': match.datetime,
			'homeTeam': match.homeTeam.__dict__,
			'awayTeam': match.awayTeam.__dict__
		} for match in c.matches] })
	}, immediately=True)

def publish_competitions(sessionId, query):
	selected_competitions = [competition for competition in competitions if competition['league'] == query['league']] \
		if query['league'] != 'All' else competitions

	list(map(lambda competition: publish_competition(sessionId, competition, query), selected_competitions))
