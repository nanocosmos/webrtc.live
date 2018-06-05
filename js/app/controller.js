// nanoStream WebRTC chat
// (c) 2014-2018 nanocosmos gmbh, All rights reserved
// http://www.nanocosmos.de 

// App Controller 
// manages user interface and app logic 
// uses
// webrtc api
// bintu api
// tools

/*jslint nomen: true, maxerr:1000, white:true, vars:true, undef:true, sub:true, plusplus: true*/
/*global console, confirm, unescape, Bintu, nanowebrtc, warning_*/

(function(){

    'use strict';

    // GUI-elements
    var UI_CONSTANTS = {
        buttonEnter: "btn-enter",
        buttonLeave: "btn-leave",
        buttonCall: "btn-call",
        buttonHangUp: "btn-hangup",
        buttonStartBroadcast: "btn-startbroadcast",
        buttonStartStopBroadcast: "btn-startstopbroadcast",
        buttonStopBroadcast: "btn-stopbroadcast",
        videoLocal: "video-local",
        videoRemote: "video-remote",
        comboBoxVideoSources: "comboBoxVideoSources",
        buttonSourceCamera: "btn-source-camera",
        buttonSourceScreen: "btn-source-screen",
        buttonSelectScreen: "btn-select-screen",
        buttonInstallExtension: 'btn-install-screenshare',
        comboBoxAudioSources: "comboBoxAudioSources",
        comboBoxResolutions: "comboBoxResolutions",
        comboBoxFramerates: "comboBoxFramerates",
        comboBoxVideoBitrates: "comboBoxVideoBitrates",
        comboBoxAudioBitrates: "comboBoxAudioBitrates",
        comboboxWebRTCVideoBitrates: "comboBoxVideoBitratesRTC",
        buttonPreview: "buttonPreview",
        roomMembers: "room-members",
        listRoomMembers: "listRoomMembers",
        mediaContentContainer: "media-content",
        optionContentContainer: "option-content",
        checkBoxAutoAnswer: "chk-autoanswer",
        inputRoom: "input-room",
        inputPeerName: "input-name",
        inputServer: "input-server",
        inputRtmpUrl: "input-rtmp-url",
        inputStreamName: "input-stream-name",
        inputBintuApiUrl: "inputBintuApiUrl",
        inputBintuApiKey: "inputBintuApiKey",
        inputBintuTags: "inputBintuTags",
        inputBintuStreamid: "inputBintuStreamid",
        bintuStreamid: "bintu-streamid",
        buttonBintuSettings: "buttonBintuSettings",
        buttonToggleDeviceOptions: "buttonToggleDeviceOptions",
        buttonToggleVideo: "buttonToggleVideo",
        buttonToggleAudio: "buttonToggleAudio",
        buttonCheckServer: "btn-checkServer",
        checkBoxUpdatePeriodically: "chk-updatePeriodically",
        statistics: "statistics",
        localVideo: "local-video",
        chatSettings: "chat-settings",
        broadcastSettings: "broadcast-settings",
        deviceOptions: "device-options",
        broadcastStatus: "broadcast-status",
        broadcastInfo: "broadcast-info",
        serverSettings: "server-settings", 
        checkBoxUseBintu: "chk-usebintu",
        checkAutoReconnect: "chk-autoreconnect"
    };
 
    // cache rtc api stuff
    var RtcUser;
    var NanoTools;
    var RtcConst;
    var AudioProcess;
    var Version;
    var Config;

    var __debug;
    var __warning;
    var __error;
    var __print;
    var __success;
    var __getElement;
    var __contains;
    var __stringifyJSON;
 
    var connect_state = {
        STOPPED      : 0,
        STARTING     : 1,
        RUNNING      : 2,
        RECONNECTING : 3,
        STOPPING     : 4
    };
    
    // constructor
    var AppController = function() {
        // the api
        
        if (typeof nanowebrtc === 'undefined') {
            alert("load error: nanowebrtc not defined");
            return;
        }
    
        RtcUser  = nanowebrtc.user;
        NanoTools  = nanowebrtc.tools;
        RtcConst = nanowebrtc.const;
        AudioProcess = nanowebrtc.audioprocess;
        Version = nanowebrtc.version;
        if(nanowebrtc.release_description) {
            Version += " " + nanowebrtc.release_description;
        }
        Config = window.NANOCONFIG;

        __debug         = NanoTools.debug_;
        __warning       = NanoTools.warning_;
        __error         = NanoTools.error_;
        __print         = NanoTools.print_;
        __success       = NanoTools.success_;
        __getElement    = NanoTools.getElement;
        __contains      = NanoTools.contains;
        __stringifyJSON = NanoTools.stringifyJSON;
        
        // log statistics / bandwidth, currently piped to debug
        this.logStats      = NanoTools.debug_;
        
        this.rtcuser = new RtcUser();

        if(Config.webrtc.enablestats) {
            this.rtcuser.enableStats();
        }

        // config
        this.server = "";
        this.userName = "";
        this.room = "";
        this.serverUserName = "";
        this.serverPassword = "";
        this.token = "";
        this.iceConfig = "";
        this.dropframes = "";
        this.h264passthrough = 1;
        this.icecast_audio = "";
        this.videoDeviceList = [];
        this.audioDeviceList = [];
        
		// auto-reconnect to broadcast server
        this.reconnect_enable = 0;
        this.reconnect_time = 3000;
        this.reconnect_timer = null;
        this.connect_status = connect_state.STOPPED; 

        // rtmp config
        this.rtmpIngestUrl = "";    // where we broadcast to
        this.rtmpPlayoutUrl = "";   // where we play from
        this.streamname = "";
        this.transcodingEnabled = true;
        this.videoCodec = "";

        // app-members
        this.isSignedIn = false;
        this.selectedRemoteUserName = undefined;
        this.selectedRemoteUserId = undefined;
        this.selectedRemoteUserIdElement = undefined;

        this.streamInUse = false;

        this.bintu = null;
        this.bintuApiKey = "";
        this.bintuApiUrl = "";
        this.bintuTags = [];
        this.useBintu = false;

        this.h5liveUrl = undefined;
        this.h5liveServer = undefined;

        this.audioProcess = new AudioProcess();

        // screen capture extension
        this.screenShareExtensionName = 'nanoScreenCapture';
        this.screenShareExtensionUrl = 'https://chrome.google.com/webstore/detail/nanostream-screen-capture/jfjljfmoopheadghnkjbonkmgbkjhjdo';

        // geoLocation
        this.gps = {
            latitude: 0,
            longitude: 0
        };
        this.positionWatcher = null;
        
        // try to signout all channelMembers on page refresh
        window.onbeforeunload = function() {
          this.destroy();
        }.bind(this);

        // show unexpected errors
        var self = this;
        window.onerror = function errorHandler(errorMsg, url, lineNumber) {
            self.messageBox("Error occured: " + errorMsg, 1);
            return false;
        };
        
    };
    
    // HACK
    window.AppController = AppController;

    var proto = AppController.prototype;

    // main-entry to the app, webpage calls this method
    proto.init = function () {
        var self = this;
        var v = "nanowebrtc v" + Version;
        this.show("nanoversion",v);
        if (RtcUser.browserSupport.supportLevel!==0) {
            this.messageBox(RtcUser.browserSupport.supportText, 1);
            if(RtcUser.browserSupport.supportLevel===1) {
                // unsupported
                return -1;
            }
        }
        this.initConfig();
        this.registerEventListeners();
        this.registerUserListeners();

        this.rtcuser.addLocalMedia("local", 0, this.screenShareExtensionName, false);
        // on Chrome check if screen capture extension has been added:
        if(NanoTools.browserInfo.browser === 'Chrome') {
            setTimeout(function() {
                if(self.rtcuser.isScreenCaptureAvailable()) {
                    __getElement(UI_CONSTANTS.buttonSourceScreen).style.display = 'block';
                    __getElement('install-screencapture').style.display = 'none';
                }
            }, 1000);
        } else { // other browsers
            __getElement('install-screencapture').style.display = 'none';
        }

        this.rtcuser.getDevices("local");
        if(Config.config.useLocation) {
            this.registerLocationService();
        }       
    };

    proto.addBintuTag = function(newTag) {
        var tags = Config.bintu.tags || "";
        var tagsLow = tags.toLowerCase();
        if(!tagsLow.includes(newTag)) {
            if(tags.length>0) {
                tags += ",";
            }
            tags += newTag;
        }
        Config.bintu.tags = tags;
    };
    
    proto.initConfig = function () {

        if (typeof Config === 'undefined') {
            __error("No config found", 2); // we should have a config, so we throw here
        }

        /* ENDPOINT */
        this.server = Config.webrtc.server || "";
        
        /* ROOM & USERNAME*/
        this.userName = Config.webrtc.username || NanoTools.getRandomString();
        Config.webrtc.username = this.userName;
        this.room = Config.webrtc.room || NanoTools.getRandomString();
        Config.webrtc.room = this.room;
        
        /* AUTHENTICATION */
        this.serverUserName = Config.webrtc.serverusername || "";
        this.serverPassword = Config.webrtc.serverpassword || "";
        this.token = Config.webrtc.token ? encodeURIComponent(Config.webrtc.token) : '';
        Config.webrtc.token = this.token;
        
        this.dropframes = Config.webrtc.dropframes || 0;
        this.icecast_audio = Config.webrtc.icecastaudio || 0;
        var iceservers = Config.webrtc.iceservers || null;
        if (iceservers) {
            try {
                var parsed = JSON.parse(unescape(iceservers));
                this.iceConfig = parsed instanceof Array ? parsed : [parsed]; // "transform" to array if only single entry is given
            } catch (e) {
                __error("url-param ice is malformed, please check. Error: " + e);
            }
        }

        this.videoCodec = Config.webrtc.videocodec || "H264";
        if(Config.webrtc.h264passthrough !== undefined && Config.webrtc.h264passthrough === 0) {
            this.h264passthrough = 0;
        }
        this.setOptionalConfig();

        // transcoding is only disabled if we use h264passthrough
        this.transcodingEnabled = this.videoCodec !== "H264" || this.h264passthrough === 0;

        if (Config.stream.id) {
            var stream = Config.stream.id;
            var first = stream.lastIndexOf('/');
            var second = stream.lastIndexOf('+');
            var k = first <= second ? second : first;
            if (k > 1) {
                this.rtmpIngestUrl = stream.substring(0, k);
                this.rtmpPlayoutUrl = this.rtmpIngestUrl;
                this.streamname = stream.substring(k + 1);
            }
        } else if (Config.stream.url && Config.stream.name) {
            this.rtmpIngestUrl = Config.stream.url;
            this.rtmpPlayoutUrl = this.rtmpIngestUrl;
            this.streamname = Config.stream.name;
        }

        /* H5LIVE CONFIG */
        this.h5liveUrl = Config.h5live.url || '';
        
        /* STREAM TAGS for bintu.live */
        this.addBintuTag("webrtc");
        this.addBintuTag("room:"+this.room);
        this.addBintuTag("user:"+this.userName);
        if(this.gps.latitude>0) {
            var gpsTag = JSON.stringify(this.gps);
            this.addBintuTag("gps:"+gpsTag);
        }
        
        /* UPDATE UI */
        __getElement(UI_CONSTANTS.inputBintuApiKey).value = Config.bintu.apikey || "";
        __getElement(UI_CONSTANTS.inputBintuApiUrl).value = Config.bintu.apiurl || "";
        
        __getElement(UI_CONSTANTS.inputBintuTags).value = Config.bintu.tags;
        
        __getElement(UI_CONSTANTS.inputRoom).value = this.room;
        __getElement(UI_CONSTANTS.roomMembers).childNodes[1].childNodes[0].innerHTML = 'Chat Room "' + this.room + '" - Username "' + this.userName + '"';
        __getElement(UI_CONSTANTS.inputPeerName).value = this.userName;
        __getElement(UI_CONSTANTS.inputServer).value = this.server;
        __getElement(UI_CONSTANTS.inputRtmpUrl).value = this.rtmpIngestUrl;
        __getElement(UI_CONSTANTS.inputStreamName).value = this.streamname;

        if(Config.media.videosource === 'screen') {
            __getElement(UI_CONSTANTS.buttonSourceScreen).classList.add('active');
            __getElement(UI_CONSTANTS.buttonSourceCamera).classList.remove('active');
        } else {
            __getElement(UI_CONSTANTS.buttonSourceScreen).classList.remove('active');
            __getElement(UI_CONSTANTS.buttonSourceCamera).classList.add('active');
        }

        this.setBintuSettings();
        if (Config.bintu.apiurl && Config.bintu.apikey && !(Config.stream.name && Config.stream.name) ) {
            this.prepareBintu();
        }

        this.setBalancedServerUrl();
    };

    // sets the server url to the url returned from rtcuser.checkServer()
    proto.setBalancedServerUrl = function() {
        var self = this;
        var urlSuffix = '.nanocosmos.de/p/webrtc';

        if(!this.server) {
            this.messageBox('server url not set', 1);
            return;
        }

        if(!this.server.includes(urlSuffix)) {
            __warning('server url does not include suffix ' + urlSuffix, 1);
            return;
        }

        var onResult = function(result) {
            if(!result.data.stats.error) {
                self.server = 'https://' + result.data.stats.hostname + urlSuffix;
                __getElement(UI_CONSTANTS.inputServer).value = self.server;
                self.rtcuser.off("ReceivedServerStats", onResult);
            } else {
                self.messageBox(result.data.stats.error, 1);
            }
        }

        this.rtcuser.on("ReceivedServerStats", onResult);
        this.rtcuser.checkServer(this.server);
    };

    // set webrtc codec & bitrates
    proto.setOptionalConfig = function () {
        var optionalConfig = {};
        optionalConfig.codecs = {};
        optionalConfig.codecs.videoCodec = this.videoCodec;

        Config.webrtc.videosendinitialbitrate = Config.webrtc.videosendinitialbitrate || 0;
        Config.webrtc.videosendbitrate = Config.webrtc.videosendbitrate || 0;
        optionalConfig.bitrates = {};
        optionalConfig.bitrates.videoSendInitialBitrate = Config.webrtc.videosendinitialbitrate;
        optionalConfig.bitrates.videoSendBitrate = Config.webrtc.videosendbitrate;

        optionalConfig.sdpPatches = {};
        optionalConfig.sdpPatches.preventReplaceSendReceive = !!(Config.sdppatches && Config.sdppatches.preventreplacesendreceive);

        // set optional config
        this.rtcuser.setOptionalConfig(optionalConfig);
    };
    
    proto.registerLocationService = function() {
        var self = this;
        try {
            var geoLoc = navigator.geolocation;
            if(geoLoc){
              // timeout at x milliseconds 
              var options = {timeout: 10000};
              self.positionWatcher = geoLoc.watchPosition(
                  function gotPosition(position) {
                    self.gps.latitude = position.coords.latitude;
                    self.gps.longitude = position.coords.longitude;
                    var m = ("Latitude : " + position.coords.latitude + " Longitude: " + position.coords.longitude);
                    var gpsTag = JSON.stringify(self.gps);
                    self.addBintuTag("gps:"+gpsTag);
                      __getElement(UI_CONSTANTS.inputBintuTags).value = Config.bintu.tags;
                    __debug(m);
                  },
                  function errorHandler(err) {
                    if(err.code === 1) {
                        __warning("geoLocation: Access denied.");
                    }else if( err.code === 2) {
                        __warning("geoLocation: Position is unavailable.");
                    }else {
                        __warning("geoLocation: Error.");
                    }
                  },
                  options);
            }else{
              __warning("browser does not support geolocation");
            }
        } catch(e) {
          __warning("error in startWatch");
        }
    };

    proto.prepareBintu = function () {
        //TODO: error checking if (Bintu)
        var self = this;
        this.useBintu = false;
        if (this.bintuApiKey.length === 0 || this.bintuApiUrl.length === 0) {
            this.messageBox('Bintu apikey or apiurl not set!', 1);
            return;
        }

        if (this.bintu === null) {
            this.bintu = new Bintu(this.bintuApiKey, this.bintuApiUrl, true, this.transcodingEnabled);
        } else {
            this.bintu.apiKey = this.bintuApiKey;
            this.bintu.apiUrl = this.bintuApiUrl;
            this.bintu.isTranscodedStream = this.transcodingEnabled;
        }
        this.bintu.createStream(this.bintuTags, function success(request) {
            var response = JSON.parse(request.responseText);
            var id = response.id;
            __success('BINTU: stream created: ' + id);
            __debug(__stringifyJSON(response));
            var state = response.state;
            var ingest = response.ingest;
            var rtmp = ingest.rtmp;
            var url = rtmp.url;
            var streamname = rtmp.streamname;
            self.rtmpIngestUrl = url;
            self.rtmpPlayoutUrl = response.playout.rtmp[0].url;
            self.streamname = streamname;
            __getElement(UI_CONSTANTS.inputRtmpUrl).value = url;
            __getElement(UI_CONSTANTS.inputStreamName).value = streamname;
            __getElement(UI_CONSTANTS.inputBintuStreamid).value = id;
            __getElement(UI_CONSTANTS.bintuStreamid).style.display = 'block';
            var h5live = response.playout.h5live;
            if (h5live && h5live.length) {
                __getElement(UI_CONSTANTS.inputBintuStreamid).dataset.h5live = true;
            }
            __getElement(UI_CONSTANTS.checkBoxUseBintu).checked = true;
            self.onClickUseBintu();
        }, function onerror(e) {
            var error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'Error: ' + e.request.responseText;
            __error(error);
            try {
                error = (typeof e.error !== 'undefined') ? e.error : '';
                var response = JSON.parse(e.request.responseText);
                var errorMsg = 'Error while creating new bintu stream (' + error + '): status=' + response.error.code + ', message=' + response.error.message;
                if(response.error.userinfo) {
                    errorMsg += ", userinfo: " + __stringifyJSON(response.error.userinfo);
                }
                self.messageBox(errorMsg, 1);
            } catch (ex) {
                error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'Error: ' + e.request.responseText;
                self.messageBox(error, 1);
            }
        });
    };

    proto.setBintuSettings = function () {
        var i;
        var apiurl = __getElement(UI_CONSTANTS.inputBintuApiUrl).value;
        var apikey = __getElement(UI_CONSTANTS.inputBintuApiKey).value;
        var tags = __getElement(UI_CONSTANTS.inputBintuTags).value;
        if (apiurl.length === 0 || apikey.length === 0) {
            this.messageBox('Please complete all Bintu settings!', 1);
            return;
        }
        this.bintuApiKey = apikey;
        this.bintuApiUrl = apiurl;
        this.bintuTags = [];
        if (tags.length > 0) {
            var parsedTags = [];
            tags = tags.split(',');
            for (i = 0; i < tags.length; i += 1) {
                var tag = tags[i];
                while (tag.indexOf(' ') === 0) {
                    tag = tag.substr(1, tag.length - 1);
                }
                while (tag.lastIndexOf(' ') === tag.length - 1) {
                    tag = tag.substr(0, tag.length - 1);
                }
                if (tag.length > 0) {
                    parsedTags.push(tag);
                }
            }
            if (parsedTags.length > 0) {
                this.bintuTags = parsedTags;
            }
        }
    };

    // for cleanup when leaving the page
    proto.destroy = function () {
        this.rtcuser.leaveRoom(true);
        this.rtcuser.stopBroadcast(true);
    };

    proto.startPreview = function () {
        if (this.streamInUse) {
            __warning('Stream is in use, startPreview not allowed!');
            return;
        }
        var entries = this.getGuiEntries();
        this.rtcuser.startPreview("local", this.getVideoDeviceConfig(),
            {
                device: entries.audioDevice
            },
            UI_CONSTANTS.videoLocal
        );
    };

    proto.stopPreview = function () {
        if (this.streamInUse) {
            __warning('Stream is in use, stopPreview not allowed!');
            return;
        }
        this.rtcuser.stopPreview("local");
    };

    //////////////////////////////////////////////////////////
    // NANO-WEBRTC-API: EVENTS / LISTENERS
    //////////////////////////////////////////////////////////

    // wire this controller to the api-events
    proto.registerUserListeners = function () {
        this.rtcuser.on("PeerListUpdated", this.onPeerListUpdated.bind(this)); // something has changed, update gui
        this.rtcuser.on("RemotePeerDisconnected", this.onRemotePeerDisconnected.bind(this)); // our remote is gone
        this.rtcuser.on("CallIncoming", this.onCallIncoming.bind(this));
        this.rtcuser.on("CallDeclined", this.onCallDeclined.bind(this));
        this.rtcuser.on("RemoteStreamAdded", this.onRemoteStreamAdded.bind(this));
        this.rtcuser.on("CallActive", this.onCallActive.bind(this));
        this.rtcuser.on("CallStillActive", this.onCallStillActive.bind(this)); // why event? we could simply return a value in startCall...
        this.rtcuser.on("ReceivedDeviceList", this.onReceivedDeviceList.bind(this));
        this.rtcuser.on("StreamInUse", this.onStreamInUse.bind(this));
        this.rtcuser.on("ReceivedRtmpStatus", this.onReceivedRtmpStatus.bind(this));
        this.rtcuser.on("ReceivedWebRTCStats", this.onReceivedWebRTCStats.bind(this));
        this.rtcuser.on("CallAgainStable", this.onCallAgainStable.bind(this));
        this.rtcuser.on("CallUnstable", this.onCallUnstable.bind(this));
        this.rtcuser.on("CallDropped", this.onCallDropped.bind(this));
        this.rtcuser.on("CallRejected", this.onCallRejected.bind(this));
        this.rtcuser.on("ReceivedServerStats", this.onReceivedServerStats.bind(this));
        this.rtcuser.on("EnterRoomSuccess", this.onEnterRoomSuccess.bind(this));
        this.rtcuser.on("EnterRoomError", this.onEnterRoomError.bind(this));
        this.rtcuser.on("LeaveRoomSuccess", this.onLeaveRoomSuccess.bind(this));
        this.rtcuser.on("LeaveRoomError", this.onLeaveRoomError.bind(this));
        this.rtcuser.on("StartBroadcastError", this.onStartBroadcastError.bind(this));
        this.rtcuser.on("StartBroadcastSuccess", this.onStartBroadcastSuccess.bind(this));
        this.rtcuser.on("StopBroadcastError", this.onStopBroadcastError.bind(this));
        this.rtcuser.on("StopBroadcastSuccess", this.onStopBroadcastSuccess.bind(this));
        this.rtcuser.on("ServerError", this.onServerError.bind(this));
        this.rtcuser.on("ServerStatus", this.onServerStatus.bind(this));
        this.rtcuser.on("StartPreviewSuccess", this.onStartPreviewSuccess.bind(this));
        this.rtcuser.on("StartPreviewError", this.onStartPreviewError.bind(this));
        this.rtcuser.on("StopPreviewSuccess", this.onStopPreviewSuccess.bind(this));
        this.rtcuser.on("StopPreviewError", this.onStopPreviewError.bind(this));
        this.rtcuser.on("BroadcastError", this.onBroadcastError.bind(this));
        this.rtcuser.on("BroadcastStatus", this.onBroadcastStatus.bind(this));
        this.rtcuser.on("MediaStreamError", this.onMediaStreamError.bind(this));
        this.rtcuser.on("Error", this.onError.bind(this));

        if(NanoTools.debugLevel >= 2) {
            this.rtcuser.addListener(/.*/, this.onAnyEvent.bind(this));
        }
        this.rtcuser.addListener("ReceivedWebRTCStats", this.collectBroadcastInfo.bind(this));
    };

    proto.onError = function(event) {
        this.messageBox(event.data.error, 1);
    };

    proto.collectBroadcastInfo = function (event) {
        var key, k, name, result, results = { };
        var remoteUserId = 0;
        if(event.target.getRole() !== RtcConst.ROLE_BROADCASTER) {
            return;
        }
        this.cleanBroadcastInfo();
        var el = document.getElementById(UI_CONSTANTS.broadcastInfo);
        if (!el) {
            return;
        }
        
        this.showWebRTCStats(event, el, remoteUserId);

    };

    proto.cleanBroadcastInfo = function () {
        var el = document.getElementById(UI_CONSTANTS.broadcastInfo);
        while (el.firstChild) { // faster than innerHTML=''
            el.removeChild(el.firstChild);
        }
    };

    // catch all events here for debugging
    proto.onAnyEvent = function (evt) {

        if(NanoTools.debugLevel < 2)
        {
            if (evt.name === 'ReceivedWebRTCStats' || evt.name === 'ReceivedServerStats') {
                return;
            }
        }
        var el = __getElement("pane-events"); // todo: cache this element in init()
        var hr = document.createElement('hr');
        var evEl = document.createElement('span');
        evEl.innerHTML = evt.name;
        if (evt.data) {
            var data = __stringifyJSON(evt.data) || evt.data.toString();
            var s;
            if ((s = data.substr(data.length - 3, 2)) === '{}') {
                data = data.substr(0, data.length - 3) + '"object"' + data.substr(data.length - 1, 1);
            }
            evEl.innerHTML += " - " + data;
        }
        el.insertBefore(hr, el.childNodes[0]);
        el.insertBefore(evEl, el.childNodes[0]);
    };

    proto.onEnterRoomSuccess = function (evt) {
        this.toggleChatInterface(true);
    };

    proto.onEnterRoomError = function (evt) {
        this.messageBox('Error: Could not enter room! ' + evt.data.text, 1);
    };

    proto.onLeaveRoomSuccess = function (evt) {
        this.clearRemotePeerList();
        this.clearRemoteGuis();
        this.toggleChatInterface(false);
    };

    proto.onLeaveRoomError = function (evt) {
        var text = 'Error: Could not leave room! ' + evt.data.text;
        //this.messageBox(text, 1);
        __warning(text);
    };

    proto.onStartBroadcastSuccess = function (evt) {
        this.toggleBroadcastButtons(false);

        var bs = __getElement(UI_CONSTANTS.broadcastSettings);
        bs.childNodes[3].style.display = "none";

        if(this.rtmpPlayoutUrl === "") {
            this.rtmpPlayoutUrl = this.rtmpIngestUrl;
        }

        var rtmp = (this.rtmpPlayoutUrl.lastIndexOf('/') === this.rtmpPlayoutUrl.length) ? this.rtmpPlayoutUrl.substr(0, this.rtmpPlayoutUrl.length - 1) : this.rtmpPlayoutUrl;
        rtmp += "/" + this.streamname;
        rtmp = evt.data.streamname || rtmp;
        this.createPlayoutBroadcast(rtmp);

        var el = document.getElementById(UI_CONSTANTS.broadcastInfo);
        el.style.display = 'block';
        
        this.connect_status = connect_state.RUNNING;
        
        __success('StartBroadcast SUCCESS');

    };

    // Event onStartBroadcastError
    // fired from StartBroadcast
    proto.onStartBroadcastError = function (evt) {
        var self = this;
        if(self.connect_status === connect_state.RECONNECTING) {
            // still reconnecting, silently return
            this.show(UI_CONSTANTS.broadcastStatus, "still reconnecting...");
            return;
        }
        if(self.reconnect_enable && self.reconnect_time>0 && self.connect_status === connect_state.STARTING) {
            this.messageBox("Reconnecting Broadcast...", 0, self.reconnect_time+2000);
            self.connect_status = connect_state.RECONNECTING;
            self.reconnect_timer = setTimeout(function () {
                self.onClickStartBroadcast();
            }, self.reconnect_time + 2000); // use +2s for initial start errors
            return;
        }
        this.messageBox('Error: Could not start broadcast! ' + evt.data.text, 1);
        var el = __getElement(UI_CONSTANTS.buttonStartBroadcast);
        el.disabled = false;
        el = __getElement(UI_CONSTANTS.buttonStartStopBroadcast);
        el.innerHTML = 'start broadcast';
        this.show(UI_CONSTANTS.broadcastStatus, 'error.');
    };

    proto.StopBroadcastSuccess = function () {
        this.toggleBroadcastButtons(true);
        this.removePlayoutBroadcast();
        this.cleanBroadcastInfo();
        this.connect_status = connect_state.STOPPED;
    };
    
    proto.onStopBroadcastSuccess = function (evt) {
        this.StopBroadcastSuccess();
    };

    proto.onStopBroadcastError = function (evt) {
        this.messageBox('Error: Could not stop broadcast! ' + evt.data.text, 1);
    };

    proto.onBroadcastError = function (evt) {
        var self = this;
        this.toggleBroadcastButtons(true);     
        this.removePlayoutBroadcast();
        if(self.connect_status === connect_state.RECONNECTING) {
            this.show(UI_CONSTANTS.broadcastStatus, "reconnect error.");
            this.messageBox("Reconnect Error", 0, 2000);
            return;
        }
        if(self.reconnect_enable && self.reconnect_time>0 && 
           self.connect_status !== connect_state.STOPPED && 
           self.connect_status !== connect_state.STOPPING) {
            this.show(UI_CONSTANTS.broadcastStatus, "reconnecting...");
            this.messageBox("Reconnecting Broadcast...", 0, self.reconnect_time+1000);
            self.connect_status = connect_state.RECONNECTING;
            self.reconnect_timer = setTimeout(function () {
                self.onClickStartBroadcast();
            }, self.reconnect_time);
        } else {
            this.messageBox(evt.data.text, 1);            
        }
    };

    proto.onBroadcastStatus = function (evt) {
        this.show(UI_CONSTANTS.broadcastStatus, evt.data.text);
    };

    proto.onCallIncoming = function (event) {
        __print("call incoming from " + event.data.remoteUserName);
        if (__getElement(UI_CONSTANTS.checkBoxAutoAnswer).checked) {
            this.rtcuser.answerCall(event.data.remoteUserId);
        } else {
            if (confirm("You are being called from " + event.data.remoteUserName + ", answer?")) {
                this.rtcuser.answerCall(event.data.remoteUserId);
            } else {
                this.rtcuser.declineCall(event.data.remoteUserId);
            }
        }
    };

    proto.onAudioNoStream = function (event) {
        this.audioProcess.reset();
        this.onAudioProcess();
    };

    proto.onAudioNoTrack = function (event) {
        this.audioProcess.reset();
        this.onAudioProcess();
    };

    proto.onAudioProcess = function (event) {
        var muted = (document.getElementById('buttonToggleAudio').dataset.muted === 'false') ? false : true;
        var el = __getElement(UI_CONSTANTS.buttonPreview);        
        var level = 0;
        var offset = 4;
        var color = 'red';
        if (!muted && __contains(el.textContent, '*op*') && !!event) {
            level = event.data.channels[0].avgLevel;
            color = 'green';
        }
        var e = document.getElementById("audio-process");
        e.width = 40;
        e.height = 40;
        var context = e.getContext("2d");
        context.beginPath();
        context.fillStyle = color;
        context.arc(20, 20, level * 16 + offset, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.beginPath();
        context.fillStyle = "transparent";
        context.arc(20, 20, 18, 0, 2 * Math.PI);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
    };

    proto.onRemoteStreamAdded = function (event) {
        var remoteUserName = event.data.remoteUserName;
        var remoteUserId = event.data.remoteUserId;
        this.createRemoteGui(remoteUserName, remoteUserId);
        var type = event.data.metadata.hasVideo ? 'video' : 'audio';
        this.createRemoteMedia(remoteUserName, remoteUserId, type);
        var mediaElement = __getElement("remote-" + type + "-" + remoteUserId);
        mediaElement.srcObject = event.data.stream;        
    };

    proto.onServerError = function (evt) {
        this.messageBox('Server error' + evt.data.status + ': ' + evt.data.text + '\r\nLeaved room and stopped broadcasts!' , 1);
    };

    proto.onServerStatus = function (evt) {
        this.messageBox('Server status changed to ' + evt.data.status + ': ' + evt.data.text);
    };

    // call with a remote became active
    proto.onCallActive = function (event) {
        this.createRemoteGui(event.data.remoteUserName, event.data.remoteUserId);
        this.createRemoteHangUpCall(event.data.remoteUserName, event.data.remoteUserId);
        this.createStatistics(event.data.remoteUserName, event.data.remoteUserId);
    };

    proto.onCallStillActive = function (event) {
        this.messageBox('We are still in a call with "' + event.data.remoteUserName + '"!');
    };

    proto.onStartPreviewSuccess = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            __success('StartPreview SUCCESS');

            var entries = this.getGuiEntries();

            var audioDeviceIndex = entries.audioDevice;

            // Verify that the selected video device is the correct one
            var videoDeviceIndex = entries.videoDevice;
            var userSelectedVideoDevice = this.videoDeviceList[videoDeviceIndex];
            var webrtcSelectedVideoDevice = this.rtcuser.getSelectedVideoDevice();
            if (userSelectedVideoDevice && 
                webrtcSelectedVideoDevice && 
                webrtcSelectedVideoDevice.length > 0) {
                var userSelectedVideoDeviceId = userSelectedVideoDevice.id.replace("videodevice ID: ", "");
                var webrtcSelectedVideoDeviceId = webrtcSelectedVideoDevice[0].label.replace("videodevice ID: ", "");
                if (userSelectedVideoDeviceId !== webrtcSelectedVideoDeviceId) {
                    __warning("User-selected video device (" + 
                        userSelectedVideoDeviceId + 
                        ") does not match the WebRTC-selected video device (" 
                        + webrtcSelectedVideoDeviceId + ")!");
                }
            }

            // Verify that the selected audio device is the correct one
            var userSelectedAudioDevice = this.audioDeviceList[audioDeviceIndex];
            var webrtcSelectedAudioDevice = this.rtcuser.getSelectedAudioDevice();
            if (userSelectedAudioDevice && 
                webrtcSelectedAudioDevice && 
                webrtcSelectedAudioDevice.length > 0) {
                var userSelectedAudioDeviceId = userSelectedAudioDevice.id.replace("audiodevice ID: ", "");
                var webrtcSelectedAudioDeviceId = webrtcSelectedAudioDevice[0].label.replace("audiodevice ID: ", "");
                if (userSelectedAudioDeviceId !== webrtcSelectedAudioDeviceId) {
                    __warning("User-selected audio device (" + 
                    userSelectedAudioDeviceId + 
                    ") does not match the WebRTC-selected audio device (" 
                    + webrtcSelectedAudioDeviceId + ")!");
                }
            }

            __print('Constraints: ' + JSON.stringify(evt.data.constraints));
            __print('Metadata: ' + JSON.stringify(evt.data.metadata));
            var el = __getElement(UI_CONSTANTS.buttonPreview);
            el.textContent = 'stop preview';
            el = __getElement(UI_CONSTANTS.buttonStartBroadcast);
            el.disabled = false;
            __getElement('video-local').parentNode.style.display = 'inline-block';
            __getElement('buttonToggleVideo').style.display = 'inline-block';
            __getElement('buttonToggleAudio').style.display = 'inline-block';
            document.getElementById('buttonToggleVideo').dataset.muted = 'false';
            document.getElementById('buttonToggleAudio').dataset.muted = 'false';
            document.getElementById('buttonToggleVideo').textContent = 'mute video';
            document.getElementById('buttonToggleAudio').textContent = 'mute audio';
            var stream = event.data.stream;
            var videoElement = __getElement(UI_CONSTANTS.videoLocal); 
            videoElement.srcObject = stream;
            this.audioProcess.on('AudioProcess', this.onAudioProcess.bind(this));
            this.audioProcess.on('AudioNoStream', this.onAudioNoStream.bind(this));
            this.audioProcess.on('AudioNoTrack', this.onAudioNoTrack.bind(this));
            this.audioProcess.connect(stream, {
                bufferSize: 1024,
                numInputChannels: 2,
                numOutputChannels: 2,
                channels: [
                    {
                        name: 'left',
                        id: 0
                    },
                    {
                        name: 'right',
                        id: 1
                    }
                ]
            });
        }
    };

    proto.onStartPreviewError = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            this.messageBox('Error starting preview: ' + event.data.error);
            this.audioProcess.reset();
            this.hideVideoControls();
        }
    };

    proto.onMediaStreamError = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            this.messageBox('Error processing media stream: ' + event.data.error);
            this.audioProcess.reset();
            this.hideVideoControls();
        }
    };

    proto.onStopPreviewSuccess = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            this.audioProcess.reset();
            this.hideVideoControls();
        }
    };

    proto.onStopPreviewError = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            this.messageBox('Error stopping preview: ' + event.data.error);
        }
    };

    proto.onStreamInUse = function (event) {
        var ch;
        this.streamInUse = event.data.streaminuse;

        __getElement(UI_CONSTANTS.buttonPreview).disabled = this.streamInUse;
        __getElement(UI_CONSTANTS.comboBoxVideoSources).disabled = this.streamInUse;
        __getElement(UI_CONSTANTS.comboBoxAudioSources).disabled = this.streamInUse;
        __getElement(UI_CONSTANTS.comboBoxResolutions).disabled = this.streamInUse;
        __getElement(UI_CONSTANTS.comboBoxFramerates).disabled = this.streamInUse;
        var media = document.getElementById(UI_CONSTANTS.mediaContentContainer);
        var opts = document.getElementById(UI_CONSTANTS.optionContentContainer);
        if (this.streamInUse && !event.data.onlybroadcast) {
            media.parentNode.className = '';
            media.className = 'row no-margin';
            for (ch in media.childNodes) {
            //for (ch=0; ch<media.childNodes.length; ch++) {
                if (media.childNodes[ch].style) {
                    media.childNodes[ch].className = 'media-content col-md-6';
                }
            }
            opts.className = 'row no-margin';
        } else {
            media.parentNode.className = 'row';
            media.className = 'col-md-6';
            for (ch in media.childNodes) {
            //for (ch=0; ch<media.childNodes.length; ch++) {
                if (media.childNodes[ch].style) {
                    media.childNodes[ch].className = 'media-content col-md-12';
                }
            }
            opts.className = 'col-md-6';
        }
    };

    proto.onReceivedRtmpStatus = function (event) {
        __print("RTMP Event");
        __debug(event);
    };
    
    proto.showWebRTCStats = function (event, el, remoteUserId) {
        var name, element, result, results;
        var statsString = "";

        if(event.name !== 'ReceivedWebRTCStats') {
            return;
        }

        results = event.data.results;

        for (name in results) {
            result = results[name];
            statsString = name + ": " + result;
            if(remoteUserId) {
                element = 'user-' + remoteUserId + '-' + name;
                this.updateSpanText(el, element, statsString);
            } else {
                this.createLabel(el, statsString);
            }
        }
    };
    
    proto.onReceivedWebRTCStats = function (event) {
        var remoteUserId = event.data.remoteUserId;
        var el = document.getElementById('user-statistics-entry-' + remoteUserId);
        if (!el) {
            return;
        }
        this.showWebRTCStats(event, el, remoteUserId);
    };

    proto.onCallAgainStable = function (event) {
        __success('Call with user "' + event.data.remoteUserName + '" (' + event.data.remoteUserId + ')" now stable again');
        var el = document.getElementById("remote-gui-" + event.data.remoteUserId);
        if (el) {
            if (el.childNodes[1].childNodes.length === 0) {
                el.childNodes[1].style.display = 'none';
            }
            el.childNodes[1].style.backgroundColor = '';
        }
    };

    proto.onCallUnstable = function (event) {
        __warning('Call with user "' + event.data.remoteUserName + '" (' + event.data.remoteUserId + ')" temporary not stable, checking...');
        var el = document.getElementById("remote-gui-" + event.data.remoteUserId);
        if (el) {
            el.childNodes[1].style.display = 'block';
            el.childNodes[1].style.backgroundColor = 'orange';
        }
    };

    proto.onCallDropped = function (event) {
        var m = 'Call dropped';
        if(event.data.remoteUserName) {
            m += ' with user "' + event.data.remoteUserName + '" (' + event.data.remoteUserId + ')!';
        }
        this.messageBox(m);
        var el = document.getElementById("remote-gui-" + event.data.remoteUserId);
        if (el) {
            el.childNodes[1].style.display = 'block';
            el.childNodes[1].style.backgroundColor = 'red';
        }
    };

    proto.onCallRejected = function (event) {
        var m = 'Call stopped';
        if(event.data.remoteUserName) {
            m += ' by user "' + event.data.remoteUserName + '" (' + event.data.remoteUserId + ')!';
        }
        this.messageBox(m);
    };

    proto.onReceivedServerStats = function (event) {
        var key, el = document.getElementById("txt-serverStats");
        el.innerHTML = "";
        for (key in event.data.stats) {
            if (event.data.stats.hasOwnProperty(key)) {
                el.innerHTML += key + " : " + event.data.stats[key] + " ";
            }
        }
    };

    proto.onReceivedDeviceList = function (event) {
        var evt = event;
        if (evt.data.mediaId === 'local') {
            this.onAudioProcess();

            // POPULATE DEVICE SETTINGS
            this.videoDeviceList = event.data.devices.videodevices;
            this.fillDevices(UI_CONSTANTS.comboBoxVideoSources, this.videoDeviceList);
            this.createOptions(UI_CONSTANTS.comboBoxResolutions, ["320x240", "640x360", "640x480", "800x600", "1280x720", "1920x1080"], Config.media.width + "x" + Config.media.height);
            this.createOptions(UI_CONSTANTS.comboBoxFramerates, ["3", "5", "6", "10", "15", "20", "25", "30"], "30");
            this.audioDeviceList = event.data.devices.audiodevices;
            this.fillDevices(UI_CONSTANTS.comboBoxAudioSources, this.audioDeviceList);

            // POPULATE CODEC SETTINGS
            var videoBitrates = [100, 200, 300, 400, 500, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500];
            this.createOptions(UI_CONSTANTS.comboBoxVideoBitrates, videoBitrates , Config.stream.videobitrate, "bitrate");
            this.createOptions(UI_CONSTANTS.comboBoxAudioBitrates, [32, 56, 64, 96, 128], Config.stream.audiobitrate, "bitrate");

            // POPULATE WEBRTC SETTINGS
            this.createOptions(UI_CONSTANTS.comboboxWebRTCVideoBitrates, videoBitrates, 500000, "bitrate");

            var el = __getElement(UI_CONSTANTS.buttonPreview);
            if (__contains(el.textContent, '*top*')) {
                this.startPreview(evt.data.mediaId);
            }
        }
    };

    proto.onPeerListUpdated = function (event) {
        var i;
        var btnCall = __getElement(UI_CONSTANTS.buttonCall);
        btnCall.disabled = true;
        var btnHangUp = __getElement(UI_CONSTANTS.buttonHangUp);
        btnHangUp.disabled = true;

        var roomMember = document.getElementById(UI_CONSTANTS.roomMembers);
        var panelBody = roomMember.childNodes[3];
        panelBody.innerHTML = '';
        var list = document.createElement('ul');
        list.setAttribute('id', UI_CONSTANTS.listRoomMembers);
        list.className = "list-group";
        var entry, self = this;
        function select(entry, callEnabled) {
            if (btnCall.disabled && btnHangUp.disabled) {
                entry.classList.remove("label-active");
                entry.classList.add("label-success");
                callEnabled ? btnCall.disabled = false : btnHangUp.disabled = false;
                __debug("user selected: " + entry.dataset.remoteusername);
                self.selectedRemoteUserName = entry.dataset.remoteusername;
                self.selectedRemoteUserId = entry.dataset.remoteuserid;
                self.selectedRemoteUserIdElement = entry;
            }
            entry.addEventListener('click', self.onClickRoomMember.bind(self));
        }
        for (i = 0; i < event.data.userlist.length; i++) {
            entry = document.createElement('ul');
            entry.appendChild(document.createTextNode(event.data.userlist[i].remoteUserName));
            entry.className = "list-group-item label-active";
            entry.setAttribute('data-remoteuserid', event.data.userlist[i].remoteUserId);
            entry.setAttribute('data-remoteusername', event.data.userlist[i].remoteUserName);
            entry.setAttribute('id', 'peerlist-entry-' + event.data.userlist[i].remoteUserId);

            // show state in gui
            var state = event.data.userlist[i].state;
            var stateEl = document.createElement('label');
            stateEl.className = "pull-right";

            entry.appendChild(stateEl);

            list.appendChild(entry);
            switch (state) {

                case RtcConst.CHANNEL_SIGNED_IN:
                    this.removeRemoteGui(event.data.userlist[i].remoteUserId);
                    stateEl.innerHTML = "free (" + state + ")";
                    stateEl.style.color = "green";
                    select(entry, true);
                    break;
                case RtcConst.CHANNEL_HANDSHAKE:
                    this.removeRemoteGui(event.data.userlist[i].remoteUserId);
                    stateEl.innerHTML = "handshake (" + state + ")";
                    stateEl.style.color = "orange";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALLING:
                    stateEl.innerHTML = "calling (" + state + ")";
                    stateEl.style.color = "orange";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALL_INCOMING:
                    stateEl.innerHTML = "call incoming (" + state + ")";
                    stateEl.style.color = "orange";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALL_NEGOTIATING:
                    stateEl.innerHTML = "negoatiating call (" + state + ")";
                    stateEl.style.color = "orange";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALL_ACTIVE:
                    stateEl.innerHTML = "call active (" + state + ")";
                    stateEl.style.color = "red";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALL_DROPPED:
                    stateEl.innerHTML = "call dropped (" + state + ")";
                    stateEl.style.color = "red";
                    select(entry, false);
                    break;
                case RtcConst.CHANNEL_CALL_UNSTABLE:
                    stateEl.innerHTML = "call unstable, checking... (" + state + ")";
                    stateEl.style.color = "red";
                    select(entry, false);
                    break;
                default:
                    stateEl.innerHTML = "uncaught state (" + state + ")";
            }

            if (state !== RtcConst.CHANNEL_CALL_ACTIVE) {
                this.removeStatistics(event.data.userlist[i].remoteUserId);
            }
        }
        if (list.childNodes.length === 0) {
            entry = document.createElement('ul');
            entry.appendChild(document.createTextNode('no other members joined the room, waiting...'));
            list.appendChild(entry);
        }
        panelBody.appendChild(list);
        panelBody.style.display = 'block';
    };

    proto.onCallDeclined = function (event) {
        this.messageBox('"' + event.data.remoteUserName + '" has declined the call!');
    };

    proto.onRemotePeerDisconnected = function (event) {
        this.removeRemoteGui(event.data.remoteUserId);
    };

    proto.onReceivedMetaData = function (event) {
        if (event.currentTarget.dataset.remoteusername) {
            __debug('received stream from user "' + event.currentTarget.dataset.remoteusername + '" with resolution ' + event.currentTarget.videoWidth + 'x' + event.currentTarget.videoHeight);
        } else {            
            __debug('received our stream with resolution ' + event.currentTarget.videoWidth + 'x' + event.currentTarget.videoHeight);
        }
    };

    //////////////////////////////////////////////////////////
    // GUI-EVENTS
    //////////////////////////////////////////////////////////

    // register gui-events for the app
    proto.addEvent = function (elementName, evName, evFunction, tf) {
        var self = this;
        var el = __getElement(elementName);
        el.addEventListener(evName, evFunction.bind(self));
    };
    
    proto.registerEventListeners = function () {
        var e,el;
        this.addEvent(UI_CONSTANTS.buttonEnter, 'click', this.onClickEnter);
        this.addEvent(UI_CONSTANTS.buttonLeave, 'click', this.onClickLeave);
        this.addEvent(UI_CONSTANTS.buttonPreview, 'click', this.onClickPreview);
        this.addEvent(UI_CONSTANTS.buttonCall, 'click', this.onClickCall);
        this.addEvent(UI_CONSTANTS.buttonHangUp, 'click', this.onClickHangUp);
        this.addEvent(UI_CONSTANTS.buttonStartBroadcast, 'click', this.onClickStartBroadcast);
        this.addEvent(UI_CONSTANTS.buttonStartStopBroadcast, 'click', this.onClickStartStopBroadcast);
        this.addEvent(UI_CONSTANTS.buttonStopBroadcast, 'click', this.onClickStopBroadcast);
        this.addEvent(UI_CONSTANTS.comboBoxVideoSources, 'change', this.onChangeVideoSource);
        this.addEvent(UI_CONSTANTS.buttonSourceCamera, 'click', this.onVideoSourceClicked);
        this.addEvent(UI_CONSTANTS.buttonSourceScreen, 'click', this.onVideoSourceClicked);
        this.addEvent(UI_CONSTANTS.buttonSelectScreen, 'click', this.onChangeVideoSource);
        this.addEvent(UI_CONSTANTS.buttonInstallExtension, 'click', this.onClickInstallExtension);
        this.addEvent(UI_CONSTANTS.comboBoxAudioSources, 'change', this.onChangeAudioSource);
        this.addEvent(UI_CONSTANTS.comboBoxResolutions, 'change', this.onChangeVideoSettings);
        this.addEvent(UI_CONSTANTS.comboBoxFramerates, 'change', this.onChangeVideoSettings);
        this.addEvent(UI_CONSTANTS.comboboxWebRTCVideoBitrates, 'change', this.onChangeWebRTCVideoBitrate);
        this.addEvent(UI_CONSTANTS.comboBoxVideoBitrates, 'change', this.onChangeVideoBitrate);
        this.addEvent(UI_CONSTANTS.comboBoxAudioBitrates, 'change', this.onChangeAudioBitrate);
        this.addEvent(UI_CONSTANTS.inputRoom, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputPeerName, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputServer, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputRtmpUrl, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputStreamName, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputBintuApiUrl, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputBintuApiKey, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.inputBintuTags, 'input', this.onChangeInput);
        this.addEvent(UI_CONSTANTS.buttonBintuSettings, 'click', this.onClickBintuSettings);
        this.addEvent(UI_CONSTANTS.buttonToggleDeviceOptions, 'click', this.onClickToggleDeviceOptions);
        this.addEvent(UI_CONSTANTS.buttonToggleVideo, 'click', this.onClickToggleMedia);
        this.addEvent(UI_CONSTANTS.buttonToggleAudio, 'click', this.onClickToggleMedia);
        this.addEvent(UI_CONSTANTS.buttonCheckServer, 'click', this.onClickCheckServer);
        this.addEvent(UI_CONSTANTS.checkBoxUseBintu, 'click', this.onClickUseBintu);
        this.addEvent(UI_CONSTANTS.checkAutoReconnect, 'click', this.onClickAutoReconnect);
        this.addEvent(UI_CONSTANTS.videoLocal, 'loadedmetadata', this.onReceivedMetaData);

        // click handler for panel titles to open options
        el = document.querySelectorAll('h3.panel-title');
        for (e in el) {
            if(el[e].addEventListener) { 
                el[e].addEventListener('click', this.onClickPanelTitle.bind(this));
            }
        }

        __debug("GUI-Events registered");
    };

    proto.onChangeInput = function (event) {
        __debug(event.currentTarget.id);
        __debug(event.currentTarget.value);
        switch (event.currentTarget.id) {
            case UI_CONSTANTS.inputRoom:
                this.room = event.currentTarget.value;
                __getElement(UI_CONSTANTS.roomMembers).childNodes[1].childNodes[0].innerHTML = 'Room "' + this.room + '" - Username "' + this.userName + '"';
                break;
            case UI_CONSTANTS.inputPeerName:
                this.userName = event.currentTarget.value;
                __getElement(UI_CONSTANTS.inputStreamName).value = this.userName;
                __getElement(UI_CONSTANTS.roomMembers).childNodes[1].childNodes[0].innerHTML = 'Room "' + this.room + '" - Username "' + this.userName + '"';
                break;
            case UI_CONSTANTS.inputServer:
                this.server = event.currentTarget.value;
                break;
            case UI_CONSTANTS.inputRtmpUrl:
                this.rtmpIngestUrl = event.currentTarget.value;
                break;
            case UI_CONSTANTS.inputStreamName:
                this.streamname = event.currentTarget.value;
                break;
            default:
                break;
        }
    };

    proto.onClickAutoReconnect = function(event){
        //this.useBintu = !this.useBintu;
	};
	
    proto.onClickUseBintu = function(event){
        this.useBintu = !this.useBintu;

        var el = __getElement(UI_CONSTANTS.inputBintuApiUrl);
        el.disabled = !this.useBintu;

        el = __getElement(UI_CONSTANTS.inputBintuApiKey);
        el.disabled = !this.useBintu;

        el = __getElement(UI_CONSTANTS.inputBintuTags);
        el.disabled = !this.useBintu;

        el = __getElement(UI_CONSTANTS.inputRtmpUrl);
        el.disabled = this.useBintu;

        el = __getElement(UI_CONSTANTS.inputStreamName);
        el.disabled = this.useBintu;

        el = __getElement(UI_CONSTANTS.buttonBintuSettings);
        el.disabled = !this.useBintu;

    };

    proto.onClickBintuSettings = function () {
        this.setBintuSettings();
        this.prepareBintu();
    };

    proto.onClickPanelTitle = function (event) {
        var el = event.currentTarget.parentNode.nextElementSibling;
        if (el.style.display === 'none') {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    };

    // enter room with selected settings (sign in)
    proto.onClickEnter = function () {
        if (this.server.length === 0 || this.room.length === 0 || this.userName.length === 0) {
            this.messageBox('Please fill out all the server settings before entering a room!');
            return;
        }
        if (!this.rtcuser.isSignedIn() || __getElement(UI_CONSTANTS.buttonStartBroadcast).disabled) {

            this.rtcuser.setConfig(
                this.server,
                this.userName,
                this.room,
                this.token,
                this.serverUserName,
                this.serverPassword,
                this.bintuApiKey
            );

            if (this.iceConfig.length > 0) {
                this.rtcuser.setIceServers(this.iceConfig);
            }
            this.rtcuser.enterRoom();
        }
    };

    // leave room (sign out)
    proto.onClickLeave = function () {
        this.rtcuser.leaveRoom();
    };

    proto.onClickCheckServer = function (event) {
        this.rtcuser.checkServer(this.server);

        if (document.getElementById(UI_CONSTANTS.checkBoxUpdatePeriodically).checked) {
            var self = this;
            setTimeout(function () {
                self.onClickCheckServer();
            }, 10000);
        }
    };

    // call another member from our room
    proto.onClickCall = function () {
        __print("calling " + this.selectedRemoteUserName);
        this.rtcuser.invokeCall(this.selectedRemoteUserId);
    };

    proto.onClickHangUp = function () {
        __print("hang up " + this.selectedRemoteUserName);
        this.rtcuser.hangUpCall(this.selectedRemoteUserId);
    };

    proto.onClickStartBroadcast = function () {
        if(this.connect_status===connect_state.STOPPING) {
            return;
        }
        __print("StartBroadcast");
        if (this.rtmpIngestUrl.length === 0 || this.streamname.length === 0) {
            this.messageBox('Please fill out all the broadcast settings before start streaming!');
            return;
        }
        if (this.server.length === 0 || this.room.length === 0 || this.userName.length === 0) {
            this.messageBox('Please fill out all the server settings before entering a room!');
            return;
        }
        var rtmp = (this.rtmpIngestUrl.lastIndexOf('/') === this.rtmpIngestUrl.length) ? this.rtmpIngestUrl.substr(0, this.rtmpIngestUrl.length - 1) : this.rtmpIngestUrl;
        
        this.toggleBroadcastButtons(false);
        
        var entries = this.getGuiEntries();
        var broadcastConfig = {
            transcodingTargets: {
                output: rtmp,
                streamname: encodeURIComponent(this.streamname),
                videobitrate: entries.videoBitrate,
                audiobitrate: entries.audioBitrate,
                framerate: entries.framerate,
                dropframes: this.dropframes,
                h264passthrough: this.h264passthrough,
                icecast_audio: this.icecast_audio
            }
        };

        if (this.iceConfig.length > 0) {
            this.rtcuser.setIceServers(this.iceConfig);
        }

        this.rtcuser.setConfig(
                this.server,
                this.userName,
                this.room,
                this.token,
                this.serverUserName,
                this.serverPassword,
                this.bintuApiKey
            );

        this.connect_status = connect_state.STARTING;
        this.rtcuser.startBroadcast(broadcastConfig);
    };

    proto.createPlayoutBroadcast = function (url) {
        
        var parent = document.getElementById("btn-stopbroadcast").parentNode;
        var p = document.createElement('p');
        p.setAttribute('id', 'container-playout');
        var label = document.createElement('label');
        label.appendChild(document.createTextNode(url));

        // deprecated: old site with flash player
        if(Config.config.showOldFlashPlayer) {
            url = 'http://www.nanocosmos.de/nanostream/player.html?id=' + url;
            var btnPlayout = document.createElement('button');
            btnPlayout.innerHTML = "play flash stream";
            btnPlayout.setAttribute('id', 'btn-playout');
            btnPlayout.className = "btn btn-primary";
            btnPlayout.addEventListener("click", function () {
                window.open(url, '_blank');
            });

            p.appendChild(label);
            p.appendChild(btnPlayout);
            parent.appendChild(p);
        }
        
        var el = __getElement(UI_CONSTANTS.inputBintuStreamid);
        var bintuStreamid = el.value;
        var h5live = this.h5liveUrl !== '';
        if(!h5live) {
            __warning('no h5live url set!');
            return;
        }

        var h5livePlayoutUrl = this.h5liveUrl + '?';
        if (bintuStreamid.length && this.useBintu) {
            var bintuApiurl = __getElement(UI_CONSTANTS.inputBintuApiUrl).value;
            h5livePlayoutUrl += 'bintu.apiurl=' + bintuApiurl;
            h5livePlayoutUrl += '&bintu.streamid=' + bintuStreamid;
            h5livePlayoutUrl += '&token=' + this.token;
            
        } else {
            h5livePlayoutUrl += 'h5live.rtmp.url=' + this.rtmpPlayoutUrl;
            h5livePlayoutUrl += '&h5live.rtmp.streamname=' + this.streamname;
            h5livePlayoutUrl += '&h5live.token=' + this.token;
        }
        
        var p2 = document.createElement('p');
        p2.setAttribute('id', 'container-playout2');
        var label2 = document.createElement('label');
        label2.appendChild(document.createTextNode(h5livePlayoutUrl));
        var btnPlayout2 = document.createElement('button');
        btnPlayout2.innerHTML = "play h5live stream";
        btnPlayout2.setAttribute('id', 'btn-playout');
        btnPlayout2.className = "btn btn-primary";
        btnPlayout2.addEventListener("click", function () {
            window.open(h5livePlayoutUrl, '_blank');
        });
        p2.appendChild(label2);
        p2.appendChild(btnPlayout2);
        parent.appendChild(p2);
    };

    proto.removePlayoutBroadcast = function () {
        var parent;
        var cPlayout = document.getElementById('container-playout');
        if (cPlayout) {
            parent = cPlayout.parentNode;
            parent.removeChild(cPlayout);
        }

        var cPlayout2 = document.getElementById('container-playout2');
        if (cPlayout2) {
            parent = cPlayout2.parentNode;
            parent.removeChild(cPlayout2);
        }
    };

    proto.onClickStopBroadcast = function () {
        __print("StopBroadcast");
        var self = this;
        self.connect_status = connect_state.STOPPING;
        clearTimeout(self.reconnect_timer);
        this.rtcuser.stopBroadcast();
        setTimeout(function () { 
            // allow reconnect states to return
            self.StopBroadcastSuccess();
        }, 2000);
    };

    proto.onClickStartStopBroadcast = function () {
        var el = __getElement(UI_CONSTANTS.buttonStartStopBroadcast);
        if (el.innerText.indexOf('tart') !== -1) {
            this.onClickStartBroadcast();
        } else {
            this.onClickStopBroadcast();
        }
    };

    // start previewing our local device
    proto.onClickPreview = function () {
        if (this.streamInUse) {
            this.messageBox('Stream is in use, not allowed!');
            return;
        }
        var el = __getElement(UI_CONSTANTS.buttonPreview);
        if (__contains(el.textContent, '*tart*')) {
            this.startPreview("local");
        } else {
            this.stopPreview("local");
        }
    };

    proto.onClickToggleDeviceOptions = function (event) {       
        var el = document.getElementById('device-options');
        el.style.display = el.style.display === 'block' ? 'none' : 'block';
    };

    proto.onClickToggleMedia = function (event) {
        var media = event.currentTarget.dataset.media;
        var muted = (event.currentTarget.dataset.muted === 'false') ? false : true;
        this.rtcuser['mute' + media.substr(0, 1).toUpperCase() + media.substr(1, media.length - 1)].call(this.rtcuser, "local", !muted);
        event.currentTarget.innerHTML = ((!muted) ? 'un' : '') + 'mute ' + media;
        event.currentTarget.dataset.muted = !muted;
    };

    // remember a selected remotePeer (from UI_CONSTANTS.listRoomMembers)
    // and update the gui
    proto.onClickRoomMember = function (event) {
        var btnCall, btnHangUp;
        // toggle gui
        if (this.selectedRemoteUserId) {
            this.selectedRemoteUserIdElement.classList.remove("label-success");
            this.selectedRemoteUserIdElement.classList.add("label-active");
        }
        event.currentTarget.classList.remove("label-active");
        event.currentTarget.classList.add("label-success");

        if (event.currentTarget.childNodes[1].textContent === 'free (2)') {
            btnCall = __getElement(UI_CONSTANTS.buttonCall);
            btnCall.disabled = false;
            btnHangUp = __getElement(UI_CONSTANTS.buttonHangUp);
            btnHangUp.disabled = true;
        } else {
            btnCall = __getElement(UI_CONSTANTS.buttonCall);
            btnCall.disabled = true;
            btnHangUp = __getElement(UI_CONSTANTS.buttonHangUp);
            btnHangUp.disabled = false;
        }
        __debug("user selected: " + event.currentTarget.dataset.remoteusername);
        this.selectedRemoteUserName = event.currentTarget.dataset.remoteusername;
        this.selectedRemoteUserId = event.currentTarget.dataset.remoteuserid;
        this.selectedRemoteUserIdElement = event.currentTarget;
    };

    proto.getVideoDeviceConfig = function() {
        var entries = this.getGuiEntries();
        return {
                    device: entries.videoDevice,
                    width: entries.width,
                    height: entries.height,
                    minFramerate: Config.media.minframerate, // no gui entry for now
                    framerate: entries.framerate
                };
    };
    
    proto.onChangeVideoSource = function (event) {
        this.startPreview();
    };

    proto.onChangeAudioSource = function (event) {
        this.startPreview();
    };

    proto.onVideoSourceClicked = function(event) {
        if(event.currentTarget.id === UI_CONSTANTS.buttonSourceCamera) {
           document.getElementById(UI_CONSTANTS.buttonSourceCamera).classList.add('active');
           document.getElementById(UI_CONSTANTS.buttonSourceScreen).classList.remove('active');
           document.getElementById(UI_CONSTANTS.comboBoxVideoSources).style.display = 'block';
           document.getElementById(UI_CONSTANTS.buttonSelectScreen).style.display = 'none';
        } else if(event.currentTarget.id === UI_CONSTANTS.buttonSourceScreen) {
           document.getElementById(UI_CONSTANTS.buttonSourceCamera).classList.remove('active');
           document.getElementById(UI_CONSTANTS.buttonSourceScreen).classList.add('active');
           document.getElementById(UI_CONSTANTS.comboBoxVideoSources).style.display = 'none';
           document.getElementById(UI_CONSTANTS.buttonSelectScreen).style.display = 'block';
        }
        this.startPreview();
    };

    proto.onClickInstallExtension = function (event) {
        window.open(this.screenShareExtensionUrl, '_blank');
    };

    // either resolution or framerate was changed
    proto.onChangeVideoSettings = function () {
        if (this.streamInUse) {
            this.messageBox('Stream is in use, not allowed!');
            return;
        }
        var el = __getElement(UI_CONSTANTS.buttonPreview);
        if (__contains(el.textContent, '*top*')) {
            this.startPreview("local");
        }
    };

    proto.onChangeVideoBitrate = function (event) {
        this.checkBitrates();
    };

    proto.onChangeAudioBitrate = function () {

    };

    proto.onChangeWebRTCVideoBitrate = function (event) {
        var index = __getElement(UI_CONSTANTS.comboboxWebRTCVideoBitrates).selectedIndex;
        var rtcVideoBitrate = parseInt(__getElement(UI_CONSTANTS.comboboxWebRTCVideoBitrates).options[index].value, 10) / 1000; // webrtc needs kbps
        Config.webrtc.videosendbitrate = rtcVideoBitrate;         // max bitrate
        this.setOptionalConfig();
        this.checkBitrates();
    };

    proto.onClickHangUpCall = function (event) {
        __print("hanging up: " + event.currentTarget.dataset.remoteuserid);
        this.rtcuser.hangUpCall(event.currentTarget.dataset.remoteuserid);
        this.removeRemoteGui(event.currentTarget.dataset.remoteuserid);
    };

    //////////////////////////////////////////////////////////
    // GUI-HELPERS
    //////////////////////////////////////////////////////////

    // hides local-video element & mute audio/video buttons
    proto.hideVideoControls = function() {
        var el = __getElement(UI_CONSTANTS.buttonPreview);
            el.textContent = 'start preview';
            el = __getElement(UI_CONSTANTS.buttonStartBroadcast);
            el.disabled = true;
            __getElement('video-local').parentNode.style.display = 'none';
            __getElement('buttonToggleVideo').style.display = 'none';
            __getElement('buttonToggleAudio').style.display = 'none';
    };

    // show start broadcast or stop broadcast buttons
    proto.toggleBroadcastButtons = function (showStartBroadcast) {
        __getElement(UI_CONSTANTS.buttonStartBroadcast).disabled = !showStartBroadcast;
        __getElement(UI_CONSTANTS.buttonStopBroadcast).disabled = showStartBroadcast;
        __getElement(UI_CONSTANTS.buttonStartStopBroadcast).innerHTML = showStartBroadcast ? 'start broadcast': 'stop broadcast';
        this.show(UI_CONSTANTS.broadcastStatus, showStartBroadcast ? "stopped." : "connecting...");
    };

    // either shows or hides the room list
    proto.toggleChatInterface = function (isRoomEntered) {
        __getElement(UI_CONSTANTS.buttonEnter).disabled = isRoomEntered;
        __getElement(UI_CONSTANTS.buttonLeave).disabled = !isRoomEntered;
        __getElement(UI_CONSTANTS.roomMembers).style.display = isRoomEntered ? 'block' : 'none';
        __getElement(UI_CONSTANTS.chatSettings).childNodes[3].style.display = isRoomEntered ? "none" : 'block';
    };

    proto.getGuiEntries = function () {
        var self = this;
        var elRes = __getElement(UI_CONSTANTS.comboBoxResolutions);
        var elFr = __getElement(UI_CONSTANTS.comboBoxFramerates);
        var resVal = elRes.options[elRes.selectedIndex].value;
        var resArr = resVal.split('x');
        var width = parseInt(resArr[0],10);
        var height = parseInt(resArr[1],10);
        var frVal = elFr.options[elFr.selectedIndex].value;
        var fr = parseInt(frVal,10);

        var el = __getElement(UI_CONSTANTS.comboBoxVideoSources);
        var selectedVideoDevice = el.options[el.selectedIndex].value;
        selectedVideoDevice = (isNaN(selectedVideoDevice)) ? (selectedVideoDevice === 'true') ? true : false : parseInt(selectedVideoDevice,10);
        el = __getElement(UI_CONSTANTS.comboBoxAudioSources);
        var selectedAudioDevice = el.options[el.selectedIndex].value;
        selectedAudioDevice = (isNaN(selectedAudioDevice)) ? (selectedAudioDevice === 'true') ? true : false : parseInt(selectedAudioDevice,10);

        el = __getElement(UI_CONSTANTS.comboBoxVideoBitrates);
        var vBitrate = parseInt(el.options[el.selectedIndex].value,10);
        el = __getElement(UI_CONSTANTS.comboBoxAudioBitrates);
        var aBitrate = parseInt(el.options[el.selectedIndex].value,10);

        var videoDeviceId = selectedVideoDevice;

        // 
        if(__getElement(UI_CONSTANTS.buttonSourceScreen).className.indexOf('active') !== -1) {
            videoDeviceId = this.videoDeviceList.findIndex(function(element) {
                return element.id.indexOf(self.screenShareExtensionName) !== -1;
            });
        }

        return {
            width: width,
            height: height,
            framerate: fr,
            videoDevice: videoDeviceId,
            audioDevice: selectedAudioDevice,
            videoBitrate: vBitrate,
            audioBitrate: aBitrate
        };
    };

    // check bitrate settings for consistency and show inconsistencies in ui
    // eg warn if webrtc bitrate < rtmp bitrate
    proto.checkBitrates = function () {
        var index = __getElement(UI_CONSTANTS.comboboxWebRTCVideoBitrates).selectedIndex;
        var el = __getElement(UI_CONSTANTS.comboBoxVideoBitrates);
        if(this.transcodingEnabled) {      
            var rtcVideoBitrate = parseInt(__getElement(UI_CONSTANTS.comboboxWebRTCVideoBitrates).options[index].value, 10) / 1000; // webrtc needs kbps
            var rtmpVideoBitrate = parseInt(el.options[el.selectedIndex].value) / 1000;

            if(rtcVideoBitrate < rtmpVideoBitrate) {
                this.popover(UI_CONSTANTS.comboboxWebRTCVideoBitrates, 
                            "For higher broadcast quality, WebRTC bitrate should not be lower than RTMP (live stream) bitrate!", 
                            "Tip", 
                            5000
                );
            }
        } else {
            el.selectedIndex = index; // set rtmp bitrate to webrtc bitrate in ui

        }
    };

    proto.clearRemotePeerList = function () {
        var list = document.getElementById(UI_CONSTANTS.listRoomMembers);
        if (list) {
            list.innerHTML = '';
        }
    };

    // append devices names to the regarding html select-element
    proto.fillDevices = function (elementId, devices) {

        var elemOptions = __getElement(elementId).options;
        var isVideoComboBox = elementId === UI_CONSTANTS.comboBoxVideoSources;
       
        // basic combobox setup
        elemOptions.length = 0;
        elemOptions[0] = new Option(isVideoComboBox ? 'No Video' : 'No Audio', false);
        elemOptions[1] = new Option('Auto', true);

        // add all real devices
        var device;
        for (var key in devices) {
            device = devices[key];
            if (device.id.indexOf(this.screenShareExtensionName) !== -1) // ignore screencapture in dropdown menu
                continue;

            elemOptions[elemOptions.length] = new Option(device.id, device.index);
            __debug((isVideoComboBox ? 'VideoInput' : 'AudioInput') + ": " + device.id);
        }

        // find element to be pre selected
        var found = false;
        var deviceId = isVideoComboBox ? Config.media.videosource : Config.media.audiosource;
        for (var i = 0, len = elemOptions.length; i < len; i++) {
            if (elemOptions[i].value === deviceId.toString()) {
                elemOptions[i].selected = "1";
                found = true;
                break;
            }
        }
        // default pre select if possible
        if (!found && (elemOptions.length > 1)) {
            elemOptions[1].selected = "1";
        }
    };

    // Adds array of values (optionsArray) to a "select" element with id elementId
    // defaultSelected - default selection
    // type (optional), values: "bitrate"
    proto.createOptions = function (elementId, optionsArray, defaultSelected, type) {
        var option, el = __getElement(elementId);
        el.options.length = 0; // reset
        // fill options
        for(option in optionsArray) {
            var value = optionsArray[option];
            var text = value;
            if(type === "bitrate") {
                text = value < 1000 ? value + ' Kbps' : (Math.round((value / 1000) * 10) / 10) + ' Mbps';
                value = optionsArray[option] * 1000;
            }
            el.options.add(new Option(text, value));
            if(defaultSelected === value) {
                el.options[el.options.length-1].selected = "1";
            }
            __debug(elementId + " - adding option: " + optionsArray[option]);
        }
        // fallback, select default value
        if(el.options[el.options.selectedIndex].value === '') {
            el.options[1].selected = "1";
        }
    };

    // create a new element for an active call
    proto.createRemoteGui = function (remoteUserName, remoteUserId) {
        if (!document.getElementById("remote-gui-" + remoteUserId)) {
            var container = document.createElement('div');
            container.setAttribute("id", "remote-gui-" + remoteUserId);
            container.className = "remote-element-entry panel panel-primary text-center";
            var parentContainer = document.createElement('div');
            parentContainer.className = 'media-content col-md-6';

            var panelTitle = document.createElement('div');
            panelTitle.className = "panel-heading";
            var h3Title = document.createElement('h3');
            h3Title.className = "panel-title navbar-btn";
            h3Title.innerHTML = "User: " + remoteUserName;
            h3Title.addEventListener('click', this.onClickPanelTitle.bind(this));
            panelTitle.appendChild(h3Title);
            var panelBody = document.createElement('div');
            panelBody.className = "panel-body";
            var panelFooter = document.createElement('div');
            panelFooter.className = "panel-footer";

            container.appendChild(panelTitle);
            container.appendChild(panelBody);
            container.appendChild(panelFooter);
            parentContainer.appendChild(container);

            var mediaContent = __getElement(UI_CONSTANTS.mediaContentContainer);
            mediaContent.appendChild(parentContainer);

            //mediaContentContainer
        }
    };

    proto.createRemoteMedia = function (remoteUserName, remoteUserId, type) {
        var container = document.getElementById("remote-gui-" + remoteUserId);
        var panelBody = container.childNodes[1];
        var element = document.createElement(type);
        element.setAttribute("id", "remote-" + type + "-" + remoteUserId);
        element.setAttribute('data-remoteusername', remoteUserName);
        element.setAttribute('data-remoteuserid', remoteUserId);
        element.setAttribute('data-touched', 'false');
        element.style.width = "100%";
        element.style.height = "100%";
        element.autoplay = true;
        element.setAttribute('playsinline', '');
        element.className = "remote-element-" + type;
        element.addEventListener('loadedmetadata', this.onReceivedMetaData.bind(this));
        element.addEventListener('click', function (e) {
            try {
                var elem = e.currentTarget;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
            } catch (err) {}
        });
        element.addEventListener('touchstart', function (e) {
            var elem = e.currentTarget;
            if (elem.dataset.touched === 'false') {
                elem.dataset.touched = 'true';
                setTimeout(function () { 
                    elem.dataset.touched = 'false'; 
                }, 300);
                return false;
            }
            e.preventDefault();
            try {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                }
            } catch (err) { }
        });
        panelBody.appendChild(element);
    };

    proto.removeRemoteGui = function (remoteUserId) {
        var el = __getElement("remote-gui-" + remoteUserId);
        if (el.parentNode) {
            var parent = el.parentNode;
            parent.parentNode && parent.parentNode.removeChild(parent);
            this.removeStatistics(remoteUserId);
        }
    };

    proto.clearRemoteGuis = function () {
        var elements = document.getElementsByClassName("remote-element-entry");
        while (elements.length > 0) {
            var el = elements[elements.length - 1];
            el.parentNode && el.parentNode.removeChild(el);
        }
    };

    proto.createRemoteHangUpCall = function (remoteUserName, remoteUserId) {
        var btnHangUpCall = document.createElement('button');
        btnHangUpCall.innerHTML = "stop call (" + remoteUserName + ")";
        btnHangUpCall.setAttribute('data-remoteuserid', remoteUserId);
        btnHangUpCall.setAttribute('id', 'btn-hang-up-call-' + remoteUserId);
        btnHangUpCall.className = "btn btn-primary";
        btnHangUpCall.addEventListener("click", this.onClickHangUpCall.bind(this));

        var container = document.getElementById("remote-gui-" + remoteUserId);
        var panelfooter = container.childNodes[2];
        var p = document.createElement('p');
        p.appendChild(btnHangUpCall);
        panelfooter.appendChild(p);
    };

    proto.createStatistics = function (remoteUserName, remoteUserId) {
        var el = document.getElementById("remote-gui-" + remoteUserId);
        if (el) {
            var panelfooter = el.childNodes[2];
            var p = document.createElement('p');
            p.setAttribute('data-remoteuserid', remoteUserId);
            p.setAttribute('id', 'user-statistics-entry-' + remoteUserId);
            panelfooter.appendChild(p);
        }
    };

    proto.removeStatistics = function (remoteUserId) {
        var el = document.getElementById("user-statistics-entry-" + remoteUserId);
        if (el) {
            var list = el.parentNode;
            if (list) {
                list.removeChild(el);
                list.parentNode.style.display = list.childNodes.length > 0 ? 'block' : 'none';
            }
        }
    };

    // show messages

    // updateSpanText
    // updates a span with text
    // used by showWebRTCStats for every user
    proto.updateSpanText = function(el, element, text, display) {
        try {
            var span = document.getElementById(element);
            if (!span) {
                span = document.createElement('span');
                span.setAttribute('id', element);
                if(!display) {
                    display = 'inline-block';
                }
                span.style.fontSize = 'x-small';    
                el.appendChild(span);
            }
            span.innerHTML = text + "&nbsp;";
        } catch(e) {
            console.log(e);
        }
    };
    
    // createLabel
    // updates a label with text
    // used by showWebRTCStats for broadcast info
    proto.createLabel = function(el, text) {
        var label = document.createElement('label');
        label.style.fontSize = 'small';
        label.appendChild(document.createTextNode(text)); 
        el.appendChild(label);
        el.appendChild(document.createElement('br'));            
    };
    
    // show text in a dom element
    proto.show = function(domElement, text, display) {
        __print(domElement + ": " + text);
        var el = __getElement(domElement);
        el.innerHTML = text;
        if(!display) {
            display = 'inline-block';
        }
        el.style.display = display;
    };

    proto.messageBoxClose = function() {
        document.getElementById('message-box').style.display = 'none';
    };

    proto.messageBox = function (message, isAlert, timeout) {
        var self = this;
        __warning(message);
        var mb = document.getElementById('message-box');
        var ph = mb.childNodes[1];
        ph.childNodes[0].textContent = !!isAlert ? 'Error' : 'Message';
        var pb = mb.childNodes[3];
        !!isAlert ? pb.style.color = 'red' : 'black';
        var span = pb.childNodes[1];
        span.innerHTML = message;
        document.getElementById('btn-x').addEventListener('click', self.messageBoxClose);
        document.getElementById('btn-ok').addEventListener('click', self.messageBoxClose);
        mb.style.display = 'block';
        if(timeout) {
             window.setTimeout(function() {
                self.messageBoxClose(); 
             }, timeout);
        }
    };

    /* creates a popover at elementId's location */
    proto.popover = function (elementId, message, title, timeout) {
         $('#' + elementId).popover({
            placement: "right",
            html: true,
            content: message,
            title: title,
            trigger: 'manual'
        }).popover('show');

        setTimeout(function() {
            $('#' + elementId).popover('destroy');
        }, timeout);
    };
       
    return AppController;
})();
