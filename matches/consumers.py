from channels import Group
from channels.sessions import channel_session

@channel_session
def ws_connect(message):
    prefix, label = message['path'].strip('/').split('/')
    Group('league-' + label).add(message.reply_channel)
    message.channel_session['result'] = 'league-' + label

