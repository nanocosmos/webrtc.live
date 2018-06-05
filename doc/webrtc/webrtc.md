<a name="RtcUser"></a>

## RtcUser
WebRTC Public API Class Version 4.6.5.

**Kind**: global class  

* [RtcUser](#RtcUser)
    * [new RtcUser()](#new_RtcUser_new)
    * [.checkSupport()](#RtcUser+checkSupport)
    * [.addLocalMedia(mediaId, mediaIndex, [useScreenCapture], [useScreenCaptureOnly])](#RtcUser+addLocalMedia)
    * [.isScreenCaptureAvailable()](#RtcUser+isScreenCaptureAvailable)
    * [.setConfig(server, userName, room, [token], serverUserName, serverPassword, [bintuApiKey])](#RtcUser+setConfig)
    * [.setOptionalConfig(config)](#RtcUser+setOptionalConfig)
    * [.setIceServers(iceServers)](#RtcUser+setIceServers)
    * [.checkServer(server)](#RtcUser+checkServer)
    * [.startBroadcast(config)](#RtcUser+startBroadcast)
    * [.stopBroadcast(forceSignOut)](#RtcUser+stopBroadcast)
    * [.sendMetaData(handlerName, jsonValues)](#RtcUser+sendMetaData)
    * [.enterRoom()](#RtcUser+enterRoom)
    * [.leaveRoom(forceSignOut)](#RtcUser+leaveRoom)
    * [.enableStats([enable], [interval])](#RtcUser+enableStats)
    * [.invokeCall(remoteUserId)](#RtcUser+invokeCall)
    * [.hangUpCall(remoteUserId)](#RtcUser+hangUpCall)
    * [.answerCall(remoteUserId)](#RtcUser+answerCall)
    * [.declineCall(remoteUserId)](#RtcUser+declineCall)
    * [.isSignedIn()](#RtcUser+isSignedIn) ⇒ <code>boolean</code>
    * [.getDevices(mediaIndexOrId)](#RtcUser+getDevices)
    * [.setVideoDevice(mediaIndexOrId, config)](#RtcUser+setVideoDevice)
    * [.setAudioDevice(mediaIndexOrId, config)](#RtcUser+setAudioDevice)
    * [.startPreview(mediaIndexOrId, videoDeviceConfig, audioDeviceConfig, [elementId])](#RtcUser+startPreview)
    * [.stopPreview(mediaIndexOrId)](#RtcUser+stopPreview)
    * [.muteVideo(mediaIndexOrId, mute)](#RtcUser+muteVideo)
    * [.muteAudio(mediaIndexOrId, mute)](#RtcUser+muteAudio)
    * [.injectExternalMediaStream(config)](#RtcUser+injectExternalMediaStream)

<a name="new_RtcUser_new"></a>

### new RtcUser()
WebRTC Public API Class.

**Example**  
```js
var rtcUser = new RtcUser();
```
<a name="RtcUser+checkSupport"></a>

### rtcUser.checkSupport()
Checks if nanoStream WebRTC is supported by current browser

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Example**  
```js
RtcUser.checkSupport();
```
<a name="RtcUser+addLocalMedia"></a>

### rtcUser.addLocalMedia(mediaId, mediaIndex, [useScreenCapture], [useScreenCaptureOnly])
Adds a local media controller to the RtcUser.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaId</td><td><code>string</code></td><td></td><td><p>The name of the media controller.</p>
</td>
    </tr><tr>
    <td>mediaIndex</td><td><code>number</code></td><td></td><td><p>The index of the media controller.</p>
</td>
    </tr><tr>
    <td>[useScreenCapture]</td><td><code>boolean</code> | <code>string</code></td><td><code>true</code></td><td><p>A flag to enable screen capture over a chrome extension. If a string will be passed, the screen capture gets this as name and will be enabled.</p>
</td>
    </tr><tr>
    <td>[useScreenCaptureOnly]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>A flag to enable only screen capture.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var mediaIndex = 0;
rtcUser.addLocalMedia(mediaId, mediaIndex);
```
<a name="RtcUser+isScreenCaptureAvailable"></a>

### rtcUser.isScreenCaptureAvailable()
Checks if a Screen Capture Extension was added via addLocalMedia()

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Example**  
```js
// rtcUser instance of RtcUser
this.rtcuser.addLocalMedia("local", 0, 'nanoScreenCapture', false);
// wait until api has registered extension:
setTimeout(function() {
    var hasScreenCapture = rtcUser.isScreenCaptureAvailable(); 
}, 1000);
```
<a name="RtcUser+setConfig"></a>

### rtcUser.setConfig(server, userName, room, [token], serverUserName, serverPassword, [bintuApiKey])
Sets the config for the RtcUser.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>server</td><td><code>string</code></td><td><p>The url to the webrtc server.</p>
</td>
    </tr><tr>
    <td>userName</td><td><code>string</code></td><td><p>The name of the RtcUser.</p>
</td>
    </tr><tr>
    <td>room</td><td><code>string</code></td><td><p>The room to join.</p>
</td>
    </tr><tr>
    <td>[token]</td><td><code>string</code></td><td><p>The security token for the server.</p>
</td>
    </tr><tr>
    <td>serverUserName</td><td><code>string</code></td><td><p>The username credential for the server.</p>
</td>
    </tr><tr>
    <td>serverPassword</td><td><code>string</code></td><td><p>The password credential for the server.</p>
</td>
    </tr><tr>
    <td>[bintuApiKey]</td><td><code>string</code></td><td><p>The bintu apikey for authentication.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var server = 'https://rtc-lb.nanocosmos.de/p/1';
var userName = 'WebrtcChatter';
var room = 'myChatRoom';
var token = 'token-123';
var serverUserName = 'username';
var serverPassword = 'password';
var bintuApiKey = 'awdegfq3490puerg2w54zj2p0w4h46zphm694i0796';
rtcUser.setConfig(server, userName, room, token, serverUserName, serverPassword, bintuApiKey);
```
<a name="RtcUser+setOptionalConfig"></a>

### rtcUser.setOptionalConfig(config)
Sets optional config for the RtcUser.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td><td></td><td><p>The config object.</p>
</td>
    </tr><tr>
    <td>config.codecs</td><td><code>object</code></td><td></td><td><p>The codec object.</p>
</td>
    </tr><tr>
    <td>config.codecs.videoCodec</td><td><code>string</code></td><td><code>&quot;&#x27;H264&#x27;&quot;</code></td><td><p>The video codec to use (possible values: &#39;VP8&#39;, &#39;VP9&#39;, &#39;H264&#39;).</p>
</td>
    </tr><tr>
    <td>config.bitrates</td><td><code>object</code></td><td></td><td><p>The codec object.</p>
</td>
    </tr><tr>
    <td>config.bitrates.videoSendInitialBitrate</td><td><code>string</code></td><td><code>0</code></td><td><p>The webrtc initial bitrate</p>
</td>
    </tr><tr>
    <td>config.bitrates.videoSendBitrate</td><td><code>string</code></td><td><code>0</code></td><td><p>The webrtc bitrate</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var config = { 
    codecs: {
        videoCodec: 'H264'
    },
    bitrates: {                
        videoSendInitialBitrate: 500,
        videoSendBitrate: 1000
    }
};
rtcUser.setOptionalConfig(config);
```
<a name="RtcUser+setIceServers"></a>

### rtcUser.setIceServers(iceServers)
Sets an array of turn/stun-servers for the peer-to-peer connection.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>iceServers</td><td><code>Array.&lt;object&gt;</code></td><td><p>The ice servers object.</p>
</td>
    </tr><tr>
    <td>iceServers[].urls</td><td><code>Array.&lt;string&gt;</code></td><td><p>An array of urls.</p>
</td>
    </tr><tr>
    <td>[iceServers[].username]</td><td><code>string</code></td><td><p>The username for the ice servers if required.</p>
</td>
    </tr><tr>
    <td>[iceServers[].credential]</td><td><code>string</code></td><td><p>The password for the ice servers if required.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var iceServers = [
    {
        urls: [
            'turn:turn.myTurnServer.net:80?transport=udp'
        ],
        username: 'username',
        credential: 'password'
    },
    {
        urls: [
            'turn:turn.myTurnServer.net:80?transport=udp'
        ],
        username: 'username',
        credential: 'password'
    },
    {
        urls: [
            'stun:stun.l.google.com:19302'
        ]
    }
];
rtcUser.setIceServers(iceServers);
```
<a name="RtcUser+checkServer"></a>

### rtcUser.checkServer(server)
Checks the state of a webrtc server.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:ReceivedServerStats</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>server</td><td><code>string</code></td><td><p>The url of the server.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var server = 'https://rtc-lb.nanocosmos.de/p/webrtc'
rtcUser.checkServer(server);
```
<a name="RtcUser+startBroadcast"></a>

### rtcUser.startBroadcast(config)
Starts a broadcast to a rtmp ingest with transcoding configs.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:StartBroadcastSuccess</code>, <code>event:StartBroadcastError</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td><td></td><td><p>The config object.</p>
</td>
    </tr><tr>
    <td>config.transcodingTargets</td><td><code>object</code></td><td></td><td><p>The transcoding config object.</p>
</td>
    </tr><tr>
    <td>config.transcodingTargets.output</td><td><code>string</code></td><td></td><td><p>The rtmp ingest url for the first stream.</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.streamname]</td><td><code>string</code></td><td><code>null</code></td><td><p>Optional streamname. Use if you want to pass output and streamname seperately.</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.videobitrate]</td><td><code>number</code></td><td><code></code></td><td><p>The video bitrate for the transcode of the first stream.</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.audiobitrate]</td><td><code>number</code></td><td><code></code></td><td><p>The audio bitrate for the transcode of the first stream.</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.framerate]</td><td><code>number</code></td><td><code></code></td><td><p>The framerate for the transcode of the first stream.</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.dropframes]</td><td><code>string</code></td><td><code>null</code></td><td><p>A flag to enable frame dropping (possible values: &#39;0&#39;, &#39;1&#39;).</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.h264passthrough]</td><td><code>string</code></td><td><code>null</code></td><td><p>A flag to enable transmuxing without transcoding if video codec &#39;H264&#39; is used (possible values: &#39;0&#39;, &#39;1&#39;).</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.icecast_audio]</td><td><code>string</code></td><td><code>null</code></td><td><p>A flag to enable embedding of an icecast audio stream, normal audio will be ignored (possible values: &#39;0&#39;, &#39;1&#39;).</p>
</td>
    </tr><tr>
    <td>[config.transcodingTargets.rtmpconnectinfo]</td><td><code>string</code></td><td><code>null</code></td><td><p>Data to be send with the rtmp streams &quot;onconnect&quot;. Pass flat object with key value pairs, hierarchies are not supported.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var broadcastConfig = {
    transcodingTargets: {
        output: 'rtmp://myIngestServer.com:1935/live/webrtcBroadcast',
        videobitrate: 500000,
        audiobitrate: 64000,
        framerate: 30,
        dropframes: '0',
        icecast_audio: '0',
        rtmpconnectinfo: {"key1":"value1","key2":7.5,"key3":false} 
    }
};
rtcUser.startBroadcast(broadcastConfig);
```
<a name="RtcUser+stopBroadcast"></a>

### rtcUser.stopBroadcast(forceSignOut)
Stop a running broadcast.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:StopBroadcastSuccess</code>, <code>event:StopBroadcastError</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>forceSignOut</td><td><code>boolean</code></td><td><p>Force stopping the broadcast.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
rtcUser.stopBroadcast();
```
<a name="RtcUser+sendMetaData"></a>

### rtcUser.sendMetaData(handlerName, jsonValues)
Add live meta data to a broadcast stream.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>handlerName</td><td><code>&#x27;onMetaData&#x27;</code> | <code>&#x27;onCuePoint&#x27;</code></td><td><p>Name of the meta data handler. Other types are not supported.</p>
</td>
    </tr><tr>
    <td>jsonValues</td><td><code>object</code></td><td><p>The data to be sent. Parameter can contain a maximum object depth of 6.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
rtcUser.sendMetaData('onMetaData', {myString: "hello", myInteger: 1234});
```
<a name="RtcUser+enterRoom"></a>

### rtcUser.enterRoom()
Connects to the webrtc server and enters the specified room.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:EnterRoomSuccess</code>, <code>event:EnterRoomError</code>  
**Example**  
```js
// rtcUser instance of RtcUser
rtcUser.enterRoom();
```
<a name="RtcUser+leaveRoom"></a>

### rtcUser.leaveRoom(forceSignOut)
Disconnects from the webrtc server and leaves the specified room.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:LeaveRoomSuccess</code>, <code>event:LeaveRoomError</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>forceSignOut</td><td><code>boolean</code></td><td><p>Force stopping the broadcast.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
rtcUser.leaveRoom();
```
<a name="RtcUser+enableStats"></a>

### rtcUser.enableStats([enable], [interval])
Enables to receive webrtc stats in a given time interval.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:ReceivedWebRTCStats</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[enable]</td><td><code>boolean</code></td><td><code>true</code></td><td><p>A flag to enable webrtc stats.</p>
</td>
    </tr><tr>
    <td>[interval]</td><td><code>number</code></td><td><code>1000</code></td><td><p>The interval time in milli seconds.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
rtcUser.enableStats();
```
**Example**  
```js
// rtcUser instance of RtcUser
var enable = false;
rtcUser.enableStats(enable);
```
**Example**  
```js
// rtcUser instance of RtcUser
var enable = true;
var interval = 5000;
rtcUser.enableStats(enable, interval);
```
<a name="RtcUser+invokeCall"></a>

### rtcUser.invokeCall(remoteUserId)
Invokes a call with another user.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:CallStillActive</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>remoteUserId</td><td><code>string</code></td><td><p>The remote user id of the other user.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var remoteUserId = '49647969';
rtcUser.invokeCall(remoteUserId);
```
<a name="RtcUser+hangUpCall"></a>

### rtcUser.hangUpCall(remoteUserId)
Hangs up a call with another user.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:???</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>remoteUserId</td><td><code>string</code></td><td><p>The remote user id of the other user.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var remoteUserId = '49647969';
rtcUser.hangUpCall(remoteUserId);
```
<a name="RtcUser+answerCall"></a>

### rtcUser.answerCall(remoteUserId)
Answers a call with another user.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:???</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>remoteUserId</td><td><code>string</code></td><td><p>The remote user id of the other user.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var remoteUserId = '49647969';
rtcUser.hangUpCall(remoteUserId);
```
<a name="RtcUser+declineCall"></a>

### rtcUser.declineCall(remoteUserId)
Declines a call with another user.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:???</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>remoteUserId</td><td><code>string</code></td><td><p>The remote user id of the other user.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var remoteUserId = '49647969';
rtcUser.declineCall(remoteUserId);
```
<a name="RtcUser+isSignedIn"></a>

### rtcUser.isSignedIn() ⇒ <code>boolean</code>
Checks if the RtcUser is connected with the webrtc server and signed in.

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Example**  
```js
// rtcUser instance of RtcUser
var isSignedIn = rtcUser.isSignedIn();
if (isSignedIn) {
    console.log('signed in');
} else {
    console.log('not signed in');
}
```
<a name="RtcUser+getDevices"></a>

### rtcUser.getDevices(mediaIndexOrId)
Gets all connected local video and audio devices

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:ReceivedDeviceList</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
rtcUser.getDevices(mediaId);
```
**Example**  
```js
var mediaIndex = 0;
rtcUser.getDevices(mediaIndex);
```
<a name="RtcUser+setVideoDevice"></a>

### rtcUser.setVideoDevice(mediaIndexOrId, config)
Sets the input video device with config for a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr><tr>
    <td>config</td><td><code>object</code></td><td><p>The config object</p>
</td>
    </tr><tr>
    <td>config.device</td><td><code>boolean</code> | <code>number</code></td><td><p>The value of the video device, possible values: true (auto device), false (no video), number (index of the video device)</p>
</td>
    </tr><tr>
    <td>[config.width]</td><td><code>number</code></td><td><p>The input width (only if device will be set by index)</p>
</td>
    </tr><tr>
    <td>[config.height]</td><td><code>number</code></td><td><p>The input height (only if device will be set by index)</p>
</td>
    </tr><tr>
    <td>[config.framerate]</td><td><code>number</code></td><td><p>The input framerate (only if device will be set by index)</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var config = {
    device: 0,
    width: 640,
    height: 360,
    framerate: 30
};
rtcUser.setVideoDevice(mediaId, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaIndex = 0;
var config = {
    device: 0
};
rtcUser.setVideoDevice(mediaIndex, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var config = {
    device: true // auto device
};
rtcUser.setVideoDevice(mediaId, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaIndex = 0;
var config = {
    device: false // no video
};
rtcUser.setVideoDevice(mediaIndex, config);
```
<a name="RtcUser+setAudioDevice"></a>

### rtcUser.setAudioDevice(mediaIndexOrId, config)
Sets the input audio device for a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr><tr>
    <td>config</td><td><code>object</code></td><td><p>The config object</p>
</td>
    </tr><tr>
    <td>config.device</td><td><code>boolean</code> | <code>number</code></td><td><p>The value of the audio device, possible values: true (auto device), false (no audio), number (index of the audio device)</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var config = {
    device: 0
};
rtcUser.setAudioDevice(mediaId, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaIndex = 0;
var config = {
    device: 0
};
rtcUser.setAudioDevice(mediaIndex, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var config = {
    device: true // auto device
};
rtcUser.setAudioDevice(mediaId, config);
```
**Example**  
```js
// rtcUser instance of RtcUser
var mediaIndex = 0;
var config = {
    device: false // no video
};
rtcUser.setAudioDevice(mediaIndex, config);
```
<a name="RtcUser+startPreview"></a>

### rtcUser.startPreview(mediaIndexOrId, videoDeviceConfig, audioDeviceConfig, [elementId])
Starts the preview of a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:StartPreviewSuccess</code>, <code>event:StartPreviewError</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr><tr>
    <td>videoDeviceConfig</td><td><code>object</code></td><td><p>The video config object</p>
</td>
    </tr><tr>
    <td>audioDeviceConfig</td><td><code>object</code></td><td><p>The audio config object</p>
</td>
    </tr><tr>
    <td>[elementId]</td><td><code>string</code></td><td><p>The id of a video element to pass in the requested stream directly</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var videoDeviceConfig = {
    device: 0,
    width: 640,
    height: 360,
    framerate: 30
};
var audioDeviceConfig = {
    device: 0
};
rtcUser.startPreview(mediaId, videoDeviceConfig, audioDeviceConfig);
```
<a name="RtcUser+stopPreview"></a>

### rtcUser.stopPreview(mediaIndexOrId)
Stops the preview of a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
**Emits**: <code>event:StopPreviewSuccess</code>, <code>event:StopPreviewError</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
rtcUser.stopPreview(mediaId);
```
<a name="RtcUser+muteVideo"></a>

### rtcUser.muteVideo(mediaIndexOrId, mute)
Mutes/unmutes the video of a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr><tr>
    <td>mute</td><td><code>boolean</code></td><td><p>Mute/unmute.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var mute = true;
rtcUser.muteVideo(mediaId, mute);
```
<a name="RtcUser+muteAudio"></a>

### rtcUser.muteAudio(mediaIndexOrId, mute)
Mutes/unmutes the audio of a local media controller

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mediaIndexOrId</td><td><code>string</code> | <code>number</code></td><td><p>The mediaId or the mediaIndex of a local media controller.</p>
</td>
    </tr><tr>
    <td>mute</td><td><code>boolean</code></td><td><p>Mute/unmute.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
var mediaId = 'local';
var mute = true;
rtcUser.muteAudio(mediaId, mute);
```
<a name="RtcUser+injectExternalMediaStream"></a>

### rtcUser.injectExternalMediaStream(config)
Mixes tracks (currently only audio) of an external MediaStream into the currently previewed local stream

**Kind**: instance method of [<code>RtcUser</code>](#RtcUser)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>config</td><td><code>object</code></td><td><p>Config object with info on what to mix in</p>
</td>
    </tr><tr>
    <td>config.stream</td><td><code>MediaStream</code></td><td><p>the MediaStream containing the track(s) to mix in</p>
</td>
    </tr><tr>
    <td>config.tracks</td><td><code>Array.&lt;string&gt;</code></td><td><p>Array with the types of tracks which should be injected (only &#39;audio&#39; is supported at the moment)</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// rtcUser instance of RtcUser
// externalStream instance of MediaStream (https://developer.mozilla.org/de/docs/Web/API/MediaStream) 
var data = {stream: externalStream, tracks: ['audio']};
rtcUser.injectExternalMediaStream(data);
```
