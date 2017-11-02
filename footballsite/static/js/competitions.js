var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/competitions");

socket.onmessage = function(message) {
    alert('onmessage ' + message.data);
};

function findCompetitions(document, filter) {
    socket.onopen = function () {
        socket.send(filter)
    };
}
