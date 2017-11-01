from channels import Group
from channels.sessions import channel_session

@channel_session
def ws_connect(message):
#    prefix, label = message['path'].strip('/').split('/')
#    Group('league-' + label).add(message.reply_channel)
#    message.channel_session['result'] = 'league-' + label
     Group('result').add(message.reply_channel)
     message.channel_session['result'] = 'test'

@channel_session
def ws_receive(message):
    label = message.channel_session['result']
    Group('result').send({'key': 'value'})
    #publish_competitions(message)

@channel_session
def ws_disconnect(message):
#    label = message.channel_session['result']
    Group('result').discard(message.reply_channel)


def publish_competitions(message):
    filter_type = message['filtertype']
    if filter_type == 'topbottom':
        filter = {'type': filter_type, 'percent': int(message['percent'])}
    else:
        filter = {'type': filter_type, 'percent': int(message['percent']),
                  'numberofgoals': int(message['numberofgoals']),
                  'homeaway': 'homeaway' in message and message['homeaway'] == 'on',
                  'halftime': message['halffulltime'] == 'halftime'}

    selected_competitions = [competition for competition in competitions if
                             competition['league'] in message['league']] \
        if message['league'] != 'All' else competitions

    map(lambda competition : Group('league-'+competition['id']).send({'competition': filtermatch.get_matches(competition, filter)}), selected_competitions)    

