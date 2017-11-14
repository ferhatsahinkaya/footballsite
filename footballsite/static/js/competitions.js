var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/competitions");
var populator;

socket.onmessage = function(message) {
    var competition = JSON.parse(message.data);
    $(populator.populate(competition)).appendTo('#competitions');    
};

function findCompetitions(document, filter) {
    populator = new Populator(JSON.parse(filter)['type']);
    socket.onopen = function () {
        socket.send(filter)
    };
    if (socket.readyState == WebSocket.OPEN) {
	socket.onopen();
    }
}

function Populator(type) {
    this.type = type;
}

Populator.prototype.populate = function(competition) {
    if(this.type === 'topbottom') {
        return this.topBottom(competition);
    } else if(this.type === 'underover') {
        return this.underOver(competition);
    }
    alert('Unknown filter type ' + this.type);
};

Populator.prototype.topBottom = function(competition) {
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
    $.each(competition.matches, function(index, value) { 
	html += '<tr>' +
		'<td>' + value.datetime + '</td>' +
		'<td><img class="u-max-full-width" src=\"' + value.homeTeam.crestUrl + '\"/></td>' +
		'<td>' + value.homeTeam.name + '(' + value.homeTeam.standing + ')</td>' +
		'<td><img class="u-max-full-width" src=\"' + value.awayTeam.crestUrl + '\"/></td>' +
		'<td>' + value.awayTeam.name + '(' + value.awayTeam.standing + ')</td>' +
                '</tr>'
    });
    html += '</tbody></table>';
    return html;
};

Populator.prototype.underOver = function(competition) {
    var html = '<h3>' + competition.name + '</h3>' +
        '<table class=\"u-full-width\">' +
	'<thead>' +
	'<tr>' +
	'<th>Time</th>' +
	'<th>Home Team</th>' +
	'<th>Away Team</th>' +
        '<th>Under or Equal Chance</th>' +
        '<th>Over or Equal Chance</th>' +
	'</tr>' +
	'</thead>' +
	'<tbody>';
    $.each(competition.matches, function(index, value) { 
	html += '<tr>' +
		'<td>' + value.datetime + '</td>' +
		'<td>' + value.homeTeam + '</td>' +
		'<td>' + value.awayTeam + '</td>' +
 		'<td>' + value.stats.under_or_equal_chance + '</td>' +
 		'<td>' + value.stats.over_or_equal_chance + '</td>' +
		'</tr>'
    });
    html += '</tbody></table>';
    return html;
};

