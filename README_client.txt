nanostream WebRTC.live
(c) 2017 nanocosmos gmbh
http://www.nanocosmos.de
All rights reserved

(1) Content

This package contains nanoStream WebRTC.live client API and web page samples
(HTML/Javascript) to integrate WebRTC.live into your own web application.
WebRTC.live supports 2 operation modes:

a) WebRTC.live webcast/broadcast
Sends a live stream to a streaming server environment to cover streaming player
with small, medium and large audiences.

b) WebRTC.live chat
Peer-to-peer application to create small conference rooms (4-5 participants)

Please contact us for any further questions or support:

support@nanocosmos.de


(2) Requirements

- WebRTC-enabled web browser (Chrome, Firefox, Opera)

- Web page hosted on https
  - for serving the nanoStream WebRTC client API / samples

- nanoStream WebRTC.live server API 
  - for running the WebRTC client API / samples
  - you have 2 options:
    - Cloud: use nanoStream servers hosted in nanoStream Cloud
    - Managed/On-premise: WebRTC.live server on your custom infrastructure

(3) Setup

- host the complete content of this HTML/JS files on a webserver
- the webserver must be served via HTTPS (eg "https://yourdomain/...")
- open the sample web page from your server 
  - you dont have a custom server:
    - https://yourdomain/chat.html?webrtc.server=https://rtc1.nanocosmos.de/p/webrtc
  - you have a custom server:
    - https://yourdomain/chat.html?webrtc.server=https://yourserver/p/webrtc

(4) Integrating with nanoStream Cloud, bintu.live and H5Live

To generate live streams to distribute to your live audience,
you can use our bintu.live API. You need a valid bintu.live account and API key.
See the webmaster samples and separate documentation! 

For live playback of live streams on any browser, 
you can use the nanoStream H5Live player.
See the separate documentation.

(4) Documentation

You can build your own WebRTC applications with our samples or from scratch:

- see the online documentation for the nanostream WebRTC.live client api:
  - online: https://webrtc.nanocosmos.de/release/doc/webrtc/index.html
(included in the client zip package in folder "/doc")

- sample usage:
  - https://www.nanocosmos.de/v4/documentation/nanostream_webrtc_live_broadcast_api

Documentation homepage:

https://nanocosmos.de/doc

(5) Contact

Any questions, suggestions or support?

support@nanocosmos.de

