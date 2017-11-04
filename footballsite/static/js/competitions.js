var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/competitions");

socket.onmessage = function(message) {
    var competition = JSON.parse(message.data);
    var html = '<h3>' + competition.name + '</h3>' +
        '<table class=\"u-full-width\">' +
	'<thead>' +
	'<tr>' +
	'<th>Time</th>' +
	'<th>Home Team</th>' +
	'<th>Away Team</th>' +
	'</tr>' +
	'</thead>' +
	'<tbody>';
    $.each(competition.matches, function(index, value) { 
	html += '<tr>' +
		'<td>' + value.datetime + '</td>' +
		'<td>' + value.homeTeam + '(' + value.homeTeamStanding + ')</td>' +
		'<td>' + value.awayTeam + '(' + value.awayTeamStanding + ')</td>' 
    });
    html += '</tbody></table>';
    $(html).appendTo('#competitions');
};

function findCompetitions(document, filter) {
    socket.onopen = function () {
        socket.send(filter)
    };
    if (socket.readyState == WebSocket.OPEN) {
	socket.onopen();
    }
}
