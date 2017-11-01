$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    var socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/league" + window.location.pathname);

    socket.onmessage = function(message) {
        alert('onmessage');
    };

    $("#competitions").on("submit", function(event) {
        var message = {
            handle: $('#handle').val(),
            message: $('#message').val(),
        }
        socket.send(JSON.stringify(message));
        $("#message").val('').focus();
        return false;
    });
});
