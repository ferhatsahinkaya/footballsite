import json
import time
from channels import Group
from channels.sessions import channel_session
from matchfinder.filter import filtermatch
from matchfinder.footballapi import footballapi

competitions = footballapi.get_competitions()

@channel_session
def ws_connect(message):
	message.reply_channel.send({"accept": True})
	Group('competitions').add(message.reply_channel)

@channel_session
def ws_receive(message):
	publish_competitions(json.loads(message['text']))

@channel_session
def ws_disconnect(message):
	Group('competitions').discard(message.reply_channel)


def publish_competition(competition, query):
	c = filtermatch.get_matches(competition, query)
	Group('competitions').send({'text': json.dumps({
		'name': c.name,
		'matches': [{
			'datetime' : match.datetime,
			'homeTeam' : match.homeTeam,
			'homeTeamStanding' : match.homeTeamStanding,
			'awayTeam' : match.awayTeam,
			'awayTeamStanding' : match.awayTeamStanding		
		} for match in c.matches] })
	}, immediately=True)

def publish_competitions(query):
	selected_competitions = [competition for competition in competitions if competition['league'] == query['league']] \
		if query['league'] != 'All' else competitions

	list(map(lambda competition: publish_competition(competition, query), selected_competitions))
