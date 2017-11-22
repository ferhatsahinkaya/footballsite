var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/competitions");
var populator;

socket.onmessage = function (message) {
    var competition = JSON.parse(message.data);
    $(populator(competition)).appendTo('#competitions');
};

function findCompetitions(document, filter) {
    populator = new ResultPopulators()[JSON.parse(filter)['type']];
    socket.onopen = function () {
        socket.send(filter);
    };
    if (socket.readyState === WebSocket.OPEN) {
        socket.onopen();
    }
}

function ResultPopulators() {
    this.populators = {
        'topbottom': this.topBottom,
        'underover': this.underOver
    };
    return this.populators;
}

ResultPopulators.prototype.topBottom = function (competition) {
    var html = '<h3>' + competition.name + '</h3>' +
        '<table class="u-full-width">' +
        '<thead>' +
        '<tr>' +
        '<th>Time</th>' +
        '<th/>' +
        '<th>Home Team</th>' +
        '<th/>' +
        '<th>Away Team</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    function getTeamHtml(team) {
        return '<td>' + (team.crestUrl ? '<img class="resize" src=\"' + team.crestUrl + '\"/>' : '') + '</td>' +
            '<td>' + team.name + ' (' + team.standing + ')</td>';
    }

    $.each(competition.matches, function (index, value) {
        html += '<tr>' +
            '<td>' + new Date(value.datetime).toUTCString() + '</td>' +
            getTeamHtml(value.homeTeam) +
            getTeamHtml(value.awayTeam);
    });
    html += '</tbody></table>';
    return html;
};

ResultPopulators.prototype.underOver = function (competition) {
    var html = '<h3>' + competition.name + '</h3>' +
        '<table class=\"u-full-width\">' +
        '<thead>' +
        '<tr>' +
        '<th>Time</th>' +
        '<th/>' +
        '<th>Home Team</th>' +
        '<th/>' +
        '<th>Away Team</th>' +
        '<th>Under or Equal Chance</th>' +
        '<th>Over or Equal Chance</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    function getTeamHtml(team) {
        return '<td>' + (team.crestUrl ? '<img class="resize" src=\"' + team.crestUrl + '\"/>' : '') + '</td>' +
            '<td>' + team.name + '</td>';
    }

    $.each(competition.matches, function (index, value) {
        html += '<tr>' +
            '<td>' + new Date(value.datetime).toUTCString() + '</td>' +
            getTeamHtml(value.homeTeam) +
            getTeamHtml(value.awayTeam) +
            '<td>' + value.stats.under_or_equal_chance + '</td>' +
            '<td>' + value.stats.over_or_equal_chance + '</td>' +
            '</tr>'
    });
    html += '</tbody></table>';
    return html;
};

