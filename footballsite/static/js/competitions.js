$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/league" + window.location.pathname);

    socket.onmessage = function(message) {
        alert('onmessage' + message);
    };

    $("#competitions").on("submit", function(event) {
       /* var message = {
            handle: 'handle',
            message: 'message',
        }
        socket.send(JSON.stringify(message)); */
	alert('test');
       // $("#message").val('').focus();
        return false;
    });
});
alert('competitions loaded')
