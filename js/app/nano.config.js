// nano.config.js
// defines NANOCONFIG parameters, bitrate, url, etc.
// (c) 2016-2018 nanocosmos gmbh
// version 1.2

/*jslint nomen: true, maxerr:1000, white:true, vars:true, undef:true, sub:true*/
/*global console, confirm, unescape, Bintu*/

(function () {
    'use strict';

    // ----- custom config defaults

    var NANOCONFIG_DEFAULTS = {};
    
    // NOTE: You may want to change these settings for your setup
    
    // WebRTC Server Hostname
    var webrtc_hostname = "rtc-lb.nanocosmos.de";
    
    // WebRTC Server API URL
    NANOCONFIG_DEFAULTS.webrtc_server = "https://" + webrtc_hostname + "/p/webrtc";
    
    // WebRTC Server STUN/TURN/ICE Server
    NANOCONFIG_DEFAULTS.webrtc_iceservers = '[{"urls":["stun:stun.l.google.com:19302"]},{"urls":["stun:stun.nanocosmos.net:80","turn:turn.nanocosmos.net:80?transport=tcp","turn:turn.nanocosmos.net:80?transport=udp"],"username":"nano","credential":"nano"}]';
    
    // H5Live Player URL
    NANOCONFIG_DEFAULTS.h5live_url = "http://demo.nanocosmos.de/nanoplayer/release/nanoplayer.html";

    // bintu API URL (optional for nanoStream Cloud)
    NANOCONFIG_DEFAULTS.bintu_apiurl = "https://bintu.nanocosmos.de";

    // callstats
    NANOCONFIG_DEFAULTS.callstats_appsecret = "ZAlfHj1CvSpCN9GRr7oei20h+253aheo2wK9yiyUZ1A=";
    NANOCONFIG_DEFAULTS.callstats_appid = "318889712"; // nanostream-webrtc


    // -----
    
    var exports = this;

    function NANOCONFIG() {

        console.log("loading NANOCONFIG...");

        // HTTP Params / Query String
        var _HTTPParams;
        var _getHTTPParam = function (paramKey) {
            // if params dont exist, create/read them
            if (!_HTTPParams) {
                try {
                    var url = document.location.search;
                    url.replace(
                        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                        function ($0, $1, $2, $3) {
                            _HTTPParams = _HTTPParams || {};
                            _HTTPParams[unescape($1)] = unescape($3);
                        }
                    );
                } catch (e) {
                    console.log(e);
                }
            }
            // return requested param, if exists
            try {
                var p = _HTTPParams[paramKey];
                if (p) {
                    console.log("Param[" + paramKey + "]: " + p);
                }
                return p;
            } catch (e) {
                return undefined;
            }
        };

        // parse complete json string
        var _getJsonParam = function (p) {
            var r = {};
            try {
                var rr = _getHTTPParam(p);
                if (!rr) {
                    return undefined;
                }
                r = JSON.parse(rr);
            } catch (e) {
                return undefined;
            }
            return r;
        };

        // the config object
        var NANOCONFIG = {
            config: {}, // general config
            bintu: {},  // bintu api settings
            debug: {},  // debug mode
            media: {},  // media (input/output) settings
            stream: {}, // stream settings
            webrtc: {}, // webrtc specific settings
            callstats: {}, // callstats,
            sdppatches: {} // low level tweaks
        };

        // general config
        NANOCONFIG.config = {
            // use geo location
            //useLocation: false 
            useLocation: false,
            showOldFlashPlayer: false
        };
        
        // bintu config
        NANOCONFIG.bintu = {
            apikey: "", // bintu apikey
            apiurl: NANOCONFIG_DEFAULTS.bintu_apiurl,
            streamid: "", // bintu streamid
            tags: "" // bintu tags for the stream
        };

        // debug config
        NANOCONFIG.debug = NANOCONFIG.debug || _getHTTPParam('debug');

        // media (input settings)
        NANOCONFIG.media = {
            videosource: 0, // input videosource index (special for webrtc use 'screen' for 'nanoScreenCapture')
            width: 640, // input width
            height: 480, // input height
            minframerate: 3,
            framerate: 30, // input framerate
            audiosource: 0, // input audiosource index
            samplerate: 44100 // input samplerate
        };

        // stream config (output settings)
        NANOCONFIG.stream = {
            url: "",    // stream url without streamname
            name: "",   // stream name
            id: "",     // complete stream url (optional to url/name)        
            width: null, // resize width
            height: null, // resize height
            videobitrate: 500000, // output videobitrate
            audiobitrate: 64000,  // input audiobitrate
            framerate: 30
        };

        // webrtc specific values
        NANOCONFIG.webrtc = {
            server: NANOCONFIG_DEFAULTS.webrtc_server, // webrtc api server
            serverusername: "", // webrtc server username credential
            serverpassword: "", // webrtc server password credential
            token: undefined, // webrtc security token
            username: "", // webrtc username
            room: "", // webrtc room
            iceservers: NANOCONFIG_DEFAULTS.webrtc_iceservers, // webrtc iceserver config
            videocodec: "H264", // webrtc videocodec
            videosendinitialbitrate: 0, // webrtc videosendinitialbitrate (min bitrate)
            videosendbitrate: 0, // webrtc videosendbitrate (max bitrate)
            audiosendinitialbitrate: 0, // webrtc audioinitialbitrate (min bitrate)      
            audiosendbitrate: 0, // webrtc audiobitrate (max bitrate)
            dropframes: 1, // webrtc dropframes mode
            icecastaudio: 0, // webrtc enable icecast audio
            h264passthrough: 1,  // moved from experimental
            enablestats: 1
        };

        NANOCONFIG.sdppatches = { // low level tweaks
            preventreplacesendreceive: 0 
        };

        NANOCONFIG.h5live = {           
            url: NANOCONFIG_DEFAULTS.h5live_url
        };

        NANOCONFIG.callstats = {
            appsecret: NANOCONFIG_DEFAULTS.callstats_appsecret,
            appid: NANOCONFIG_DEFAULTS.callstats_appid
        };

        // get url parameters
        // TEST:
        // chat.html?webrtc.room=nano1&webrtc.serverusername=nano&webrtc.serverpassword=nano&webrtc.username=ol&bintu={"apikey":"xyz","tags":"123,456"}&webrtc.iceservers={"url":"turn:turn1.nanocosmos.de:443%3Ftransport%3Dtcp","credential":"nano","username":"nano"}
        var getUrlParams = function() {
            var k, v, key;
            for (key in NANOCONFIG) {
                try {
                    // json strings?
                    // e.g. http://url?bintu={"apikey":"xyz","tags":"tag1,tag2"}
                    var obj = _getJsonParam(key);
                    if (obj) {
                        NANOCONFIG[key] = obj;
                        console.log("NANOCONFIG[" + key + "]=" + JSON.stringify(obj));
                    } else {
                        // key/value strings?
                        for (k in NANOCONFIG[key]) {

                            // without prefix: e.g http://url?apikey=xyz
                            //var v = _getHTTPParam(k);

                            // with prefix: e.g http://url?bintu.apikey=xyz
                            v = _getHTTPParam(key + "." + k);

                            if (v) {
                                NANOCONFIG[key][k] = v;
                                console.log("NANOCONFIG[" + key + "][" + k + "]=" + v);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        };
        
        // call the function:
        getUrlParams();

        function isFloat(val) {
            var floatRegex = /^-?\d+(?:[.]\d*?)?$/;
            if (!floatRegex.test(val)) {
                return false;
            }

            val = parseFloat(val);
            if (isNaN(val)) {
                return false;
            }
            return true;
        }

        function isInt(val) {
            var intRegex = /^-?\d+$/;
            if (!intRegex.test(val)) {
                return false;
            }

            var intVal = parseInt(val, 10);
            return parseFloat(val) === intVal && !isNaN(intVal);
        }

        function parseNumber(string) {
            var number;
            try {
                if (isFloat(string)) {
                    number = parseFloat(string);
                }
                else if (isInt(string)) {
                    number = parseInt(string, 10);
                }
                else {
                    number = string;
                }
            } catch (e) {
                console.log(e);
                number = string;
            }
            return number;
        }

        var parseConfig = function() {
            var k, key;
            for (key in NANOCONFIG) {
                try {
                    if ((typeof NANOCONFIG[key] === 'string' || NANOCONFIG[key] instanceof String)) {
                        if (!isNaN(NANOCONFIG[key])) {
                            NANOCONFIG[key] = parseNumber(NANOCONFIG[key]);
                        }
                        if (NANOCONFIG[key] === 'true') {
                            NANOCONFIG[key] = true;
                        }
                        if (NANOCONFIG[key] === 'false') {
                            NANOCONFIG[key] = false;
                        }
                    } else if (typeof NANOCONFIG[key] === 'object' || NANOCONFIG[key] instanceof Object) {
                        for (k in NANOCONFIG[key]) {
                            if ((typeof NANOCONFIG[key][k] === 'string' || NANOCONFIG[key][k] instanceof String) && !isNaN(NANOCONFIG[key][k])) {
                                NANOCONFIG[key][k] = parseNumber(NANOCONFIG[key][k]);
                            }
                            if (NANOCONFIG[key][k] === 'true') {
                                NANOCONFIG[key][k] = true;
                            }
                            if (NANOCONFIG[key][k] === 'false') {
                                NANOCONFIG[key][k] = false;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        };
        
        parseConfig();
        
        return NANOCONFIG;
    }

    exports.NANOCONFIG = new NANOCONFIG();

}).call(this);

