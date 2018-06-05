## Classes

<dl>
<dt><a href="#Bintu">Bintu</a></dt>
<dd><p>Bintu Streaming API Class Version 0.4.</p>
</dd>
<dt><a href="#BintuStreamFilter">BintuStreamFilter</a></dt>
<dd><p>Bintu Stream Filter Class Version 0.4 for Bintu Streaming API Class.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#successCallback">successCallback</a> : <code>function</code></dt>
<dd><p>The callback for a successful Bintu call</p>
</dd>
<dt><a href="#errorCallback">errorCallback</a> : <code>function</code></dt>
<dd><p>The callback for a failed Bintu call</p>
</dd>
<dt><a href="#stream">stream</a> : <code>object</code></dt>
<dd><p>A Bintu stream object returned in the response from a successful &#39;Bintu.createStream&#39;, &#39;Bintu.getStream&#39; or &#39;Bintu.tagStream&#39; request as JSON formatted string.</p>
</dd>
<dt><a href="#streams">streams</a> : <code><a href="#stream">Array.&lt;stream&gt;</a></code></dt>
<dd><p>An array of Bintu <a href="#stream">stream</a> objects returned in the response from a successful &#39;Bintu.getStreams&#39; request as JSON formatted string.</p>
</dd>
</dl>

<a name="Bintu"></a>

## Bintu
Bintu Streaming API Class Version 0.4.

**Kind**: global class  

* [Bintu](#Bintu)
    * [new Bintu(apiKey, apiUrl)](#new_Bintu_new)
    * [.apiKey](#Bintu+apiKey) : <code>string</code>
    * [.apiUrl](#Bintu+apiUrl) : <code>string</code>
    * [.validateApiKey([success], [error])](#Bintu+validateApiKey)
    * [.createStream([tags], [success], [error])](#Bintu+createStream)
    * [.getStream(streamId, [success], [error])](#Bintu+getStream)
    * [.getStreams([filter], [success], [error])](#Bintu+getStreams)
    * [.tagStream(streamId, tags, [success], [error])](#Bintu+tagStream)

<a name="new_Bintu_new"></a>

### new Bintu(apiKey, apiUrl)
Bintu Streaming API.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>apiKey</td><td><code>string</code></td><td><p>The apikey to use with Bintu API.</p>
</td>
    </tr><tr>
    <td>apiUrl</td><td><code>string</code></td><td><p>The base url to the Bintu API.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
Javascript
var apiKey = 'dfg5490htk64jzep0zhdhdthjkhp69zuk';
var apiUrl = 'https://bintu.nanocosmos.de';
var bintu = new Bintu(apiKey, apiUrl);
```
<a name="Bintu+apiKey"></a>

### bintu.apiKey : <code>string</code>
The apikey to use with Bintu API.

**Kind**: instance property of [<code>Bintu</code>](#Bintu)  
**Example**  
```js
// bintu instance of Bintu class
bintu.apiKey = 'sdfg896wgp8j28guq3tkmöoakjfaest0kj89';
console.log(bintu.apiKey);
```
<a name="Bintu+apiUrl"></a>

### bintu.apiUrl : <code>string</code>
The base url to the Bintu API.

**Kind**: instance property of [<code>Bintu</code>](#Bintu)  
**Example**  
```js
// bintu instance of Bintu class
bintu.apiUrl = 'https://bintu2.nanocosmos.de';
console.log(bintu.apiUrl);
```
<a name="Bintu+validateApiKey"></a>

### bintu.validateApiKey([success], [error])
Check if the apikey is valid.

**Kind**: instance method of [<code>Bintu</code>](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[success]</td><td><code><a href="#successCallback">successCallback</a></code></td><td><p>The success callback with the request passed.</p>
</td>
    </tr><tr>
    <td>[error]</td><td><code><a href="#errorCallback">errorCallback</a></code></td><td><p>The error callback with the request passed.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// bintu instance of Bintu class
bintu.validateApiKey(
    function success(request) {
         try {
             var response = jSON.parse(request.responseText);
             var key = request.responseText.key;
             var created_at = request.responseText.created_at;
             console.log('success validateApiKey - key: ' + key + ', created at: ' + created_at);
         } catch (err) {
             console.error('error validateApiKey - request success but no valid json response');
         }
     },
     function error(e) {
         var error = (typeof e.error !== 'undefined')
             ? (e.request.responseText.length > 0)
             ? e.error + ': ' + e.request.responseText : (e.request.status === 0)
             ? e.error + ': server or network down' : e.error + ': ' + e.request.status
             : 'error ' + e.request.status;
         error = 'error validateApiKey - ' + error;
         console.error(error);
         try {
             if (e.request.responseText.length > 0) {
                 error = (typeof e.error !== 'undefined') ? e.error : '';
                 var response = JSON.parse(e.request.responseText);
                 var message = 'error while try to validate bintu apikey (' + error + ')';
                 message += (response.error && response.error.code)
                     ? ' code=' + response.error.code : '';
                 message += (response.error && response.error.message)
                     ? ': ' + response.error.message : '';
                 message += (response.error && response.error.userinfo
                     && response.error.userinfo.apikey) ? ' (' + response.error.userinfo.apikey + ')' : '';
                 alert(message);
             } else {
                 alert(error);
             }
         } catch (ex) {
             error = 'error: ' + ex.message + ', validateApikey response: ' + e.request.responseText;
             alert(error);
         }
     });
```
<a name="Bintu+createStream"></a>

### bintu.createStream([tags], [success], [error])
Creates a new Bintu stream.

**Kind**: instance method of [<code>Bintu</code>](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[tags]</td><td><code>Array.&lt;string&gt;</code></td><td><p>The array of tags as strings.</p>
</td>
    </tr><tr>
    <td>[success]</td><td><code><a href="#successCallback">successCallback</a></code></td><td><p>The success callback with the request passed.</p>
</td>
    </tr><tr>
    <td>[error]</td><td><code><a href="#errorCallback">errorCallback</a></code></td><td><p>The error callback with the request passed.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// bintu instance of Bintu class
var tags = ['myTag', 'title:This is a title', 'doc'];
bintu.createStream(tags,
    function success(request) {
        try {
            var response = JSON.parse(request.responseText);
            var id = response.id;
            console.log('success - new stream created with id:' + id);
            var state = response.state;
            var ingest = response.ingest;
            var rtmp = ingest.rtmp;
            var url = rtmp.url;
            var streamname = rtmp.streamname;
            console.log('created with state: ' + state);
            console.log('rtmp ingest: ' + url + "/" + streamname);
        } catch (err) {
            console.error(err);
        }
    }, function error(e) {
        var error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
        console.error(error);
        try {
            error = (typeof e.error !== 'undefined') ? e.error : '';
            var response = JSON.parse(e.request.responseText);
            alert('error while creating new bintu stream (' + error + '): status=' + response.status + ', message=' + response.message, 1);
        } catch (ex) {
            error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
            alert(error);
        }
    });
```
<a name="Bintu+getStream"></a>

### bintu.getStream(streamId, [success], [error])
Returns a Bintu stream specified by a stream id.

**Kind**: instance method of [<code>Bintu</code>](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>streamId</td><td><code>string</code></td><td><p>The streamId of the Bintu Stream.</p>
</td>
    </tr><tr>
    <td>[success]</td><td><code><a href="#successCallback">successCallback</a></code></td><td><p>The success callback with the request passed.</p>
</td>
    </tr><tr>
    <td>[error]</td><td><code><a href="#errorCallback">errorCallback</a></code></td><td><p>The error callback with the request passed.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// bintu instance of Bintu class
var streamId = 'regwerghsthe6uwj57ikek6ugjghjf';
bintu.getStream(streamId,
    function success(request) {
        try {
            var response = JSON.parse(request.responseText);
            var id = response.id;
            console.log('success - get stream with id: ' + id);
            var state = response.state;
            var ingest = response.ingest;
            var rtmp = ingest.rtmp;
            var url = rtmp.url;
            var streamname = rtmp.streamname;
            console.log('state: ' + state);
            console.log('rtmp ingest: ' + url + "/" + streamname);
        } catch (err) {
            console.error(err);
        }
    }, function error(e) {
        var error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
        console.error(error);
        try {
            error = (typeof e.error !== 'undefined') ? e.error : '';
            var response = JSON.parse(e.request.responseText);
            alert('error while getting bintu stream (' + error + '): status=' + response.status + ', message=' + response.message, 1);
        } catch (ex) {
            error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
            alert(error);
        }
    });
```
<a name="Bintu+getStreams"></a>

### bintu.getStreams([filter], [success], [error])
Returns one or many Bintu streams optional filtered by related tags and/or state.

**Kind**: instance method of [<code>Bintu</code>](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[filter]</td><td><code><a href="#BintuStreamFilter">BintuStreamFilter</a></code></td><td><p>The filter for the search.</p>
</td>
    </tr><tr>
    <td>[success]</td><td><code><a href="#successCallback">successCallback</a></code></td><td><p>The success callback with the request passed.</p>
</td>
    </tr><tr>
    <td>[error]</td><td><code><a href="#errorCallback">errorCallback</a></code></td><td><p>The error callback with the request passed.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// bintu instance of Bintu class
var streamFilter = new BintuStreamFilter();
var state = BintuStreamFilter.STATE.LIVE;
var tags = ['myTag', 'doc'];
streamFilter.setState(state);
streamFilter.addTags(tags);
streamFilter.addTag('title:This is a title');
bintu.getStreams(streamFilter,
    function success(request) {
        var response = request.responseText;
        try {
            response = JSON.parse(response);
            console.log('success - get streams');
        } catch (err) {
            response = [];
            console.error(err);
        }
        var i, len;
        for (i = 0, len = response.length; i < len; i += 1) {            
            var state = response[i].state;
            if (state === 'live' && document.getElementById('bintuPlay').style.display === 'none') {
                document.getElementById('bintuPlay').style.display = 'block';
            }
            var streamId = response[i].id;
            console.log('found stream with id: ' + streamId);
            var url = response[i].playout.rtmp[0].url + '/' + response[i].playout.rtmp[0].streamname;
            console.log('rtmp playout: ' + url);
            var tags = response[i].tags;
            var message = "";
            if (tags && tags.push) {
                var j, tLen;
                for (j = 0, tLen = tags.length; j < tLen; j += 1) {
                    if (j === 0)
                        message += 'tags: ';
                    message += tags[j];
                    if (j !== tLen - 1)
                        message += ',';
                }
            }
            console.log(message);
        }
        if (len === 0) {
            console.log('no stream found with the given search parameters');
        }
    },
    function error(e) {
        var error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
        console.error(error);
        try {
            error = (typeof e.error !== 'undefined') ? e.error : '';
            var response = JSON.parse(e.request.responseText);
            alert('error while getting bintu streams (' + error + '): status=' + response.status + ', message=' + response.message, 1);
        } catch (ex) {
            error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
            alert(error);
        }
    });
```
<a name="Bintu+tagStream"></a>

### bintu.tagStream(streamId, tags, [success], [error])
Tags an existing Bintu streams by overwriting.

**Kind**: instance method of [<code>Bintu</code>](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>streamId</td><td><code>string</code></td><td><p>The streamId of the Bintu Stream.</p>
</td>
    </tr><tr>
    <td>tags</td><td><code>Array.&lt;string&gt;</code></td><td><p>The tags as an array of string related to streams.</p>
</td>
    </tr><tr>
    <td>[success]</td><td><code><a href="#successCallback">successCallback</a></code></td><td><p>The success callback with the request passed.</p>
</td>
    </tr><tr>
    <td>[error]</td><td><code><a href="#errorCallback">errorCallback</a></code></td><td><p>The error callback with the request passed.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// bintu instance of Bintu class
var streamId = '23w45rt8t3wtgjpsp9054wawegf34590g4w';
var tags = ['newTag, test, webrtc'];
bintu.tagStream(streamId, tags,
    function success(request) {
        var response = request.responseText;
        try {
            response = JSON.parse(response);
            var id = response.id;
            console.log('success - tag stream with id: ' + id)
            var tags = response.tags;
            var message = "";
            if (tags && tags.push) {
                var j, tLen;
                for (j = 0, tLen = tags.length; j < tLen; j += 1) {
                    if (j === 0)
                        message += 'new tags: ';
                    message += tags[j];
                    if (j !== tLen - 1)
                        message += ',';
                }
            }
            console.log(message);
        } catch (err) {
            console.error(err);
        }
    },
    function error(e) {
        var error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
        console.error(error);
        try {
            error = (typeof e.error !== 'undefined') ? e.error : '';
            var response = JSON.parse(e.request.responseText);
            alert('error while tagging bintu streams (' + error + '): status=' + response.status + ', message=' + response.message, 1);
        } catch (ex) {
            error = (typeof e.error !== 'undefined') ? e.error + ': ' + e.request.responseText : 'error: ' + e.request.responseText;
            alert(error);
        }
    });
```
<a name="BintuStreamFilter"></a>

## BintuStreamFilter
Bintu Stream Filter Class Version 0.4 for Bintu Streaming API Class.

**Kind**: global class  

* [BintuStreamFilter](#BintuStreamFilter)
    * [new BintuStreamFilter()](#new_BintuStreamFilter_new)
    * _instance_
        * [.state](#BintuStreamFilter+state) : [<code>STATE</code>](#BintuStreamFilter.STATE)
        * [.tags](#BintuStreamFilter+tags) : <code>Array.&lt;string&gt;</code>
        * [.setState(state)](#BintuStreamFilter+setState) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
        * [.addTag(tag)](#BintuStreamFilter+addTag) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
        * [.addTags(tags)](#BintuStreamFilter+addTags) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
        * [.getQueryString()](#BintuStreamFilter+getQueryString) ⇒ <code>string</code>
    * _static_
        * [.STATE](#BintuStreamFilter.STATE)

<a name="new_BintuStreamFilter_new"></a>

### new BintuStreamFilter()
Bintu Stream Filter for Bintu Streaming API.

**Example**  
```js
var streamFilter = new BintuStreamFilter();
```
<a name="BintuStreamFilter+state"></a>

### bintuStreamFilter.state : [<code>STATE</code>](#BintuStreamFilter.STATE)
The state of the Bintu Streams to filter.

**Kind**: instance property of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Default**: <code>BintuStreamFilter.STATE.ALL</code>  
<a name="BintuStreamFilter+tags"></a>

### bintuStreamFilter.tags : <code>Array.&lt;string&gt;</code>
The array of tags of the Bintu Streams to filter.

**Kind**: instance property of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
<a name="BintuStreamFilter+setState"></a>

### bintuStreamFilter.setState(state) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
Sets the state for the filter.

**Kind**: instance method of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Returns**: [<code>BintuStreamFilter</code>](#BintuStreamFilter) - The instance of the BintuStreamFilter  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>state</td><td><code><a href="#BintuStreamFilter.STATE">STATE</a></code></td><td><p>The state of the Bintu Streams to filter.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// streamFilter instance of BintuStreamFilter
var state = BintuStreamFilter.STATE.LIVE;
streamFilter.setState(state);
```
<a name="BintuStreamFilter+addTag"></a>

### bintuStreamFilter.addTag(tag) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
Adds a tag to the filter.

**Kind**: instance method of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Returns**: [<code>BintuStreamFilter</code>](#BintuStreamFilter) - The instance of the BintuStreamFilter  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tag</td><td><code>string</code></td><td><p>The tag of the Bintu Streams to filter.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// streamFilter instance of BintuStreamFilter
var tag = 'myTag';
streamFilter.addTag(tag);
console.log(streamFilter.tags); // prints 'myTag'
streamFilter.addTag('otherTag');
console.log(streamFilter.tags); // prints 'myTag, otherTag'
streamFilter.addTag('myTag');
console.log(streamFilter.tags); // prints 'myTag, otherTag'
```
<a name="BintuStreamFilter+addTags"></a>

### bintuStreamFilter.addTags(tags) ⇒ [<code>BintuStreamFilter</code>](#BintuStreamFilter)
Adds tags to the filter.

**Kind**: instance method of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Returns**: [<code>BintuStreamFilter</code>](#BintuStreamFilter) - The instance of the BintuStreamFilter  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code>Array.&lt;string&gt;</code></td><td><p>The tags of the Bintu Streams to filter.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
// streamFilter instance of BintuStreamFilter
var tags = ['myTag', 'otherTag'];
streamFilter.addTags(tags);
console.log(streamFilter.tags); // prints 'myTag, otherTag'
tags = ['newTag', 'otherTag'];
streamFilter.addTags(tags);
console.log(streamFilter.tags); // prints 'myTag, newTag, otherTag'
```
<a name="BintuStreamFilter+getQueryString"></a>

### bintuStreamFilter.getQueryString() ⇒ <code>string</code>
Returns the query string for the search that can be added to the url of the GET request.

**Kind**: instance method of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Returns**: <code>string</code> - The query string  
**Example**  
```js
// streamFilter instance of BintuStreamFilter
streamFilter.addTags(['myTag', 'otherTag']);
streamFilter.addTag('newTag');
streamFilter.setState(BintuStreamFilter.STATE.LIVE);
var queryString = streamFilter.getQueryString();
console.log(queryString); // prints '?tags[]=myTag&tags[]=newTag&tags[]=otherTag&state=live'
```
<a name="BintuStreamFilter.STATE"></a>

### BintuStreamFilter.STATE
Bintu Stream States.

**Kind**: static property of [<code>BintuStreamFilter</code>](#BintuStreamFilter)  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>LIVE</td><td><code>string</code></td><td><p>This state represents the string &#39;live&#39;.</p>
</td>
    </tr><tr>
    <td>CREATED</td><td><code>string</code></td><td><p>This state represents the string &#39;created&#39;.</p>
</td>
    </tr><tr>
    <td>ENDED</td><td><code>string</code></td><td><p>This state represents the string &#39;ended&#39;.</p>
</td>
    </tr><tr>
    <td>ALL</td><td><code>null</code></td><td><p>This state represents the object null.</p>
</td>
    </tr>  </tbody>
</table>

<a name="successCallback"></a>

## successCallback : <code>function</code>
The callback for a successful Bintu call

**Kind**: global typedef  
**See**: [Bintu](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>request</td><td><code>XMLHttpRequest</code></td><td><p>The XMLHttpRequest with the response.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
function successCallback(request) {
    var response = request.responseText;
    try {
        response = JSON.parse(response);
        console.log(response);
    } catch (err) {
        console.error('error parsing json response: ' + err.message);
    }
}
```
<a name="errorCallback"></a>

## errorCallback : <code>function</code>
The callback for a failed Bintu call

**Kind**: global typedef  
**See**: [Bintu](#Bintu)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>error</td><td><code>object</code></td><td><p>The error object.</p>
</td>
    </tr><tr>
    <td>error.error</td><td><code>string</code></td><td><p>The error cause.</p>
</td>
    </tr><tr>
    <td>error.request</td><td><code>XMLHttpRequest</code></td><td><p>The XMLHttpRequest with the response.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
function errorCallback(error) {
    var errorCause = error.error;
    console.log('error: ' + errorCause);
    var response = error.request.responseText;
    try {
        response = JSON.parse(response);
        console.log(response);
    } catch (err) {
        console.error('error parsing json response: ' + err.message);
    }
}
```
<a name="stream"></a>

## stream : <code>object</code>
A Bintu stream object returned in the response from a successful 'Bintu.createStream', 'Bintu.getStream' or 'Bintu.tagStream' request as JSON formatted string.

**Kind**: global typedef  
**See**: [Bintu](#Bintu)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>The id of the stream.</p>
</td>
    </tr><tr>
    <td>state</td><td><code>string</code></td><td><p>The state of the stream.</p>
</td>
    </tr><tr>
    <td>type</td><td><code>string</code></td><td><p>The type of the stream.</p>
</td>
    </tr><tr>
    <td>created_at</td><td><code>string</code></td><td><p>The time of creation.</p>
</td>
    </tr><tr>
    <td>tags</td><td><code>Array.&lt;string&gt;</code></td><td><p>The related tags of the stream.</p>
</td>
    </tr><tr>
    <td>ingest</td><td><code>object</code></td><td><p>The ingest object.</p>
</td>
    </tr><tr>
    <td>ingest.rtmp</td><td><code>object</code></td><td><p>This rtmp object of the ingest object.</p>
</td>
    </tr><tr>
    <td>ingest.rtmp.url</td><td><code>string</code></td><td><p>The base rtmp ingest url.</p>
</td>
    </tr><tr>
    <td>ingest.rtmp.streamname</td><td><code>string</code></td><td><p>The name of the rtmp stream.</p>
</td>
    </tr><tr>
    <td>playout</td><td><code>object</code></td><td><p>The playout object.</p>
</td>
    </tr><tr>
    <td>playout.rtmp</td><td><code>object</code></td><td><p>This rtmp object of the playout object.</p>
</td>
    </tr><tr>
    <td>playout.rtmp.url</td><td><code>string</code></td><td><p>The base rtmp ingest url.</p>
</td>
    </tr><tr>
    <td>playout.rtmp.streamname</td><td><code>string</code></td><td><p>This state represents the object null.</p>
</td>
    </tr><tr>
    <td>playout.rtmp.type</td><td><code>string</code></td><td><p>The type of the rtmp playout.</p>
</td>
    </tr><tr>
    <td>playout.hls</td><td><code>object</code></td><td><p>This hls object of the playout object.</p>
</td>
    </tr><tr>
    <td>playout.hls.url</td><td><code>string</code></td><td><p>The url to the hls playout.</p>
</td>
    </tr><tr>
    <td>playout.hls.type</td><td><code>string</code></td><td><p>The type of the hls playout.</p>
</td>
    </tr><tr>
    <td>playout.web</td><td><code>object</code></td><td><p>This state represents the object null.</p>
</td>
    </tr><tr>
    <td>playout.web.url</td><td><code>string</code></td><td><p>The url to the web playout.</p>
</td>
    </tr><tr>
    <td>playout.web.type</td><td><code>string</code></td><td><p>The type of the web playout.</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
{  
   "id":"5f86a12f-3801-415a-b450-6b6a46842349",
   "state":"created",
   "type":"wowza",
   "created_at":"2016-04-25T11:51:05.200Z",
   "tags":[  
      "webrtc"
   ],
   "ingest":{  
      "rtmp":{  
         "url":"rtmp://bintu-stream.nanocosmos.de:80/live",
         "streamname":"hrzcqQ_58r"
      }
   },
   "playout":{  
      "rtmp":[  
         {  
            "url":"rtmp://cdn-live.nanocosmos.de:1935/71026777.rtmp",
            "streamname":"hrzcqQ_58r",
            "type":"live"
         }
      ],
      "hls":[  
         {  
            "url":"http://cdn-live.nanocosmos.de:80/71026777.http/hrzcqQ_58r/playlist.m3u8",
            "type":"live"
         }
      ],
      "web":[  
         {  
            "url":"https://bintu.nanocosmos.de:443/playout/5f86a12f-3801-415a-b450-6b6a46842349",
            "type":"live"
         }
      ]
   }
}
```
<a name="streams"></a>

## streams : [<code>Array.&lt;stream&gt;</code>](#stream)
An array of Bintu [stream](#stream) objects returned in the response from a successful 'Bintu.getStreams' request as JSON formatted string.

**Kind**: global typedef  
**See**: [Bintu](#Bintu)  
