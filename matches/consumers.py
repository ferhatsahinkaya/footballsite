import json
import logging
import uuid
from channels import Group
from channels.sessions import channel_session
from matchfinder.filter import filtermatch
from matchfinder.footballapi import footballapi

competitions = footballapi.get_competitions()
logger = logging.getLogger()
logger.setLevel(logging.INFO)


@channel_session
def ws_connect(message):
    session_id = str(uuid.uuid4())
    logger.info('connect sessionId: ' + session_id)
    message.reply_channel.send({"accept": True})
    Group('competitions-' + session_id).add(message.reply_channel)
    message.channel_session['sessionId'] = session_id


@channel_session
def ws_receive(message):
    logger.info('receive message for sessionId: ' + message.channel_session['sessionId'])
    publish_competitions(message.channel_session['sessionId'], json.loads(message['text']))


@channel_session
def ws_disconnect(message):
    session_id = message.channel_session['sessionId']
    logger.info('disconnect sessionId: ' + session_id)
    Group('competitions-' + session_id).discard(message.reply_channel)


def publish_competition(session_id, competition, query):
    c = filtermatch.get_matches(competition, query)
    Group('competitions-' + session_id).send({'text': json.dumps({
        'name': c.name,
        'matches': [dict(match) for match in c.matches]})
    }, immediately=True)


def publish_competitions(session_id, query):
    selected_competitions = [competition for competition in competitions if competition['league'] == query['league']] \
        if query['league'] != 'All' else competitions

    list(map(lambda competition: publish_competition(session_id, competition, query), selected_competitions))
