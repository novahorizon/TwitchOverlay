# TwitchOverlay
Overlay and chatbot for Twitch

Enter your stream name into the server.js file.
Using Node.js, run the server.js file and then open the overlay.html as a browser source in OBS.
Mods and the streamer can currently use the following commands:

!timer
!stopwatch

Both commands have the following parameters:

set [value]
start
stop

Example: "!timer set 30" will create a 30 second timer and wait for activation. You can also use "!timer 30" directly to set and begin the timer.
