Auto-Generated from JSDocs.
## Modules

<dl>
<dt><a href="#module_ScriptLoader/live">ScriptLoader/live</a></dt>
<dd><p>Loads page&#39;s necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.</p>
</dd>
<dt><a href="#module_ScriptLoader/">ScriptLoader/</a></dt>
<dd><p>Loads page&#39;s necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.</p>
</dd>
<dt><a href="#module_TraXServerModule">TraXServerModule</a></dt>
<dd><p>The Server side of TraX.</p>
</dd>
<dt><a href="#module_ScriptLoader/viewdata">ScriptLoader/viewdata</a></dt>
<dd><p>Loads page&#39;s necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Live">Live</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Sidebar">Sidebar</a></dt>
<dd></dd>
<dt><a href="#Units">Units</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Common">Common</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#TraX">TraX</a></dt>
<dd></dd>
<dt><a href="#Canvases">Canvases</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Video">Video</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#KeepAwake">KeepAwake</a></dt>
<dd></dd>
<dt><a href="#MyMap">MyMap</a> ⇐ <code><a href="#DataView">DataView</a></code></dt>
<dd></dd>
<dt><a href="#Import">Import</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Export">Export</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Panes">Panes</a></dt>
<dd></dd>
<dt><a href="#DataView">DataView</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
<dt><a href="#Video">Video</a> ⇐ <code><a href="#TraX">TraX</a></code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#Agrav">Agrav</a> : <code>number</code></dt>
<dd><p>Absolute acceleration due to gravity. (m/s)</p>
</dd>
<dt><a href="#maxGapInSession">maxGapInSession</a> : <code>number</code></dt>
<dd><p>Milliseconds between timestamps to assume isMultiSession.</p>
</dd>
<dt><a href="#minLapTime">minLapTime</a> : <code>number</code></dt>
<dd><p>Minimum milliseconds a lap is allowed to be.</p>
</dd>
<dt><a href="#noStatus">noStatus</a> : <code>number</code></dt>
<dd><p>No relationship</p>
</dd>
<dt><a href="#oneRequestStatus">oneRequestStatus</a> : <code>number</code></dt>
<dd><p>User 1 requested to be friends.</p>
</dd>
<dt><a href="#twoRequestStatus">twoRequestStatus</a> : <code>number</code></dt>
<dd><p>User 2 requested to be friends.</p>
</dd>
<dt><a href="#friendStatus">friendStatus</a> : <code>number</code></dt>
<dd><p>Users are friends.</p>
</dd>
<dt><a href="#oneBlockedStatus">oneBlockedStatus</a> : <code>number</code></dt>
<dd><p>User 1 blocked user 2.</p>
</dd>
<dt><a href="#twoBlockedStatus">twoBlockedStatus</a> : <code>number</code></dt>
<dd><p>User 2 blocked user 1.</p>
</dd>
<dt><a href="#bothBlockedStatus">bothBlockedStatus</a> : <code>number</code></dt>
<dd><p>Both users blocked eachother.</p>
</dd>
<dt><a href="#onePullRequestCrew">onePullRequestCrew</a> : <code>number</code></dt>
<dd><p>User 1 requested User 2 to be crew for 1.</p>
</dd>
<dt><a href="#onePushRequestCrew">onePushRequestCrew</a> : <code>number</code></dt>
<dd><p>User 1 requested to be crew for 2.</p>
</dd>
<dt><a href="#twoPushRequestCrew">twoPushRequestCrew</a> : <code>number</code></dt>
<dd><p>user 2 requested 1 to be crew for 2.</p>
</dd>
<dt><a href="#twoPullRequestCrew">twoPullRequestCrew</a> : <code>number</code></dt>
<dd><p>User 2 requested to be crew for 1.</p>
</dd>
<dt><a href="#oneCrewStatus">oneCrewStatus</a> : <code>number</code></dt>
<dd><p>User 1 is crew for 2.</p>
</dd>
<dt><a href="#twoCrewStatus">twoCrewStatus</a> : <code>number</code></dt>
<dd><p>User 2 is crew for 1.</p>
</dd>
</dl>

<a name="module_ScriptLoader/live"></a>

## ScriptLoader/live
Loads page's necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.

<a name="module_ScriptLoader/"></a>

## ScriptLoader/
Loads page's necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.

<a name="module_TraXServerModule"></a>

## TraXServerModule
The Server side of TraX.


* [TraXServerModule](#module_TraXServerModule)
    * [~TraXServer](#module_TraXServerModule..TraXServer)
        * [~sockets](#module_TraXServerModule..TraXServer..sockets) : <code>Array.&lt;io.Client&gt;</code> ℗
        * [~liveSockets](#module_TraXServerModule..TraXServer..liveSockets) : <code>Array.&lt;io.Client&gt;</code> ℗
        * [~versionNum](#module_TraXServerModule..TraXServer..versionNum) : <code>string</code> ℗
        * [~versionNumLastUpdate](#module_TraXServerModule..TraXServer..versionNumLastUpdate) : <code>number</code> ℗
        * [~patreonTiers](#module_TraXServerModule..TraXServer..patreonTiers) : <code>Array</code> ℗
        * [~parseCookies(headers)](#module_TraXServerModule..TraXServer..parseCookies) ⇒ <code>object</code>
        * [~updatePatreonTiers()](#module_TraXServerModule..TraXServer..updatePatreonTiers) ℗
        * [~setFriendRelation(user, friend, relation, exists, callback)](#module_TraXServerModule..TraXServer..setFriendRelation) ℗
        * [~checkIfFriends(user, friend, callback)](#module_TraXServerModule..TraXServer..checkIfFriends) ℗
        * [~checkFilePerms(filename, userId, otherId, callback)](#module_TraXServerModule..TraXServer..checkFilePerms) ℗
        * [~checkFriendFilePerms(filename, userId, otherId, callback)](#module_TraXServerModule..TraXServer..checkFriendFilePerms) ℗
        * [~appendChunk(filename, chunkId, buffer, socket)](#module_TraXServerModule..TraXServer..appendChunk) ℗
        * [~forwardChunk(userId, chunkId, buffer, [isPublic])](#module_TraXServerModule..TraXServer..forwardChunk) ℗
        * [~trackIdsToNames(idArray, callback)](#module_TraXServerModule..TraXServer..trackIdsToNames) ℗
        * [~getFriendsList(userId, relation, callback)](#module_TraXServerModule..TraXServer..getFriendsList) ℗
        * [~getFriendRelation(user, friend, callback)](#module_TraXServerModule..TraXServer..getFriendRelation) ℗
        * [~updateVersionNum()](#module_TraXServerModule..TraXServer..updateVersionNum) ℗
        * [~sendVersionToAll()](#module_TraXServerModule..TraXServer..sendVersionToAll) ℗
    * [~sqlCon](#module_TraXServerModule..sqlCon) : <code>sql.ConnectionConfig</code> ℗
    * [~versionType](#module_TraXServerModule..versionType) : <code>string</code> ℗
    * [~userdata](#module_TraXServerModule..userdata) : <code>string</code> ℗
    * [~traxsubdir](#module_TraXServerModule..traxsubdir) : <code>string</code> ℗
    * [~sessionsubdir](#module_TraXServerModule..sessionsubdir) : <code>string</code> ℗
    * [~usertracksubdir](#module_TraXServerModule..usertracksubdir) : <code>string</code> ℗
    * [~usersummariessubdir](#module_TraXServerModule..usersummariessubdir) : <code>string</code> ℗
    * [~trackdataDirs](#module_TraXServerModule..trackdataDirs) : <code>Object.&lt;string&gt;</code> ℗
    * [~trackdata](#module_TraXServerModule..trackdata) : <code>string</code> ℗
    * [~accountsTable](#module_TraXServerModule..accountsTable) : <code>string</code> ℗
    * [~friendTable](#module_TraXServerModule..friendTable) : <code>string</code> ℗
    * [~statusColumn](#module_TraXServerModule..statusColumn) : <code>string</code> ℗
    * [~noStatus](#module_TraXServerModule..noStatus) : <code>number</code> ℗
    * [~oneRequestStatus](#module_TraXServerModule..oneRequestStatus) : <code>number</code> ℗
    * [~twoRequestStatus](#module_TraXServerModule..twoRequestStatus) : <code>number</code> ℗
    * [~friendStatus](#module_TraXServerModule..friendStatus) : <code>number</code> ℗
    * [~oneBlockedStatus](#module_TraXServerModule..oneBlockedStatus) : <code>number</code> ℗
    * [~twoBlockedStatus](#module_TraXServerModule..twoBlockedStatus) : <code>number</code> ℗
    * [~bothBlockedStatus](#module_TraXServerModule..bothBlockedStatus) : <code>number</code> ℗
    * [~versionNumFile](#module_TraXServerModule..versionNumFile) : <code>string</code> ℗
    * [~connectSQL()](#module_TraXServerModule..connectSQL) ℗
    * [~handler(req, res)](#module_TraXServerModule..handler) ℗
    * [~permCallback](#module_TraXServerModule..permCallback) : <code>function</code>
    * [~basicCallback](#module_TraXServerModule..basicCallback) : <code>function</code>
    * [~rowCallback](#module_TraXServerModule..rowCallback) : <code>function</code>

<a name="module_TraXServerModule..TraXServer"></a>

### TraXServerModule~TraXServer
Manages all client connections and requests. The entire server
side of TraX.

**Kind**: inner class of [<code>TraXServerModule</code>](#module_TraXServerModule)  

* [~TraXServer](#module_TraXServerModule..TraXServer)
    * [~sockets](#module_TraXServerModule..TraXServer..sockets) : <code>Array.&lt;io.Client&gt;</code> ℗
    * [~liveSockets](#module_TraXServerModule..TraXServer..liveSockets) : <code>Array.&lt;io.Client&gt;</code> ℗
    * [~versionNum](#module_TraXServerModule..TraXServer..versionNum) : <code>string</code> ℗
    * [~versionNumLastUpdate](#module_TraXServerModule..TraXServer..versionNumLastUpdate) : <code>number</code> ℗
    * [~patreonTiers](#module_TraXServerModule..TraXServer..patreonTiers) : <code>Array</code> ℗
    * [~parseCookies(headers)](#module_TraXServerModule..TraXServer..parseCookies) ⇒ <code>object</code>
    * [~updatePatreonTiers()](#module_TraXServerModule..TraXServer..updatePatreonTiers) ℗
    * [~setFriendRelation(user, friend, relation, exists, callback)](#module_TraXServerModule..TraXServer..setFriendRelation) ℗
    * [~checkIfFriends(user, friend, callback)](#module_TraXServerModule..TraXServer..checkIfFriends) ℗
    * [~checkFilePerms(filename, userId, otherId, callback)](#module_TraXServerModule..TraXServer..checkFilePerms) ℗
    * [~checkFriendFilePerms(filename, userId, otherId, callback)](#module_TraXServerModule..TraXServer..checkFriendFilePerms) ℗
    * [~appendChunk(filename, chunkId, buffer, socket)](#module_TraXServerModule..TraXServer..appendChunk) ℗
    * [~forwardChunk(userId, chunkId, buffer, [isPublic])](#module_TraXServerModule..TraXServer..forwardChunk) ℗
    * [~trackIdsToNames(idArray, callback)](#module_TraXServerModule..TraXServer..trackIdsToNames) ℗
    * [~getFriendsList(userId, relation, callback)](#module_TraXServerModule..TraXServer..getFriendsList) ℗
    * [~getFriendRelation(user, friend, callback)](#module_TraXServerModule..TraXServer..getFriendRelation) ℗
    * [~updateVersionNum()](#module_TraXServerModule..TraXServer..updateVersionNum) ℗
    * [~sendVersionToAll()](#module_TraXServerModule..TraXServer..sendVersionToAll) ℗

<a name="module_TraXServerModule..TraXServer..sockets"></a>

#### TraXServer~sockets : <code>Array.&lt;io.Client&gt;</code> ℗
All connected sockets.

**Kind**: inner property of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Default**: <code>[]</code>  
**Access**: private  
<a name="module_TraXServerModule..TraXServer..liveSockets"></a>

#### TraXServer~liveSockets : <code>Array.&lt;io.Client&gt;</code> ℗
All connected sockets requesting live data streams.

**Kind**: inner property of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Default**: <code>[]</code>  
**Access**: private  
<a name="module_TraXServerModule..TraXServer..versionNum"></a>

#### TraXServer~versionNum : <code>string</code> ℗
The current version read from file.

**Kind**: inner property of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Default**: <code>&quot;Unknown&quot;</code>  
**Access**: private  
**See**: {TraXServerModule~versionNumFile}  
<a name="module_TraXServerModule..TraXServer..versionNumLastUpdate"></a>

#### TraXServer~versionNumLastUpdate : <code>number</code> ℗
The last time at which the version number was read from file.

**Kind**: inner property of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Default**: <code>0</code>  
**Access**: private  
<a name="module_TraXServerModule..TraXServer..patreonTiers"></a>

#### TraXServer~patreonTiers : <code>Array</code> ℗
Stores the current Patreon tier benefits read from patreon.json

**Kind**: inner property of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Default**: <code>[]</code>  
**Access**: private  
<a name="module_TraXServerModule..TraXServer..parseCookies"></a>

#### TraXServer~parseCookies(headers) ⇒ <code>object</code>
Get list of cookies from headers.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Returns**: <code>object</code> - list Object of key-pairs for each cookie.  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Headers from socket handshake or request. |

<a name="module_TraXServerModule..TraXServer..updatePatreonTiers"></a>

#### TraXServer~updatePatreonTiers() ℗
Read the Patreon tier beneits from patreon.json

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  
**See**: {patreonTiers}  
<a name="module_TraXServerModule..TraXServer..setFriendRelation"></a>

#### TraXServer~setFriendRelation(user, friend, relation, exists, callback) ℗
Sets two users relation in the database.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | User id of the current user. |
| friend | <code>string</code> | User id of the other user in the relationship. |
| relation | <code>number</code> | Relation between the users we are setting. |
| exists | <code>bool</code> | If the users already exist in the table. |
| callback | <code>basicCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..checkIfFriends"></a>

#### TraXServer~checkIfFriends(user, friend, callback) ℗
Checks if the two users are friends.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The current user's id. |
| friend | <code>string</code> | The other user's id we are comparing. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..checkFilePerms"></a>

#### TraXServer~checkFilePerms(filename, userId, otherId, callback) ℗
Checks if the given userId has permission to view the given filename.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id that must be provided if the filename is in a different user's userdata. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..checkFriendFilePerms"></a>

#### TraXServer~checkFriendFilePerms(filename, userId, otherId, callback) ℗
Checks if the given userId has permission to view otherId's data.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id to check if we have perms. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..appendChunk"></a>

#### TraXServer~appendChunk(filename, chunkId, buffer, socket) ℗
Appends a given session chunk to its file. Responds to socket.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The base name of the file we are writing to. |
| chunkId | <code>string</code> | The id of the chunk we are writing in order to tell the client the status of this chunk. |
| buffer | <code>string</code> | The data to write to the file. |
| socket | <code>socket</code> | The socket.io socket to respond to with status updates. |

<a name="module_TraXServerModule..TraXServer..forwardChunk"></a>

#### TraXServer~forwardChunk(userId, chunkId, buffer, [isPublic]) ℗
Forwards received chunk data to all clients requesting live data.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | The Id of the user sending the data. |
| chunkId | <code>string</code> |  | The id of the chunk we are forwarding. |
| buffer | <code>string</code> |  | The data to forward. |
| [isPublic] | <code>boolean</code> | <code>false</code> | Should this stream be sent to everybody not just friends? |

<a name="module_TraXServerModule..TraXServer..trackIdsToNames"></a>

#### TraXServer~trackIdsToNames(idArray, callback) ℗
Takes an array of directories describing a track, and returns an array of
objects of the names and ids of the tracks.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| idArray | <code>array</code> | The array of absolute paths to tracks and configs. |
| callback | <code>callback</code> | Callback containing only the returned object as an argument. |

<a name="module_TraXServerModule..TraXServer..getFriendsList"></a>

#### TraXServer~getFriendsList(userId, relation, callback) ℗
Gets list of all users with relation to userId.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The id of the user we are looking up. |
| relation | <code>number</code> | Relation number to filter for. |
| callback | <code>rowCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..getFriendRelation"></a>

#### TraXServer~getFriendRelation(user, friend, callback) ℗
Gets the relation between two users.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The id of the user we are looking up. |
| friend | <code>string</code> | The id of the other user we are comparing. |
| callback | <code>rowCallback</code> |  |

<a name="module_TraXServerModule..TraXServer..updateVersionNum"></a>

#### TraXServer~updateVersionNum() ℗
Checks the versionNumFile for updated current app version.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  
<a name="module_TraXServerModule..TraXServer..sendVersionToAll"></a>

#### TraXServer~sendVersionToAll() ℗
Sends the version number to all connected clients.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServerModule..TraXServer)  
**Access**: private  
<a name="module_TraXServerModule..sqlCon"></a>

### TraXServerModule~sqlCon : <code>sql.ConnectionConfig</code> ℗
Stores the information about the SQL server connection.

**Kind**: inner property of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  
<a name="module_TraXServerModule..versionType"></a>

### TraXServerModule~versionType : <code>string</code> ℗
String defining which version this script is.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  
<a name="module_TraXServerModule..userdata"></a>

### TraXServerModule~userdata : <code>string</code> ℗
Directory to find and store user data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;/var/www/data/user/&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..traxsubdir"></a>

### TraXServerModule~traxsubdir : <code>string</code> ℗
Subdirectory in specific user's filder where we store our data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;/TraX/&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..sessionsubdir"></a>

### TraXServerModule~sessionsubdir : <code>string</code> ℗
Subdirectory within the user's TraX folder to store session data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;sessions/&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..usertracksubdir"></a>

### TraXServerModule~usertracksubdir : <code>string</code> ℗
Subdirectory within the user's TraX folder to store track data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;tracks/&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..usersummariessubdir"></a>

### TraXServerModule~usersummariessubdir : <code>string</code> ℗
Subdirectory within user's TraX folder to store summary data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;summaries/&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..trackdataDirs"></a>

### TraXServerModule~trackdataDirs : <code>Object.&lt;string&gt;</code> ℗
Folder paths to find public track data.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>{&quot;development&quot;:&quot;/var/www/dev.campbellcrowley.com/trax/trackdata/&quot;,&quot;release&quot;:&quot;/var/www/trax.campbellcrowley.com/trackdata/&quot;}</code>  
**Access**: private  
<a name="module_TraXServerModule..trackdata"></a>

### TraXServerModule~trackdata : <code>string</code> ℗
Selected path from trackdataDirs to use for this version of the script.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  
<a name="module_TraXServerModule..accountsTable"></a>

### TraXServerModule~accountsTable : <code>string</code> ℗
The table where account data is stored about users.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;Accounts&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..friendTable"></a>

### TraXServerModule~friendTable : <code>string</code> ℗
The table where relationship statuses are stored.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;Friends&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..statusColumn"></a>

### TraXServerModule~statusColumn : <code>string</code> ℗
The column within the friendTable to look for the relationship value between
the users.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;relationship&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..noStatus"></a>

### TraXServerModule~noStatus : <code>number</code> ℗
No relationship.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  
**Todo:**: Move relationship values to enum-like structure.  
<a name="module_TraXServerModule..oneRequestStatus"></a>

### TraXServerModule~oneRequestStatus : <code>number</code> ℗
User 1 requested to be friends.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>0</code>  
**Access**: private  
<a name="module_TraXServerModule..twoRequestStatus"></a>

### TraXServerModule~twoRequestStatus : <code>number</code> ℗
User 2 requested to be friends.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>1</code>  
**Access**: private  
<a name="module_TraXServerModule..friendStatus"></a>

### TraXServerModule~friendStatus : <code>number</code> ℗
Users are friends.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>2</code>  
**Access**: private  
<a name="module_TraXServerModule..oneBlockedStatus"></a>

### TraXServerModule~oneBlockedStatus : <code>number</code> ℗
User 1 blocked user 2.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>3</code>  
**Access**: private  
<a name="module_TraXServerModule..twoBlockedStatus"></a>

### TraXServerModule~twoBlockedStatus : <code>number</code> ℗
User 2 blocked user 1.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>4</code>  
**Access**: private  
<a name="module_TraXServerModule..bothBlockedStatus"></a>

### TraXServerModule~bothBlockedStatus : <code>number</code> ℗
Both users blocked eachother.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>5</code>  
**Access**: private  
<a name="module_TraXServerModule..versionNumFile"></a>

### TraXServerModule~versionNumFile : <code>string</code> ℗
File to find the current version of the project.

**Kind**: inner constant of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Default**: <code>&quot;./version.txt&quot;</code>  
**Access**: private  
<a name="module_TraXServerModule..connectSQL"></a>

### TraXServerModule~connectSQL() ℗
Connect to SQL server. Only used for initial connection test or to reconnect
on fatal error.

**Kind**: inner method of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  
<a name="module_TraXServerModule..handler"></a>

### TraXServerModule~handler(req, res) ℗
Handler for all http requests. Should never be called unless something broke.

**Kind**: inner method of [<code>TraXServerModule</code>](#module_TraXServerModule)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | Client request. |
| res | <code>http.ServerResponse</code> | Server response. |

<a name="module_TraXServerModule..permCallback"></a>

### TraXServerModule~permCallback : <code>function</code>
Response from checking a user's permissions.

**Kind**: inner typedef of [<code>TraXServerModule</code>](#module_TraXServerModule)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>boolean</code> \| <code>number</code> | True or >0 if has perms. Or number designating level of permission. |

<a name="module_TraXServerModule..basicCallback"></a>

### TraXServerModule~basicCallback : <code>function</code>
Basic callback with only error response.

**Kind**: inner typedef of [<code>TraXServerModule</code>](#module_TraXServerModule)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |

<a name="module_TraXServerModule..rowCallback"></a>

### TraXServerModule~rowCallback : <code>function</code>
Response from a query to a database.

**Kind**: inner typedef of [<code>TraXServerModule</code>](#module_TraXServerModule)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>array</code> | Array of rows as objects. |

<a name="module_ScriptLoader/viewdata"></a>

## ScriptLoader/viewdata
Loads page's necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.

<a name="Live"></a>

## Live ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Live](#Live) ⇐ [<code>TraX</code>](#TraX)
    * [new Live()](#new_Live_new)
    * [.init()](#Live.init)
    * [.handleToggleNotifs()](#Live.handleToggleNotifs)
    * [.PRINT()](#Live.PRINT)

<a name="new_Live_new"></a>

### new Live()
Controls live data viewing page.

<a name="Live.init"></a>

### Live.init()
Initialize TraX~Live

**Kind**: static method of [<code>Live</code>](#Live)  
<a name="Live.handleToggleNotifs"></a>

### Live.handleToggleNotifs()
Handles user requesting to enable notifications.

**Kind**: static method of [<code>Live</code>](#Live)  
**Access**: public  
<a name="Live.PRINT"></a>

### Live.PRINT()
Print stored data for debugging.

**Kind**: static method of [<code>Live</code>](#Live)  
**Access**: public  
<a name="Sidebar"></a>

## Sidebar
**Kind**: global class  

* [Sidebar](#Sidebar)
    * [new Sidebar()](#new_Sidebar_new)
    * [.init()](#Sidebar.init)
    * [.toggleOpen([force])](#Sidebar.toggleOpen)

<a name="new_Sidebar_new"></a>

### new Sidebar()
Controls a sidebar menu.

<a name="Sidebar.init"></a>

### Sidebar.init()
Initialize Sidebar.

**Kind**: static method of [<code>Sidebar</code>](#Sidebar)  
**Access**: public  
<a name="Sidebar.toggleOpen"></a>

### Sidebar.toggleOpen([force])
Toggle the sidebar open and closed.

**Kind**: static method of [<code>Sidebar</code>](#Sidebar)  
**Pulbic**:   

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> \| <code>string</code> | "default" sets to default setting, a boolean sets it to that value, undefined toggles state. |

<a name="Units"></a>

## Units ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Units](#Units) ⇐ [<code>TraX</code>](#TraX)
    * [new Units()](#new_Units_new)
    * [.speedToUnit(input, [units])](#Units.speedToUnit) ⇒ <code>number</code>
    * [.distanceToLargeUnit(input, [units], [noround])](#Units.distanceToLargeUnit) ⇒ <code>number</code>
    * [.speedToLargeUnit(input, [units])](#Units.speedToLargeUnit) ⇒ <code>number</code>
    * [.distanceToSmallUnit(input, [units])](#Units.distanceToSmallUnit) ⇒ <code>number</code>
    * [.getSmallDistanceUnit([units])](#Units.getSmallDistanceUnit) ⇒ <code>string</code>
    * [.getLargeSpeedUnit([units])](#Units.getLargeSpeedUnit) ⇒ <code>string</code>
    * [.coordToMeters(lat1, lng1, lat2, lng2)](#Units.coordToMeters) ⇒ <code>number</code>
    * [.latLngToMeters(one, two)](#Units.latLngToMeters) ⇒ <code>number</code>

<a name="new_Units_new"></a>

### new Units()
Unit conversion helper functions.

<a name="Units.speedToUnit"></a>

### Units.speedToUnit(input, [units]) ⇒ <code>number</code>
Meters per second to miles per hour or kilometers per hour.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Number rounded to tenths place in unit.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>number</code> | Speed in meters per second. |
| [units] | <code>string</code> | The units system to convert to, default uses TraX.unitDropdownDom.value |

<a name="Units.distanceToLargeUnit"></a>

### Units.distanceToLargeUnit(input, [units], [noround]) ⇒ <code>number</code>
Meters to mile or kilometer

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Converted value.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>number</code> |  | Distance in meters. |
| [units] | <code>string</code> |  | Unit system to convert to, default uses TraX.unitDropdownDom.value |
| [noround] | <code>boolean</code> | <code>false</code> | Disable rounding final value to tenths place. |

<a name="Units.speedToLargeUnit"></a>

### Units.speedToLargeUnit(input, [units]) ⇒ <code>number</code>
Kilometers per hour to MPH or KPH.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Converted value.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>number</code> | Speed in kilometers per hour. |
| [units] | <code>string</code> | The unit system to convert to, default uses TraX.unitDropdownDom.value |

<a name="Units.distanceToSmallUnit"></a>

### Units.distanceToSmallUnit(input, [units]) ⇒ <code>number</code>
Meters to feet or meters.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Converted value.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>number</code> | Input in meters. |
| [units] | <code>string</code> | The unit system to convert to, default uses TraX.unitDropdownDom.value |

<a name="Units.getSmallDistanceUnit"></a>

### Units.getSmallDistanceUnit([units]) ⇒ <code>string</code>
Get feet or meters unit.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>string</code> - The unit names. (ft or m)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [units] | <code>string</code> | The unit system to get the units for, default uses TraX.unitDropdownDom.value |

<a name="Units.getLargeSpeedUnit"></a>

### Units.getLargeSpeedUnit([units]) ⇒ <code>string</code>
Get miles per hour, or kilometers per hour unit.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>string</code> - The unit names. (kmh or mph)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [units] | <code>string</code> | The units system to get the unit for, default uses TraX.unitDropdownDom.value |

<a name="Units.coordToMeters"></a>

### Units.coordToMeters(lat1, lng1, lat2, lng2) ⇒ <code>number</code>
Convert given two points latitude and longitude, get the distance between the
two. Treats Earth as a sphere with radius 6378.137km.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Distance in meters between the two coords.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| lat1 | <code>number</code> | The first latitude. |
| lng1 | <code>number</code> | The first longitude. |
| lat2 | <code>number</code> | The second latitude. |
| lng2 | <code>number</code> | The second longitude. |

<a name="Units.latLngToMeters"></a>

### Units.latLngToMeters(one, two) ⇒ <code>number</code>
Given two coords, find distance in meters between the two.

**Kind**: static method of [<code>Units</code>](#Units)  
**Returns**: <code>number</code> - Distance in meters between the two coords.  
**Access**: public  
**See**: {Units~coordToMeters}  

| Param | Type | Description |
| --- | --- | --- |
| one | <code>Object</code> | First coordinate. |
| two | <code>Object</code> | Second coordinate. |

<a name="Common"></a>

## Common ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Common](#Common) ⇐ [<code>TraX</code>](#TraX)
    * [new Common()](#new_Common_new)
    * [.Point3d](#Common.Point3d)
        * [new Common.Point3d(x, [y], [z], [color])](#new_Common.Point3d_new)
    * [.init()](#Common.init)
    * [.rotateVector(vector, rotation, [flip])](#Common.rotateVector) ⇒ [<code>Point3d</code>](#Common.Point3d)
    * [.rotateX(point, rad)](#Common.rotateX)
    * [.rotateY(point, rad)](#Common.rotateY)
    * [.rotateZ(point, rad)](#Common.rotateZ)
    * [.cross(a, b)](#Common.cross) ⇒ <code>Array</code>
    * [.formatMsec(msecs, [plusSign], [minSections])](#Common.formatMsec) ⇒ <code>string</code>
    * [.formatTime(msecs, [showSeconds])](#Common.formatTime) ⇒ <code>string</code>
    * [.pad(num, digits)](#Common.pad) ⇒ <code>string</code>
    * [.interpolateCoord(one, two, val)](#Common.interpolateCoord) ⇒ <code>Object</code>
    * [.lerp(one, two, val)](#Common.lerp) ⇒ <code>number</code>
    * [.coordDistance(one, two)](#Common.coordDistance) ⇒ <code>number</code>
    * [.compareVersion(a, b)](#Common.compareVersion) ⇒ <code>number</code>

<a name="new_Common_new"></a>

### new Common()
Other common helper functions.

<a name="Common.Point3d"></a>

### Common.Point3d
**Kind**: static class of [<code>Common</code>](#Common)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | X Coord. |
| y | <code>number</code> | Y Coord. |
| z | <code>number</code> | Z Coord. |
| color | <code>string</code> | The color of the point. |

<a name="new_Common.Point3d_new"></a>

#### new Common.Point3d(x, [y], [z], [color])
Defines a point in space with a color.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> \| [<code>Point3d</code>](#Common.Point3d) | X Coord or instance of Point3d to copy. |
| [y] | <code>number</code> | Y Coord. |
| [z] | <code>number</code> | Z Coord. |
| [color] | <code>string</code> |  |

<a name="Common.init"></a>

### Common.init()
Initialize TraX.Common

**Kind**: static method of [<code>Common</code>](#Common)  
**Access**: public  
<a name="Common.rotateVector"></a>

### Common.rotateVector(vector, rotation, [flip]) ⇒ [<code>Point3d</code>](#Common.Point3d)
Rotates a vector by a given rotation by applying a z->x->y Tait-Bryan
rotation. Enabling flip applies the inverse of this rotation.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: [<code>Point3d</code>](#Common.Point3d) - The rotated vector.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vector | [<code>Point3d</code>](#Common.Point3d) \| <code>Array</code> |  | The point to flip defined by xyz values, or 0 1 2 elements in the order of x y z. |
| rotation | <code>Array</code> \| <code>Object</code> |  | Rotation in alpha beta gamma rotations. |
| [flip] | <code>boolean</code> | <code>false</code> | Applies the inverse of the given rotation. |

<a name="Common.rotateX"></a>

### Common.rotateX(point, rad)
Rotates a vector around the X axis by a certain angle in radians. Rotation is
applied in-place.

**Kind**: static method of [<code>Common</code>](#Common)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| point | [<code>Point3d</code>](#Common.Point3d) | The vector to rotate. |
| rad | <code>number</code> | The angle in radians. |

<a name="Common.rotateY"></a>

### Common.rotateY(point, rad)
Rotates a vector around the Y axis by a certain angle in radians. Rotation is
applied in-place.

**Kind**: static method of [<code>Common</code>](#Common)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| point | [<code>Point3d</code>](#Common.Point3d) | The vector to rotate. |
| rad | <code>number</code> | The angle in radians. |

<a name="Common.rotateZ"></a>

### Common.rotateZ(point, rad)
Rotates a vector around the Z axis by a certain angle in radians. Rotation is
applied in-place.

**Kind**: static method of [<code>Common</code>](#Common)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| point | [<code>Point3d</code>](#Common.Point3d) | The vector to rotate. |
| rad | <code>number</code> | The angle in radians. |

<a name="Common.cross"></a>

### Common.cross(a, b) ⇒ <code>Array</code>
Calculates the cross product of two vectors.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>Array</code> - Array of length 3 defining the vector as xyz.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Point3d</code>](#Common.Point3d) \| <code>Array</code> | First vector. |
| b | [<code>Point3d</code>](#Common.Point3d) \| <code>Array</code> | Second vector. |

<a name="Common.formatMsec"></a>

### Common.formatMsec(msecs, [plusSign], [minSections]) ⇒ <code>string</code>
Formats a duration in milliseconds as a human-readable string.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>string</code> - The formatted string.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msecs | <code>number</code> |  | The duration in milliseconds to format. |
| [plusSign] | <code>boolean</code> | <code>false</code> | Whether to unclude the plus sign on positive numbers or not. |
| [minSections] | <code>number</code> | <code>0</code> | Minimum sections of digits to show. <=0 shows seconds and milliseconds, >0 shows minutes, >1 shows hours, >2 shows days. |

<a name="Common.formatTime"></a>

### Common.formatTime(msecs, [showSeconds]) ⇒ <code>string</code>
Formats a time givin in milliseconds since epoch as a human readable string.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>string</code> - Formatted time as a string.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msecs | <code>number</code> |  | Time as millisconds since epoch. |
| [showSeconds] | <code>boolean</code> | <code>false</code> | Whether to show seconds on the time or not. |

<a name="Common.pad"></a>

### Common.pad(num, digits) ⇒ <code>string</code>
Pad a number with leading zeros to a minimum length of given digits.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>string</code> - Number with leading zeroes to match specified length.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> \| <code>string</code> | Number to pad with leading zeroes. |
| digits | <code>number</code> | Number of digits long to make the final string at a minimum. |

<a name="Common.interpolateCoord"></a>

### Common.interpolateCoord(one, two, val) ⇒ <code>Object</code>
Linearly interpolates between two coordinates. Does not take into account
curvature of Earth. Individually interpolates latitude and longitude.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>Object</code> - The interpolated coord.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| one | <code>Object</code> | The first coordinate. |
| two | <code>Object</code> | The second coordinate. |
| val | <code>number</code> | The value from 0 to 1 inclusive to interpolate between the coordinates. |

<a name="Common.lerp"></a>

### Common.lerp(one, two, val) ⇒ <code>number</code>
Linearly interpolate between two numbers.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>number</code> - The interpolated value.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| one | <code>number</code> | The first number. |
| two | <code>number</code> | The second number. |
| val | <code>number</code> | Value from 0 to 1 inclusive to interpolate between the given numbers. |

<a name="Common.coordDistance"></a>

### Common.coordDistance(one, two) ⇒ <code>number</code>
Uses the Pythagorean theorem to calculate distance between coordinates as if
they were on a flat plane.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>number</code> - Distance in original latitude and longitude units.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| one | <code>Object</code> | Coordinate one. |
| two | <code>Object</code> | Coordinate one. |

<a name="Common.compareVersion"></a>

### Common.compareVersion(a, b) ⇒ <code>number</code>
Compare two version strings to see which version is a higher value.

**Kind**: static method of [<code>Common</code>](#Common)  
**Returns**: <code>number</code> - -1 if a < b, 0 if a == b, +1 if a > b;  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>string</code> | Version separated by decimals. |
| b | <code>string</code> | Version in same format as a. |

<a name="TraX"></a>

## TraX
**Kind**: global class  

* [TraX](#TraX)
    * [new TraX()](#new_TraX_new)
    * [.socket](#TraX.socket) : <code>SocketIO</code>
    * [.friendsList](#TraX.friendsList) : <code>Array.&lt;Object&gt;</code>
    * [.summaryList](#TraX.summaryList) : <code>Object</code>
    * [.isSignedIn](#TraX.isSignedIn) : <code>boolean</code>
    * [.preventSend](#TraX.preventSend) : <code>boolean</code>
    * [.unitDropdownDom](#TraX.unitDropdownDom) : <code>Object</code> \| <code>Element</code>
    * [.initialized](#TraX.initialized) : <code>boolean</code>
    * [.debugMode](#TraX.debugMode) : <code>number</code>
    * [.downRotation](#TraX.downRotation) : <code>Object</code>
    * [.friendsList](#TraX.friendsList) : <code>Array.&lt;Object&gt;</code>
    * [.downRotation](#TraX.downRotation) : <code>Object</code>
    * [.goBack()](#TraX.goBack)
    * [.setURLOption(option, setting)](#TraX.setURLOption)
    * [.toggleDebug([isDebug])](#TraX.toggleDebug)
    * [.requestFriendsList()](#TraX.requestFriendsList)
    * [.showMessageBox(message, [time], [urgent])](#TraX.showMessageBox)
    * [.hideMessageBox()](#TraX.hideMessageBox)
    * [.getDriverId()](#TraX.getDriverId) ⇒ <code>string</code>
    * [.getDriverName()](#TraX.getDriverName) ⇒ <code>string</code>
    * [.getDeviceType([userAgent])](#TraX.getDeviceType) ⇒ <code>string</code>
    * [.getBrowser([userAgent])](#TraX.getBrowser) ⇒ <code>string</code>
    * [.addEventListener(name, callback)](#TraX.addEventListener)
    * [.togglePause([force])](#TraX.togglePause)
    * [.init()](#TraX.init)
    * [.requestFilesize()](#TraX.requestFilesize)
    * [.setURLOption(option, setting)](#TraX.setURLOption)
    * [.getVersion()](#TraX.getVersion) ⇒ <code>string</code>
    * [.sessionTrackNameChange()](#TraX.sessionTrackNameChange)
    * [.sessionConfigNameChange()](#TraX.sessionConfigNameChange)
    * [.PRINT()](#TraX.PRINT)
    * [.toggleRealtimeView([force])](#TraX.toggleRealtimeView)
    * [.toggleDebug([isDebug])](#TraX.toggleDebug)
    * [.toggleStatus()](#TraX.toggleStatus)
    * [.changeUpdateFreq()](#TraX.changeUpdateFreq)
    * [.toggleMap()](#TraX.toggleMap)
    * [.toggleOptionsMenu([force])](#TraX.toggleOptionsMenu)
    * [.toggleFriendsView([force])](#TraX.toggleFriendsView)
    * [.sessionInputChange()](#TraX.sessionInputChange)
    * [.handleClickBigButton()](#TraX.handleClickBigButton)
    * [.handleClickTimers()](#TraX.handleClickTimers)
    * [.handleClickCustom()](#TraX.handleClickCustom)
    * [.triggerHUDFullscreen()](#TraX.triggerHUDFullscreen)
    * [.releaseHUDFullscreen()](#TraX.releaseHUDFullscreen)
    * [.toggleHUDFullscreen()](#TraX.toggleHUDFullscreen)
    * [.addFriend()](#TraX.addFriend)
    * [.removeFriend(id)](#TraX.removeFriend)
    * [.declineFriend(id)](#TraX.declineFriend)
    * [.acceptFriend(id)](#TraX.acceptFriend)
    * [.blockFriend(id)](#TraX.blockFriend)
    * [.unblockUser(id)](#TraX.unblockUser)
    * [.copyFriendLink()](#TraX.copyFriendLink)
    * [.handleClickBluetoothRefresh()](#TraX.handleClickBluetoothRefresh)
    * [.leaveDataView()](#TraX.leaveDataView)

<a name="new_TraX_new"></a>

### new TraX()
The base class for all TraX related things.

<a name="TraX.socket"></a>

### TraX.socket : <code>SocketIO</code>
The open socket to the server.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.friendsList"></a>

### TraX.friendsList : <code>Array.&lt;Object&gt;</code>
All of user's friends.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>[]</code>  
**Access**: public  
<a name="TraX.summaryList"></a>

### TraX.summaryList : <code>Object</code>
List of summaries organized by id.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>{}</code>  
**Access**: public  
<a name="TraX.isSignedIn"></a>

### TraX.isSignedIn : <code>boolean</code>
Is the user currently signed in.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>false</code>  
**Access**: public  
**Read only**: true  
<a name="TraX.preventSend"></a>

### TraX.preventSend : <code>boolean</code>
Prevent sending information to servers.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>false</code>  
**Access**: public  
<a name="TraX.unitDropdownDom"></a>

### TraX.unitDropdownDom : <code>Object</code> \| <code>Element</code>
If this is implemented, others should override this with the DOM element that
selects the units.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>{&quot;value&quot;:&quot;imperial&quot;}</code>  
**Access**: public  
<a name="TraX.initialized"></a>

### TraX.initialized : <code>boolean</code>
All scripts loaded and initialized.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>false</code>  
**Access**: public  
**Read only**: true  
<a name="TraX.debugMode"></a>

### TraX.debugMode : <code>number</code>
Debug setting used across scripts for additional logging and additional UI
sections that most users do not wish to see.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>0</code>  
**Access**: public  
<a name="TraX.downRotation"></a>

### TraX.downRotation : <code>Object</code>
Rotation with -Z pointing towards the Earth.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>{&quot;a&quot;:0,&quot;b&quot;:0,&quot;g&quot;:0}</code>  
**Access**: public  
**Read only**: true  
<a name="TraX.friendsList"></a>

### TraX.friendsList : <code>Array.&lt;Object&gt;</code>
All of user's friends.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>[]</code>  
**Access**: public  
<a name="TraX.downRotation"></a>

### TraX.downRotation : <code>Object</code>
Rotation where -Z is down.

**Kind**: static property of [<code>TraX</code>](#TraX)  
**Default**: <code>{&quot;a&quot;:0,&quot;b&quot;:0,&quot;g&quot;:0}</code>  
**Access**: public  
<a name="TraX.goBack"></a>

### TraX.goBack()
Go to previous page, or if it wasn't one of our pages, go to the home page.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.setURLOption"></a>

### TraX.setURLOption(option, setting)
Set query option in URL.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>string</code> | The key name. |
| setting | <code>string</code> | The key value. |

<a name="TraX.toggleDebug"></a>

### TraX.toggleDebug([isDebug])
Toggle the debug menu open or closed.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [isDebug] | <code>boolean</code> | Set debug mode or toggle with undefined. |

<a name="TraX.requestFriendsList"></a>

### TraX.requestFriendsList()
Request friends list for signed in user from server.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.showMessageBox"></a>

### TraX.showMessageBox(message, [time], [urgent])
Add new message to queue of message boxes.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | The message to show. |
| [time] | <code>number</code> | <code>5000</code> | The number of milliseconds to show the message for. |
| [urgent] | <code>boolean</code> | <code>true</code> | Should this message cancel the current message and show this one immediately? |

<a name="TraX.hideMessageBox"></a>

### TraX.hideMessageBox()
Hide currently open message box.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.getDriverId"></a>

### TraX.getDriverId() ⇒ <code>string</code>
Returns current user's account Id.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Returns**: <code>string</code> - The driver's account id.  
**Access**: public  
<a name="TraX.getDriverName"></a>

### TraX.getDriverName() ⇒ <code>string</code>
Returns current user's full name.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Returns**: <code>string</code> - The driver's full name.  
**Access**: public  
<a name="TraX.getDeviceType"></a>

### TraX.getDeviceType([userAgent]) ⇒ <code>string</code>
Get relevant device OS distinction from userAgent.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Returns**: <code>string</code> - The name of the OS from the user agent.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [userAgent] | <code>string</code> | A userAgent to user instead of browser's agent. |

<a name="TraX.getBrowser"></a>

### TraX.getBrowser([userAgent]) ⇒ <code>string</code>
Get relevant browser name from userAgent.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Returns**: <code>string</code> - The name of the browser from the user agent.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [userAgent] | <code>string</code> | A userAgent to user instead of browser's agent. |

<a name="TraX.addEventListener"></a>

### TraX.addEventListener(name, callback)
Add a listener to a TraX event.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the event to listen for. |
| callback | <code>listenerCB</code> | The callback to fire when the event fires. |

<a name="TraX.togglePause"></a>

### TraX.togglePause([force])
Toggle recording of data.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force state, or toggle with undefined. |

<a name="TraX.init"></a>

### TraX.init()
Initialize script

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.requestFilesize"></a>

### TraX.requestFilesize()
Request total storage size the user has on server.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.setURLOption"></a>

### TraX.setURLOption(option, setting)
Set query option in URL.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>string</code> | The key name. |
| setting | <code>string</code> | The key value. |

<a name="TraX.getVersion"></a>

### TraX.getVersion() ⇒ <code>string</code>
Returns current client version.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Returns**: <code>string</code> - Current version.  
**Access**: public  
<a name="TraX.sessionTrackNameChange"></a>

### TraX.sessionTrackNameChange()
Dropdown menu for track name changed.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.sessionConfigNameChange"></a>

### TraX.sessionConfigNameChange()
Dropdown menu for config name changed.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.PRINT"></a>

### TraX.PRINT()
Print stored lap data to console.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.toggleRealtimeView"></a>

### TraX.toggleRealtimeView([force])
Toggle the live data view. If force is set to true or false it will force the
UI open or closed.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set view state or toggle if undefined. |

<a name="TraX.toggleDebug"></a>

### TraX.toggleDebug([isDebug])
Toggle the debug menu open or closed.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [isDebug] | <code>boolean</code> | Sets debug mode, or toggles if undefined. |

<a name="TraX.toggleStatus"></a>

### TraX.toggleStatus()
Toggle the status light UI.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.changeUpdateFreq"></a>

### TraX.changeUpdateFreq()
Called when user changes save frequency dropdown.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.toggleMap"></a>

### TraX.toggleMap()
Toggle the friendmap visibility.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.toggleOptionsMenu"></a>

### TraX.toggleOptionsMenu([force])
Toggle the options menu visibility.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force menu state or undefined to toggle. |

<a name="TraX.toggleFriendsView"></a>

### TraX.toggleFriendsView([force])
Toggle the friends view/manager visibility.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force view to state, or undefined to toggle. |

<a name="TraX.sessionInputChange"></a>

### TraX.sessionInputChange()
Session name changed in input box.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.handleClickBigButton"></a>

### TraX.handleClickBigButton()
User chose HUD 0, big button.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.handleClickTimers"></a>

### TraX.handleClickTimers()
User chose HUD 1, realtime timers.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.handleClickCustom"></a>

### TraX.handleClickCustom()
User chose HUD 2, custom.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.triggerHUDFullscreen"></a>

### TraX.triggerHUDFullscreen()
Bring HUD to fullscreen to remove distractions.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.releaseHUDFullscreen"></a>

### TraX.releaseHUDFullscreen()
Exit fullscreen.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.toggleHUDFullscreen"></a>

### TraX.toggleHUDFullscreen()
Toggle fullscreen HUD state.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.addFriend"></a>

### TraX.addFriend()
Add friend button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.removeFriend"></a>

### TraX.removeFriend(id)
Remove friend button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of friend to remove as friend. |

<a name="TraX.declineFriend"></a>

### TraX.declineFriend(id)
Decline friend request button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to decline friend request. |

<a name="TraX.acceptFriend"></a>

### TraX.acceptFriend(id)
Accept friend request button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to accept friend request. |

<a name="TraX.blockFriend"></a>

### TraX.blockFriend(id)
Block user button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of friend to block. |

<a name="TraX.unblockUser"></a>

### TraX.unblockUser(id)
Unblock user button clicked.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to unblock. |

<a name="TraX.copyFriendLink"></a>

### TraX.copyFriendLink()
Clicked copy link button on account for sharing.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.handleClickBluetoothRefresh"></a>

### TraX.handleClickBluetoothRefresh()
Click add bluetooth device.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="TraX.leaveDataView"></a>

### TraX.leaveDataView()
Go to previous page.

**Kind**: static method of [<code>TraX</code>](#TraX)  
**Access**: public  
<a name="Canvases"></a>

## Canvases ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Canvases](#Canvases) ⇐ [<code>TraX</code>](#TraX)
    * [new Canvases()](#new_Canvases_new)
    * [.Sphere3d](#Canvases.Sphere3d)
        * [new Canvases.Sphere3d([radius])](#new_Canvases.Sphere3d_new)
    * [.rotation](#Canvases.rotation) : <code>Object</code>
    * [.drawAccel](#Canvases.drawAccel) : <code>Object</code>
    * [.forwardVector](#Canvases.forwardVector) : <code>Object</code>
    * [.headingOffset](#Canvases.headingOffset) : <code>number</code>
    * [.rotationRate](#Canvases.rotationRate) : <code>Object</code>
    * [.init()](#Canvases.init)
    * [.renderGyro([makeDown])](#Canvases.renderGyro)
    * [.renderAccel([externalDevice])](#Canvases.renderAccel)
    * [.resetEstimatedVelocity(gpsSpeed, gpsHeading)](#Canvases.resetEstimatedVelocity)

<a name="new_Canvases_new"></a>

### new Canvases()
The script that control the canvases on the pages that visualize G-Force as
well as the Orientation.

<a name="Canvases.Sphere3d"></a>

### Canvases.Sphere3d
**Kind**: static class of [<code>Canvases</code>](#Canvases)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| point | <code>Array.&lt;TraX.Common.Point3d&gt;</code> | Points that make up the sphere. |
| color | <code>string</code> | Color of all points in the sphere. |
| radius | <code>number</code> | The radius of the sphere. |
| numberOfVertexes | <code>number</code> | The number of points defining the sphere. |

<a name="new_Canvases.Sphere3d_new"></a>

#### new Canvases.Sphere3d([radius])
Class storing information about how to draw a sphere on the canvas.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [radius] | <code>number</code> | <code>20</code> | The radius of the sphere. |

<a name="Canvases.rotation"></a>

### Canvases.rotation : <code>Object</code>
Current given rotation of device.

**Kind**: static property of [<code>Canvases</code>](#Canvases)  
**Default**: <code>{&quot;a&quot;:0,&quot;b&quot;:0,&quot;g&quot;:0}</code>  
**Access**: public  
<a name="Canvases.drawAccel"></a>

### Canvases.drawAccel : <code>Object</code>
Current acceleration being exerted on device.

**Kind**: static property of [<code>Canvases</code>](#Canvases)  
**Default**: <code>[0,0,0]</code>  
**Access**: public  
<a name="Canvases.forwardVector"></a>

### Canvases.forwardVector : <code>Object</code>
Vector where +X is forwards.

**Kind**: static property of [<code>Canvases</code>](#Canvases)  
**Default**: <code>[0,1,0]</code>  
**Access**: public  
<a name="Canvases.headingOffset"></a>

### Canvases.headingOffset : <code>number</code>
Calculated offset between what we think is forwards and the direction GPS
tells us we are going.

**Kind**: static property of [<code>Canvases</code>](#Canvases)  
**Default**: <code>0</code>  
**Access**: public  
<a name="Canvases.rotationRate"></a>

### Canvases.rotationRate : <code>Object</code>
The current rate at which the device is rotating.

**Kind**: static property of [<code>Canvases</code>](#Canvases)  
**Default**: <code>{&quot;a&quot;:0,&quot;b&quot;:0,&quot;g&quot;:0}</code>  
**Access**: public  
<a name="Canvases.init"></a>

### Canvases.init()
Initialize Canvases

**Kind**: static method of [<code>Canvases</code>](#Canvases)  
**Access**: public  
<a name="Canvases.renderGyro"></a>

### Canvases.renderGyro([makeDown])
Render the canvas showing orientation/gyro data.

**Kind**: static method of [<code>Canvases</code>](#Canvases)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [makeDown] | <code>boolean</code> | <code>false</code> | Make the orientation sphere point down to world down, or screen down. |

<a name="Canvases.renderAccel"></a>

### Canvases.renderAccel([externalDevice])
Draw data on canvas showing acceleration data.

**Kind**: static method of [<code>Canvases</code>](#Canvases)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [externalDevice] | <code>boolean</code> | <code>false</code> | Is this device a different device from the one recording the data. |

<a name="Canvases.resetEstimatedVelocity"></a>

### Canvases.resetEstimatedVelocity(gpsSpeed, gpsHeading)
Take the passed in values as the current correct speed and heading, and reset
our estimated velocity.

**Kind**: static method of [<code>Canvases</code>](#Canvases)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| gpsSpeed | <code>number</code> | The speed reported by the GPS. (m/s?) |
| gpsHeading | <code>number</code> | The heading reported by the GPS. (deg cw of N?) |

<a name="Video"></a>

## Video ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Video](#Video) ⇐ [<code>TraX</code>](#TraX)
    * [new Video()](#new_Video_new)
    * [new Video()](#new_Video_new)
    * [.init()](#Video.init)
    * [.getPerms([silent])](#Video.getPerms)
    * [.setPerms(perm)](#Video.setPerms)
    * [.startRecording()](#Video.startRecording) ⇒ <code>boolean</code>
    * [.stopRecording([preventDelayedTrigger])](#Video.stopRecording)
    * [.toggleVideo([force])](#Video.toggleVideo)
    * [.init()](#Video.init)
    * [.getPerms([silent])](#Video.getPerms)
    * [.setPerms(perm)](#Video.setPerms)
    * [.startRecording()](#Video.startRecording) ⇒ <code>boolean</code>
    * [.stopRecording()](#Video.stopRecording)
    * [.pauseRecording()](#Video.pauseRecording)
    * [.getURL()](#Video.getURL) ⇒ <code>string</code>
    * [.toggleVideo([force])](#Video.toggleVideo)

<a name="new_Video_new"></a>

### new Video()
Manages phone cameras, capturing the media, and then recording the media to
the client's device.

This may NOT be used with the other Video class.

<a name="new_Video_new"></a>

### new Video()
Manages phone cameras, capturing the media, and then streaming the media to
server.

This may NOT be used with the other Video class.

<a name="Video.init"></a>

### Video.init()
Initialize TraX~Video

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.getPerms"></a>

### Video.getPerms([silent])
Check if we have permission to edit user's data. Unised for now until video
streaming is fully implemented.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [silent] | <code>boolean</code> | <code>false</code> | Reduce messages shown to user. |

<a name="Video.setPerms"></a>

### Video.setPerms(perm)
Set that we have perms or not and update UI. Unused for now until video
streaming is fully implemented.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| perm | <code>boolean</code> | Do we have permission. |

<a name="Video.startRecording"></a>

### Video.startRecording() ⇒ <code>boolean</code>
Start buffering or streaming video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>boolean</code> - Whether recording actually started or not.  
**Access**: public  
<a name="Video.stopRecording"></a>

### Video.stopRecording([preventDelayedTrigger])
Stop streaming or buffering video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [preventDelayedTrigger] | <code>boolean</code> | <code>false</code> | Don't automatically start downloading delayed downloads. |

<a name="Video.toggleVideo"></a>

### Video.toggleVideo([force])
Toggle the visibility of cameras. Also opens and closes streams of video.
Must be open in order to record video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set video state or toggle with undefined. |

<a name="Video.init"></a>

### Video.init()
Initialize Video module.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.getPerms"></a>

### Video.getPerms([silent])
Check if we have permission to edit user's data.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [silent] | <code>boolean</code> | <code>false</code> | Reduce messages sent to user. |

<a name="Video.setPerms"></a>

### Video.setPerms(perm)
Set that we have perms or not and update UI.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| perm | <code>boolean</code> | Whether we have permission or not. |

<a name="Video.startRecording"></a>

### Video.startRecording() ⇒ <code>boolean</code>
Start buffering or streaming video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>boolean</code> - Whether recording actually started or not.  
**Access**: public  
<a name="Video.stopRecording"></a>

### Video.stopRecording()
Stop streaming or buffering video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.pauseRecording"></a>

### Video.pauseRecording()
Pause a recording without completely eding the file.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
**Todo:**: Remove?  
<a name="Video.getURL"></a>

### Video.getURL() ⇒ <code>string</code>
Get URL where we can find the saved video if it was streamed to a server.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>string</code> - URL of where to watch the current video being streamed.  
**Access**: public  
<a name="Video.toggleVideo"></a>

### Video.toggleVideo([force])
Toggle the visibility of cameras. Also opens and closes streams of video.
Must be open in order to record video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set video state or toggle with undefined. |

<a name="KeepAwake"></a>

## KeepAwake
**Kind**: global class  

* [KeepAwake](#KeepAwake)
    * [new KeepAwake()](#new_KeepAwake_new)
    * [.keepAwakeSetting(mode)](#KeepAwake.keepAwakeSetting)
    * [.keepAwake(setting)](#KeepAwake.keepAwake)

<a name="new_KeepAwake_new"></a>

### new KeepAwake()
Keeps devices from falling asleep or turning off their displays while
recording data.

<a name="KeepAwake.keepAwakeSetting"></a>

### KeepAwake.keepAwakeSetting(mode)
Set method for keeping device awake.

**Kind**: static method of [<code>KeepAwake</code>](#KeepAwake)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The method to use. |

<a name="KeepAwake.keepAwake"></a>

### KeepAwake.keepAwake(setting)
Enable/Disable keeping device awake.

**Kind**: static method of [<code>KeepAwake</code>](#KeepAwake)  
**Access**: public  
**Todo:**: Fix pageload leak.  

| Param | Type | Description |
| --- | --- | --- |
| setting | <code>boolean</code> | Enable or Disable. |

<a name="MyMap"></a>

## MyMap ⇐ [<code>DataView</code>](#DataView)
**Kind**: global class  
**Extends**: [<code>DataView</code>](#DataView)  

* [MyMap](#MyMap) ⇐ [<code>DataView</code>](#DataView)
    * [new MyMap()](#new_MyMap_new)
    * [.init()](#MyMap.init)
    * [.handleOpening()](#MyMap.handleOpening)
    * [.handleClosing()](#MyMap.handleClosing)
    * [.handleClickAddTrack()](#MyMap.handleClickAddTrack)
    * [.handleClickEditTrack()](#MyMap.handleClickEditTrack)
    * [.handleClickAddConfig()](#MyMap.handleClickAddConfig)
    * [.handleClickEditConfig()](#MyMap.handleClickEditConfig)
    * [.handleClickEndPlace()](#MyMap.handleClickEndPlace)
    * [.handleClickPlaceStart()](#MyMap.handleClickPlaceStart)
    * [.handleClickPlaceFinish()](#MyMap.handleClickPlaceFinish)
    * [.handleClickPlaceTrackCenter()](#MyMap.handleClickPlaceTrackCenter)
    * [.handleClickSubmitMapNames()](#MyMap.handleClickSubmitMapNames)
    * [.handleClickBackMapNames()](#MyMap.handleClickBackMapNames)
    * [.handleClickDonePlacing()](#MyMap.handleClickDonePlacing)
    * [.handleClickCancelPlacing()](#MyMap.handleClickCancelPlacing)
    * [.showMessageWindowIndex(index, [zoomToFit])](#MyMap.showMessageWindowIndex)
    * [.showMessageWindowTime(msecs, [zoomToFit])](#MyMap.showMessageWindowTime)
    * [.showMap(a, b)](#MyMap.showMap)
    * [.resetPolyLine()](#MyMap.resetPolyLine)
    * [.getColor(index)](#MyMap.getColor) ⇒ <code>string</code>
    * [.changeLineColorMode(mode)](#MyMap.changeLineColorMode)
    * [.updateMyMap([startIndex], [endIndex])](#MyMap.updateMyMap)
    * [.togglePlaybackOverlay([force])](#MyMap.togglePlaybackOverlay)
    * [.togglePlayback([force])](#MyMap.togglePlayback)

<a name="new_MyMap_new"></a>

### new MyMap()
Controls the map in DataView.

<a name="MyMap.init"></a>

### MyMap.init()
Initialize TraX~MyMap

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleOpening"></a>

### MyMap.handleOpening()
Data view is openeing, and map may be visible now.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClosing"></a>

### MyMap.handleClosing()
Data view is closing, and map is not visible anymore.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickAddTrack"></a>

### MyMap.handleClickAddTrack()
Add track selected from track list.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickEditTrack"></a>

### MyMap.handleClickEditTrack()
Handle click edit track.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickAddConfig"></a>

### MyMap.handleClickAddConfig()
Add config selected from config list.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickEditConfig"></a>

### MyMap.handleClickEditConfig()
Handle click edit config button.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickEndPlace"></a>

### MyMap.handleClickEndPlace()
Select no tool for placing.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickPlaceStart"></a>

### MyMap.handleClickPlaceStart()
Select place start line.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickPlaceFinish"></a>

### MyMap.handleClickPlaceFinish()
Select place finish line.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickPlaceTrackCenter"></a>

### MyMap.handleClickPlaceTrackCenter()
Select place track center.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickSubmitMapNames"></a>

### MyMap.handleClickSubmitMapNames()
User has finished naming new track or config and placing markers.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickBackMapNames"></a>

### MyMap.handleClickBackMapNames()
User back while naming, show marker selection again.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickDonePlacing"></a>

### MyMap.handleClickDonePlacing()
User is done placing markers and is ready to name track or config.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.handleClickCancelPlacing"></a>

### MyMap.handleClickCancelPlacing()
User aborted adding track or config.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.showMessageWindowIndex"></a>

### MyMap.showMessageWindowIndex(index, [zoomToFit])
Show info window with more information at coordinates with information from
the index provided.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>number</code> |  | Index of sessionData to show the data for. |
| [zoomToFit] | <code>boolean</code> | <code>false</code> | Zoom map to fit new data. |

<a name="MyMap.showMessageWindowTime"></a>

### MyMap.showMessageWindowTime(msecs, [zoomToFit])
Show info window with more information at coordinates with information from
the number of milliseconds after session start.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msecs | <code>number</code> |  | Number of milliseconds since session start to show data for. |
| [zoomToFit] | <code>boolean</code> | <code>false</code> | Zoom map to fit new data. |

<a name="MyMap.showMap"></a>

### MyMap.showMap(a, b)
Show the map with data between start and end indexes: a and b.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | Start index of sessionData to show. |
| b | <code>number</code> | End index of sessionData to show. |

<a name="MyMap.resetPolyLine"></a>

### MyMap.resetPolyLine()
Clear the polyline and hide it.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  
<a name="MyMap.getColor"></a>

### MyMap.getColor(index) ⇒ <code>string</code>
Get the color from the list at an index.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Returns**: <code>string</code> - Hex code of a color including leading `#`.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index in the color list to get. |

<a name="MyMap.changeLineColorMode"></a>

### MyMap.changeLineColorMode(mode)
Change the setting for how the polyline gets colored. Can currently be
"laps", "gforce", "altitude", or "speed".

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The mode to set the line coloring. |

<a name="MyMap.updateMyMap"></a>

### MyMap.updateMyMap([startIndex], [endIndex])
Update all markers and data shown on map to show data between start and end
index.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [startIndex] | <code>number</code> | The first index of session data to show on the map. |
| [endIndex] | <code>number</code> | The last index of session data to show on the map. |

<a name="MyMap.togglePlaybackOverlay"></a>

### MyMap.togglePlaybackOverlay([force])
Show or hide playback slider and controls.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set state or toggle with undefined. |

<a name="MyMap.togglePlayback"></a>

### MyMap.togglePlayback([force])
Start or stop playing data on map.

**Kind**: static method of [<code>MyMap</code>](#MyMap)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set state or toggle with undefined. |

<a name="Import"></a>

## Import ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  
**Todo:**: Do this.  
<a name="new_Import_new"></a>

### new Import()
Import into TraX.

<a name="Export"></a>

## Export ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Export](#Export) ⇐ [<code>TraX</code>](#TraX)
    * [new Export()](#new_Export_new)
    * [.exportGPX(sessionData, [durations], trackName, sessionName)](#Export.exportGPX)
    * [.exportJSON(sessionData, [durations], trackName, sessionName)](#Export.exportJSON)
    * [.exportFormattedCSV(sessionData, [durations], trackName, sessionName)](#Export.exportFormattedCSV)
    * [.exportRawCSV(sessionData, [durations], trackName, sessionName)](#Export.exportRawCSV)
    * [.download(filename, data)](#Export.download)

<a name="new_Export_new"></a>

### new Export()
Export from TraX.

<a name="Export.exportGPX"></a>

### Export.exportGPX(sessionData, [durations], trackName, sessionName)
Download given sessionData between durations as a GPX formatted file.

**Kind**: static method of [<code>Export</code>](#Export)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionData | <code>Object</code> | The session data to export. |
| [durations] | <code>Array.&lt;{0: number, 1: number}&gt;</code> | start and end indexes of sessionData to export. |
| trackName | <code>string</code> | The formatted name of the track to include in the file. |
| sessionName | <code>string</code> | The formatted name of the session to include in the file. |

<a name="Export.exportJSON"></a>

### Export.exportJSON(sessionData, [durations], trackName, sessionName)
Export given sessionData between durations as a raw JSON file for use in
re-importing back into TraX. Exports ALL data.

**Kind**: static method of [<code>Export</code>](#Export)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionData | <code>Object</code> | The session data to export. |
| [durations] | <code>Array.&lt;{0: number, 1: number}&gt;</code> | start and end indexes of sessionData to export. |
| trackName | <code>string</code> | The formatted name of the track to include in the file. |
| sessionName | <code>string</code> | The formatted name of the session to include in the file. |

<a name="Export.exportFormattedCSV"></a>

### Export.exportFormattedCSV(sessionData, [durations], trackName, sessionName)
Export given sessionData between durations as a CSV that can be used in
other apps.

**Kind**: static method of [<code>Export</code>](#Export)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionData | <code>Object</code> | The session data to export. |
| [durations] | <code>Array.&lt;{0: number, 1: number}&gt;</code> | start and end indexes of sessionData to export. |
| trackName | <code>string</code> | The formatted name of the track to include in the file. |
| sessionName | <code>string</code> | The formatted name of the session to include in the file. |

<a name="Export.exportRawCSV"></a>

### Export.exportRawCSV(sessionData, [durations], trackName, sessionName)
Export sessionData between durations as a CSV with raw sensor data.

**Kind**: static method of [<code>Export</code>](#Export)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionData | <code>Object</code> | The session data to export. |
| [durations] | <code>Array.&lt;{0: number, 1: number}&gt;</code> | start and end indexes of sessionData to export. |
| trackName | <code>string</code> | The formatted name of the track to include in the file. |
| sessionName | <code>string</code> | The formatted name of the session to include in the file. |

<a name="Export.download"></a>

### Export.download(filename, data)
Download data as file with given filename.

**Kind**: static method of [<code>Export</code>](#Export)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The name of the file. |
| data | <code>\*</code> | Any data that can be made into a Blob for downloading. |

<a name="Panes"></a>

## Panes
**Kind**: global class  

* [Panes](#Panes)
    * [new Panes()](#new_Panes_new)
    * [.init()](#Panes.init)
    * [.handleOpening()](#Panes.handleOpening)
    * [.handleClosing()](#Panes.handleClosing)
    * [.setCurrent(index)](#Panes.setCurrent)
    * [.nextPane()](#Panes.nextPane)
    * [.previousPane()](#Panes.previousPane)
    * [.gotoPane(index)](#Panes.gotoPane)
    * [.getPane()](#Panes.getPane) ⇒ <code>number</code>
    * [.addEventListener(name, callback)](#Panes.addEventListener)

<a name="new_Panes_new"></a>

### new Panes()
Controls a pane system for viewing data.

<a name="Panes.init"></a>

### Panes.init()
Initialize Panes

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  
<a name="Panes.handleOpening"></a>

### Panes.handleOpening()
Panes are becoming visible.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  
<a name="Panes.handleClosing"></a>

### Panes.handleClosing()
Panes are transitioning to no longer visible.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  
<a name="Panes.setCurrent"></a>

### Panes.setCurrent(index)
Sets the current index for panes but does not trigger change in panes. Used
for setting default pane.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of pane to set to. |

<a name="Panes.nextPane"></a>

### Panes.nextPane()
Go to next pane.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  
<a name="Panes.previousPane"></a>

### Panes.previousPane()
Go to previous pane.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  
<a name="Panes.gotoPane"></a>

### Panes.gotoPane(index)
Go to pane with given index.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of pane to go to. |

<a name="Panes.getPane"></a>

### Panes.getPane() ⇒ <code>number</code>
Get current pane index.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Returns**: <code>number</code> - Index of currently visible pane.  
**Access**: public  
<a name="Panes.addEventListener"></a>

### Panes.addEventListener(name, callback)
Add a listener to a Panes Event.

**Kind**: static method of [<code>Panes</code>](#Panes)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of event to listen for. |
| callback | <code>paneEventCB</code> | Function to fire when event fires. |

<a name="DataView"></a>

## DataView ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [DataView](#DataView) ⇐ [<code>TraX</code>](#TraX)
    * [new DataView()](#new_DataView_new)
    * [.Track](#DataView.Track)
        * [new DataView.Track(name, id, ownerId)](#new_DataView.Track_new)
    * [.Config](#DataView.Config)
        * [new DataView.Config(name, id, track, ownerId)](#new_DataView.Config_new)
    * [.coordAverage](#DataView.coordAverage) : <code>Object</code>
    * [.trackData](#DataView.trackData) : <code>Object</code>
    * [.trackList](#DataView.trackList) : <code>Array</code>
    * [.configList](#DataView.configList) : <code>Object.&lt;Array&gt;</code>
    * [.init()](#DataView.init)
    * [.handleOpening()](#DataView.handleOpening)
    * [.handleClosing()](#DataView.handleClosing)
    * [.requestList()](#DataView.requestList)
    * [.showSessions(setting)](#DataView.showSessions)
    * [.sortSessions(setting)](#DataView.sortSessions)
    * [.updateSessionData()](#DataView.updateSessionData)
    * [.lapListClick(num)](#DataView.lapListClick)
    * [.transformSensors(data)](#DataView.transformSensors) ⇒ <code>Object</code>
    * [.sensorsToGForce(data)](#DataView.sensorsToGForce) ⇒ <code>number</code>
    * [.fetchTrackList()](#DataView.fetchTrackList)
    * [.fetchTrackConfigList(track)](#DataView.fetchTrackConfigList)
    * [.autoPickTrack([forceUseCoord])](#DataView.autoPickTrack)
    * [.determineTrack(coord)](#DataView.determineTrack) ⇒ <code>Track</code>
    * [.changeTrack(newTrack)](#DataView.changeTrack)
    * [.changeConfig(newConfig, [norefresh])](#DataView.changeConfig)
    * [.getConfigList(track)](#DataView.getConfigList) ⇒ <code>Array</code>
    * [.toggleDataViewOverlay([force], trackId, ownerId)](#DataView.toggleDataViewOverlay)
    * [.handleClickTrackName(trackId, ownerId)](#DataView.handleClickTrackName)
    * [.handleClickConfigName(configId, ownerId)](#DataView.handleClickConfigName)
    * [.dataOverlayBack()](#DataView.dataOverlayBack)
    * [.deleteTrack(trackId, ownerId)](#DataView.deleteTrack)
    * [.editTrack(trackId, ownerId)](#DataView.editTrack)
    * [.deleteConfig(configId)](#DataView.deleteConfig)
    * [.editConfig(configId)](#DataView.editConfig)
    * [.getStartLine()](#DataView.getStartLine) ⇒ <code>Object</code>
    * [.getFinishLine()](#DataView.getFinishLine) ⇒ <code>Object</code>
    * [.getDataAtPosition(coord, [msecs], [data])](#DataView.getDataAtPosition) ⇒ <code>Object</code>
    * [.getDataAtIndex(index, data)](#DataView.getDataAtIndex) ⇒ <code>Object</code>
    * [.getTimeAtIndex(index, [data])](#DataView.getTimeAtIndex) ⇒ <code>number</code>
    * [.getDataAtTime(msecs, [data])](#DataView.getDataAtTime) ⇒ <code>Object</code>
    * [.getDataWithCoords([startIndex], [endIndex], [maxIndexes], [data])](#DataView.getDataWithCoords) ⇒ <code>Array</code>
    * [.sessionClick(sessionId, ownerId)](#DataView.sessionClick)
    * [.cancelSessionEdit()](#DataView.cancelSessionEdit)
    * [.deleteSession(sessionId, ownerId)](#DataView.deleteSession)
    * [.confirmDeleteSession(sessionId, ownerId)](#DataView.confirmDeleteSession)
    * [.editSession(sessionId, ownerId)](#DataView.editSession)
    * [.confirmRenameSession(sessionId, ownerId)](#DataView.confirmRenameSession)
    * [.getFilteredCoords(input, SWBound, NEBound)](#DataView.getFilteredCoords) ⇒ <code>Object</code>
    * [.getFilteredDurations(input)](#DataView.getFilteredDurations) ⇒ <code>Array.&lt;Array&gt;</code>
    * [.getSessionDataLength()](#DataView.getSessionDataLength) ⇒ <code>number</code>
    * [.getSessionSummary()](#DataView.getSessionSummary) ⇒ <code>Object</code>
    * [.handleDownloadClick()](#DataView.handleDownloadClick)
    * [.handleDownload2Click()](#DataView.handleDownload2Click)
    * [.handleDownload3Click()](#DataView.handleDownload3Click)
    * [.handleDownload4Click()](#DataView.handleDownload4Click)
    * [.toggleDownloadOverlay([force])](#DataView.toggleDownloadOverlay)

<a name="new_DataView_new"></a>

### new DataView()
Controls the data viewing page.

<a name="DataView.Track"></a>

### DataView.Track
Class for necessary info about a track.

**Kind**: static class of [<code>DataView</code>](#DataView)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the track. |
| id | <code>string</code> \| <code>number</code> | The id of the track. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="new_DataView.Track_new"></a>

#### new DataView.Track(name, id, ownerId)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the track. |
| id | <code>string</code> \| <code>number</code> | The id of the track. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="DataView.Config"></a>

### DataView.Config
Class for necessary info about a config.

**Kind**: static class of [<code>DataView</code>](#DataView)  
**Access**: public  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the config. |
| id | <code>number</code> \| <code>string</code> | The id of the config. |
| track | <code>TraX~DataView~Track</code> | The track this config is a child of. |
| ownerId | <code>string</code> | The id of the owner of this config. |

<a name="new_DataView.Config_new"></a>

#### new DataView.Config(name, id, track, ownerId)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the config. |
| id | <code>number</code> \| <code>string</code> | The id of the config. |
| track | <code>TraX~DataView~Track</code> | The track this config is a child of. |
| ownerId | <code>string</code> | The id of the owner of this config. |

<a name="DataView.coordAverage"></a>

### DataView.coordAverage : <code>Object</code>
Average of all coordinates received for session.

**Kind**: static property of [<code>DataView</code>](#DataView)  
**Default**: <code>{}</code>  
**Access**: public  
**Read only**: true  
<a name="DataView.trackData"></a>

### DataView.trackData : <code>Object</code>
Data about a track and it's configuration.

**Kind**: static property of [<code>DataView</code>](#DataView)  
**Default**: <code>{}</code>  
**Access**: public  
**Read only**: true  
<a name="DataView.trackList"></a>

### DataView.trackList : <code>Array</code>
List of all tracks.

**Kind**: static property of [<code>DataView</code>](#DataView)  
**Default**: <code>[]</code>  
**Access**: public  
<a name="DataView.configList"></a>

### DataView.configList : <code>Object.&lt;Array&gt;</code>
List of configs arranged by track id and user id in object.

**Kind**: static property of [<code>DataView</code>](#DataView)  
**Default**: <code>{}</code>  
**Access**: public  
<a name="DataView.init"></a>

### DataView.init()
Initialize TraX~DataView

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.handleOpening"></a>

### DataView.handleOpening()
The view just opened.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.handleClosing"></a>

### DataView.handleClosing()
The view is closing.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.requestList"></a>

### DataView.requestList()
Request list of sessions.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.showSessions"></a>

### DataView.showSessions(setting)
Folder selected by user.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| setting | <code>string</code> | Sessions to show. |

<a name="DataView.sortSessions"></a>

### DataView.sortSessions(setting)
Sort sessions based on user input.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| setting | <code>string</code> | Sorting mode to use. |

<a name="DataView.updateSessionData"></a>

### DataView.updateSessionData()
Update data and summary from newly collected session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.lapListClick"></a>

### DataView.lapListClick(num)
A lap was clicked in the lap list. It should be expanded or collapsed.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | The lap number that was selected. |

<a name="DataView.transformSensors"></a>

### DataView.transformSensors(data) ⇒ <code>Object</code>
Given raw sensor data, rectify to be correctly rotated relative to the
vehicle. Also removes Agrav.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - Acceleration relative to vehicle.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Chunk of session data to rotate the sensors to vehicle-relative coordinate system. |

<a name="DataView.sensorsToGForce"></a>

### DataView.sensorsToGForce(data) ⇒ <code>number</code>
Given an index or datapoint, calculate the magnitude of G-force at the
instant.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>number</code> - The sensor values transformed into GForce magnitude.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>number</code> \| <code>Object</code> | The index of sessionData to use, or a chunk object. |

<a name="DataView.fetchTrackList"></a>

### DataView.fetchTrackList()
Request the list of tracks from server.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.fetchTrackConfigList"></a>

### DataView.fetchTrackConfigList(track)
Request the list of configs from the server.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| track | <code>Track</code> | The track to fetch the config list of from the server. |

<a name="DataView.autoPickTrack"></a>

### DataView.autoPickTrack([forceUseCoord])
Automatically determine the closest track to data, then change selected track
to the closest track if it can be determined.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [forceUseCoord] | <code>boolean</code> | <code>false</code> | Disregard track selected in session data, and only use GPS data to determine track. |

<a name="DataView.determineTrack"></a>

### DataView.determineTrack(coord) ⇒ <code>Track</code>
Determine the closest track to the given coordinates. A maximum distance of
10km is checked.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Track</code> - The track data of the track or null if no track found.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| coord | <code>Object</code> | The coordinates to determine the closest track to. |

<a name="DataView.changeTrack"></a>

### DataView.changeTrack(newTrack)
A new track has been selected. Change relevant information to request
necessary data.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| newTrack | <code>Track</code> | The new track to select. |

<a name="DataView.changeConfig"></a>

### DataView.changeConfig(newConfig, [norefresh])
A new config has been selected. Change relevant information to request
necessary data.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newConfig | <code>Config</code> |  | The new data for the config. |
| [norefresh] | <code>boolean</code> | <code>false</code> | Should we disable fetching data from server after this. |

<a name="DataView.getConfigList"></a>

### DataView.getConfigList(track) ⇒ <code>Array</code>
Get the list of configs for the currently selected track from buffer.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Array</code> - Array of configurations or empty array if unable to find
anything.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| track | <code>Track</code> | The track information to fetch the configurations of. |

<a name="DataView.toggleDataViewOverlay"></a>

### DataView.toggleDataViewOverlay([force], trackId, ownerId)
Toggle track and config choosing overlay. Force forces open or closed.
TrackId will auto-select the track if ownerId is also set.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set value or toggle if undefined. |
| trackId | <code>string</code> | The id of the track to show as selected. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="DataView.handleClickTrackName"></a>

### DataView.handleClickTrackName(trackId, ownerId)
Track name in dataViewOverlay was selected.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> | The id of the track that was clicked. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="DataView.handleClickConfigName"></a>

### DataView.handleClickConfigName(configId, ownerId)
Config name was selected in dataViewOverlay.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| configId | <code>string</code> | The id of the config that was clicked. |
| ownerId | <code>string</code> | The id of the owner of the config. |

<a name="DataView.dataOverlayBack"></a>

### DataView.dataOverlayBack()
The back button was pressed in dataViewOverlay.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.deleteTrack"></a>

### DataView.deleteTrack(trackId, ownerId)
Deletes a track from a user after confirmation from user.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> | The id of the track to delete. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="DataView.editTrack"></a>

### DataView.editTrack(trackId, ownerId)
Renames a user's track to their given input.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> | The id of track to edit. |
| ownerId | <code>string</code> | The id of the owner of the track data. |

<a name="DataView.deleteConfig"></a>

### DataView.deleteConfig(configId)
Deletes a user's track config after confirmation.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| configId | <code>string</code> | The id of the config to delete. |

<a name="DataView.editConfig"></a>

### DataView.editConfig(configId)
Renames a user's track config.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| configId | <code>string</code> | The id of the config to edit. |

<a name="DataView.getStartLine"></a>

### DataView.getStartLine() ⇒ <code>Object</code>
Gets the start line information for the current track config.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - The start line data.  
**Access**: public  
<a name="DataView.getFinishLine"></a>

### DataView.getFinishLine() ⇒ <code>Object</code>
Gets the finish line information for the current track config.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - The finish line data.  
**Access**: public  
<a name="DataView.getDataAtPosition"></a>

### DataView.getDataAtPosition(coord, [msecs], [data]) ⇒ <code>Object</code>
Returns datapoint closest to given coordinates and after msecs if given.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - The data at the first found position.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| coord | <code>Object</code> |  | Position to look for. |
| [msecs] | <code>number</code> | <code>0</code> | The milliseconds since session start to look after. |
| [data] | <code>Array</code> | <code>sessionData</code> | The data to look through. |

<a name="DataView.getDataAtIndex"></a>

### DataView.getDataAtIndex(index, data) ⇒ <code>Object</code>
Gets the data at a certain index. Also linearly interpolates GPS data for
easier calculations.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - The formatted chunk from the given index.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index of data to get the data for. |
| data | <code>Array</code> | The data to look through. |

<a name="DataView.getTimeAtIndex"></a>

### DataView.getTimeAtIndex(index, [data]) ⇒ <code>number</code>
Gets the milliseconds since session start of a given index.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>number</code> - Milliseconds since session start.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>number</code> |  | The index of data to look at. |
| [data] | <code>Object</code> | <code>sessionData</code> | The data to look at. |

<a name="DataView.getDataAtTime"></a>

### DataView.getDataAtTime(msecs, [data]) ⇒ <code>Object</code>
Returns the interpolated data at a certain number of milliseconds after
session start.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - The chunk at the specified time.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msecs | <code>number</code> |  | The time since session start in milliseconds. |
| [data] | <code>Array</code> | <code>sessionData</code> | The data to get the data from. |

<a name="DataView.getDataWithCoords"></a>

### DataView.getDataWithCoords([startIndex], [endIndex], [maxIndexes], [data]) ⇒ <code>Array</code>
Returns all data between start and end indexes that includes gps coordinates.
MaxIndexes can limit the number of returned results.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Array</code> - Only sessionData that had defined GPS data.  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [startIndex] | <code>number</code> | <code>0</code> | The index to start looking for data. |
| [endIndex] | <code>number</code> |  | The last index to look for data. |
| [maxIndexes] | <code>number</code> |  | The maximum number of matches to find. |
| [data] | <code>Array</code> | <code>sessionData</code> | The data to look through. Defaults to sessionData. |

<a name="DataView.sessionClick"></a>

### DataView.sessionClick(sessionId, ownerId)
Session is clicked, request data from server.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | The id of the session that was selected. |
| ownerId | <code>string</code> | The id of the owner of the session to select. |

<a name="DataView.cancelSessionEdit"></a>

### DataView.cancelSessionEdit()
Renaming session was cancelled.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.deleteSession"></a>

### DataView.deleteSession(sessionId, ownerId)
User requested to delete session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | The id of the session to delete. |
| ownerId | <code>string</code> | the id of the owner of the session to delete. |

<a name="DataView.confirmDeleteSession"></a>

### DataView.confirmDeleteSession(sessionId, ownerId)
User confirmed deleting session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | The id of the session to delete. |
| ownerId | <code>string</code> | The id of the owner of the session to delete. |

<a name="DataView.editSession"></a>

### DataView.editSession(sessionId, ownerId)
User requested to rename session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | The id of the session to rename. |
| ownerId | <code>string</code> | The id of the owner of the session to rename. |

<a name="DataView.confirmRenameSession"></a>

### DataView.confirmRenameSession(sessionId, ownerId)
User confirmed renaming session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | The id of the session to rename. |
| ownerId | <code>string</code> | The id of the owner of the session to rename. |

<a name="DataView.getFilteredCoords"></a>

### DataView.getFilteredCoords(input, SWBound, NEBound) ⇒ <code>Object</code>
Rename coordinate data to more common format and determine bounds of data.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - Filtered
coordinates and their bounding box.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Array</code> | sessionData to filter. |
| SWBound | <code>Object</code> | Southwestern bound of coordinates. |
| NEBound | <code>Object</code> | Northeastern bound of coordinates. |

<a name="DataView.getFilteredDurations"></a>

### DataView.getFilteredDurations(input) ⇒ <code>Array.&lt;Array&gt;</code>
Get data divided into each duration (multi-session).

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Array.&lt;Array&gt;</code> - Array of sections of input durations.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>Array</code> | Input session data chunks to split into durations. |

<a name="DataView.getSessionDataLength"></a>

### DataView.getSessionDataLength() ⇒ <code>number</code>
Returns number of elements currently in sessionData.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>number</code> - Number of chunks in sessionData.  
**Access**: public  
<a name="DataView.getSessionSummary"></a>

### DataView.getSessionSummary() ⇒ <code>Object</code>
Returns summary of session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Returns**: <code>Object</code> - Summary of current session.  
**Access**: public  
<a name="DataView.handleDownloadClick"></a>

### DataView.handleDownloadClick()
User clicked download session as GPX.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.handleDownload2Click"></a>

### DataView.handleDownload2Click()
User clicked download session as JSON raw.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.handleDownload3Click"></a>

### DataView.handleDownload3Click()
User clicked download session as CSV raw.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.handleDownload4Click"></a>

### DataView.handleDownload4Click()
User clicked download session as CSV formatted.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  
<a name="DataView.toggleDownloadOverlay"></a>

### DataView.toggleDownloadOverlay([force])
Toggle the overlay to download a session.

**Kind**: static method of [<code>DataView</code>](#DataView)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set value or toggle with undefined. |

<a name="Video"></a>

## Video ⇐ [<code>TraX</code>](#TraX)
**Kind**: global class  
**Extends**: [<code>TraX</code>](#TraX)  

* [Video](#Video) ⇐ [<code>TraX</code>](#TraX)
    * [new Video()](#new_Video_new)
    * [new Video()](#new_Video_new)
    * [.init()](#Video.init)
    * [.getPerms([silent])](#Video.getPerms)
    * [.setPerms(perm)](#Video.setPerms)
    * [.startRecording()](#Video.startRecording) ⇒ <code>boolean</code>
    * [.stopRecording([preventDelayedTrigger])](#Video.stopRecording)
    * [.toggleVideo([force])](#Video.toggleVideo)
    * [.init()](#Video.init)
    * [.getPerms([silent])](#Video.getPerms)
    * [.setPerms(perm)](#Video.setPerms)
    * [.startRecording()](#Video.startRecording) ⇒ <code>boolean</code>
    * [.stopRecording()](#Video.stopRecording)
    * [.pauseRecording()](#Video.pauseRecording)
    * [.getURL()](#Video.getURL) ⇒ <code>string</code>
    * [.toggleVideo([force])](#Video.toggleVideo)

<a name="new_Video_new"></a>

### new Video()
Manages phone cameras, capturing the media, and then recording the media to
the client's device.

This may NOT be used with the other Video class.

<a name="new_Video_new"></a>

### new Video()
Manages phone cameras, capturing the media, and then streaming the media to
server.

This may NOT be used with the other Video class.

<a name="Video.init"></a>

### Video.init()
Initialize TraX~Video

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.getPerms"></a>

### Video.getPerms([silent])
Check if we have permission to edit user's data. Unised for now until video
streaming is fully implemented.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [silent] | <code>boolean</code> | <code>false</code> | Reduce messages shown to user. |

<a name="Video.setPerms"></a>

### Video.setPerms(perm)
Set that we have perms or not and update UI. Unused for now until video
streaming is fully implemented.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| perm | <code>boolean</code> | Do we have permission. |

<a name="Video.startRecording"></a>

### Video.startRecording() ⇒ <code>boolean</code>
Start buffering or streaming video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>boolean</code> - Whether recording actually started or not.  
**Access**: public  
<a name="Video.stopRecording"></a>

### Video.stopRecording([preventDelayedTrigger])
Stop streaming or buffering video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [preventDelayedTrigger] | <code>boolean</code> | <code>false</code> | Don't automatically start downloading delayed downloads. |

<a name="Video.toggleVideo"></a>

### Video.toggleVideo([force])
Toggle the visibility of cameras. Also opens and closes streams of video.
Must be open in order to record video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set video state or toggle with undefined. |

<a name="Video.init"></a>

### Video.init()
Initialize Video module.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.getPerms"></a>

### Video.getPerms([silent])
Check if we have permission to edit user's data.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [silent] | <code>boolean</code> | <code>false</code> | Reduce messages sent to user. |

<a name="Video.setPerms"></a>

### Video.setPerms(perm)
Set that we have perms or not and update UI.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| perm | <code>boolean</code> | Whether we have permission or not. |

<a name="Video.startRecording"></a>

### Video.startRecording() ⇒ <code>boolean</code>
Start buffering or streaming video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>boolean</code> - Whether recording actually started or not.  
**Access**: public  
<a name="Video.stopRecording"></a>

### Video.stopRecording()
Stop streaming or buffering video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
<a name="Video.pauseRecording"></a>

### Video.pauseRecording()
Pause a recording without completely eding the file.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  
**Todo:**: Remove?  
<a name="Video.getURL"></a>

### Video.getURL() ⇒ <code>string</code>
Get URL where we can find the saved video if it was streamed to a server.

**Kind**: static method of [<code>Video</code>](#Video)  
**Returns**: <code>string</code> - URL of where to watch the current video being streamed.  
**Access**: public  
<a name="Video.toggleVideo"></a>

### Video.toggleVideo([force])
Toggle the visibility of cameras. Also opens and closes streams of video.
Must be open in order to record video.

**Kind**: static method of [<code>Video</code>](#Video)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set video state or toggle with undefined. |

<a name="Agrav"></a>

## Agrav : <code>number</code>
Absolute acceleration due to gravity. (m/s)

**Kind**: global constant  
**Default**: <code>9.80665</code>  
<a name="maxGapInSession"></a>

## maxGapInSession : <code>number</code>
Milliseconds between timestamps to assume isMultiSession.

**Kind**: global constant  
<a name="minLapTime"></a>

## minLapTime : <code>number</code>
Minimum milliseconds a lap is allowed to be.

**Kind**: global constant  
**Default**: <code>7000</code>  
<a name="noStatus"></a>

## noStatus : <code>number</code>
No relationship

**Kind**: global constant  
<a name="oneRequestStatus"></a>

## oneRequestStatus : <code>number</code>
User 1 requested to be friends.

**Kind**: global constant  
**Default**: <code>0</code>  
<a name="twoRequestStatus"></a>

## twoRequestStatus : <code>number</code>
User 2 requested to be friends.

**Kind**: global constant  
**Default**: <code>1</code>  
<a name="friendStatus"></a>

## friendStatus : <code>number</code>
Users are friends.

**Kind**: global constant  
**Default**: <code>2</code>  
<a name="oneBlockedStatus"></a>

## oneBlockedStatus : <code>number</code>
User 1 blocked user 2.

**Kind**: global constant  
**Default**: <code>3</code>  
<a name="twoBlockedStatus"></a>

## twoBlockedStatus : <code>number</code>
User 2 blocked user 1.

**Kind**: global constant  
**Default**: <code>4</code>  
<a name="bothBlockedStatus"></a>

## bothBlockedStatus : <code>number</code>
Both users blocked eachother.

**Kind**: global constant  
**Default**: <code>5</code>  
<a name="onePullRequestCrew"></a>

## onePullRequestCrew : <code>number</code>
User 1 requested User 2 to be crew for 1.

**Kind**: global constant  
**Default**: <code>6</code>  
<a name="onePushRequestCrew"></a>

## onePushRequestCrew : <code>number</code>
User 1 requested to be crew for 2.

**Kind**: global constant  
**Default**: <code>7</code>  
<a name="twoPushRequestCrew"></a>

## twoPushRequestCrew : <code>number</code>
user 2 requested 1 to be crew for 2.

**Kind**: global constant  
**Default**: <code>8</code>  
<a name="twoPullRequestCrew"></a>

## twoPullRequestCrew : <code>number</code>
User 2 requested to be crew for 1.

**Kind**: global constant  
**Default**: <code>9</code>  
<a name="oneCrewStatus"></a>

## oneCrewStatus : <code>number</code>
User 1 is crew for 2.

**Kind**: global constant  
**Default**: <code>10</code>  
<a name="twoCrewStatus"></a>

## twoCrewStatus : <code>number</code>
User 2 is crew for 1.

**Kind**: global constant  
**Default**: <code>11</code>  
