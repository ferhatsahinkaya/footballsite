from django.shortcuts import render

import json
from matchfinder.filter import filtermatch
from matchfinder.footballapi import footballapi

competitions = footballapi.get_competitions()

pages = {
    'topbottom': 'competitions_topbottom.html',
    'underover': 'competitions_underover.html'
}


def index(request):
    context = {
        'leagues': competitions,
        'filters': [
            {'type': 'topbottom', 'fields': []},
            {'type': 'underover', 'fields': ['numberofgoals', 'homeaway', 'halffulltime']}
        ]}
    return render(request, 'matches/index.html', context)


def get_competitions(request):
    return render(request, 'matches/competitions.html', get_filter(request))

def find_competitions(request):
    selected_competitions = [competition for competition in competitions if
                             competition['league'] in request.GET['league']] \
        if request.GET['league'] != 'All' else competitions

    result = [filtermatch.get_matches(competition, get_filter(request)) for competition in selected_competitions]
    context = {'competitions': result}

    return render(request, 'matches/' + pages[filter_type], context)

def get_filter(request):
    filter_type = request.GET['filtertype']
    if filter_type == 'topbottom':
        filter = {'type': filter_type, 
                  'percent': int(request.GET['percent']), 
                  'league': request.GET['league']}
    else:
        filter = {'type': filter_type, 'percent': int(request.GET['percent']),
                  'numberofgoals': int(request.GET['numberofgoals']),
                  'homeaway': request.GET['homeaway'] if 'homeaway' in request.GET else 'off',
                  'halffulltime': request.GET['halffulltime'],
                  'league': request.GET['league']}
    return {'filter' : filter}

