Auto-Generated from JSDocs.
## Modules

<dl>
<dt><a href="#module_ScriptLoader">ScriptLoader</a></dt>
<dd><p>Loads page&#39;s necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.</p>
</dd>
<dt><a href="#module_TraXServer">TraXServer</a></dt>
<dd><p>The server side of TraX.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#addSourceToVideo">addSourceToVideo(element, type, dataURI)</a></dt>
<dd><p>Add data to for video to play.</p>
</dd>
<dt><a href="#keepAwakeSetting">keepAwakeSetting(mode)</a></dt>
<dd><p>Set method for keeping device awake.</p>
</dd>
<dt><a href="#keepAwake">keepAwake(setting)</a></dt>
<dd><p>Enable/Disable keeping device awake.
TODO: Fix pageload leak.</p>
</dd>
</dl>

<a name="module_ScriptLoader"></a>

## ScriptLoader
Loads page's necessary scripts after page has loaded to help with
initial load times, and possibly to later allow for better caching control.

<a name="module_TraXServer"></a>

## TraXServer
The server side of TraX.


* [TraXServer](#module_TraXServer)
    * [~TraX](#module_TraXServer..TraX)
        * _static_
            * [.togglePause([force])](#module_TraXServer..TraX.togglePause)
            * [.init()](#module_TraXServer..TraX.init)
            * [.requestFilesize()](#module_TraXServer..TraX.requestFilesize)
            * [.setURLOption(option, setting)](#module_TraXServer..TraX.setURLOption)
            * [.getVersion()](#module_TraXServer..TraX.getVersion) ⇒ <code>string</code>
            * [.sessionTrackNameChange()](#module_TraXServer..TraX.sessionTrackNameChange)
            * [.sessionConfigNameChange()](#module_TraXServer..TraX.sessionConfigNameChange)
            * [.PRINT()](#module_TraXServer..TraX.PRINT)
            * [.toggleRealtimeView([force])](#module_TraXServer..TraX.toggleRealtimeView)
            * [.toggleDebug([isDebug])](#module_TraXServer..TraX.toggleDebug)
            * [.toggleStatus()](#module_TraXServer..TraX.toggleStatus)
            * [.changeUpdateFreq()](#module_TraXServer..TraX.changeUpdateFreq)
            * [.toggleMap()](#module_TraXServer..TraX.toggleMap)
            * [.toggleOptionsMenu([force])](#module_TraXServer..TraX.toggleOptionsMenu)
            * [.toggleFriendsView([force])](#module_TraXServer..TraX.toggleFriendsView)
            * [.sessionInputChange()](#module_TraXServer..TraX.sessionInputChange)
            * [.handleClickBigButton()](#module_TraXServer..TraX.handleClickBigButton)
            * [.handleClickTimers()](#module_TraXServer..TraX.handleClickTimers)
            * [.handleClickCustom()](#module_TraXServer..TraX.handleClickCustom)
            * [.triggerHUDFullscreen()](#module_TraXServer..TraX.triggerHUDFullscreen)
            * [.releaseHUDFullscreen()](#module_TraXServer..TraX.releaseHUDFullscreen)
            * [.toggleHUDFullscreen()](#module_TraXServer..TraX.toggleHUDFullscreen)
            * [.addFriend()](#module_TraXServer..TraX.addFriend)
            * [.removeFriend(id)](#module_TraXServer..TraX.removeFriend)
            * [.declineFriend(id)](#module_TraXServer..TraX.declineFriend)
            * [.acceptFriend(id)](#module_TraXServer..TraX.acceptFriend)
            * [.blockFriend(id)](#module_TraXServer..TraX.blockFriend)
            * [.unblockUser(id)](#module_TraXServer..TraX.unblockUser)
            * [.copyFriendLink()](#module_TraXServer..TraX.copyFriendLink)
            * [.handleClickBluetoothRefresh()](#module_TraXServer..TraX.handleClickBluetoothRefresh)
            * [.leaveDataView()](#module_TraXServer..TraX.leaveDataView)
        * _inner_
            * [~patreonTiers](#module_TraXServer..TraX..patreonTiers) : <code>Array</code> ℗
            * [~parseCookies(headers)](#module_TraXServer..TraX..parseCookies) ⇒ <code>object</code>
            * [~updatePatreonTiers()](#module_TraXServer..TraX..updatePatreonTiers) ℗
            * [~setFriendRelation(user, friend, relation, exists, callback)](#module_TraXServer..TraX..setFriendRelation)
            * [~checkIfFriends(user, friend, callback)](#module_TraXServer..TraX..checkIfFriends)
            * [~checkFilePerms(filename, userId, otherId, callback)](#module_TraXServer..TraX..checkFilePerms)
            * [~checkFriendFilePerms(filename, userId, otherId, callback)](#module_TraXServer..TraX..checkFriendFilePerms)
            * [~appendChunk(filename, chunkId, buffer, socket)](#module_TraXServer..TraX..appendChunk)
            * [~forwardChunk(userId, chunkId, buffer, [isPublic])](#module_TraXServer..TraX..forwardChunk)
            * [~trackIdsToNames(idArray, callback)](#module_TraXServer..TraX..trackIdsToNames)
            * [~getFriendsList(userId, relation, callback)](#module_TraXServer..TraX..getFriendsList)
            * [~getFriendRelation(user, friend, callback)](#module_TraXServer..TraX..getFriendRelation)
            * [~updateVersionNum()](#module_TraXServer..TraX..updateVersionNum)
            * [~sendVersionToAll()](#module_TraXServer..TraX..sendVersionToAll)
    * [~connectSQL()](#module_TraXServer..connectSQL) ℗
    * [~handler(req, res)](#module_TraXServer..handler) ℗
    * [~permCallback](#module_TraXServer..permCallback) : <code>function</code>
    * [~basicCallback](#module_TraXServer..basicCallback) : <code>function</code>
    * [~rowCallback](#module_TraXServer..rowCallback) : <code>function</code>

<a name="module_TraXServer..TraX"></a>

### TraXServer~TraX
Manages all client connections and requests. The entire server
side of TraX.

**Kind**: inner class of [<code>TraXServer</code>](#module_TraXServer)  

* [~TraX](#module_TraXServer..TraX)
    * _static_
        * [.togglePause([force])](#module_TraXServer..TraX.togglePause)
        * [.init()](#module_TraXServer..TraX.init)
        * [.requestFilesize()](#module_TraXServer..TraX.requestFilesize)
        * [.setURLOption(option, setting)](#module_TraXServer..TraX.setURLOption)
        * [.getVersion()](#module_TraXServer..TraX.getVersion) ⇒ <code>string</code>
        * [.sessionTrackNameChange()](#module_TraXServer..TraX.sessionTrackNameChange)
        * [.sessionConfigNameChange()](#module_TraXServer..TraX.sessionConfigNameChange)
        * [.PRINT()](#module_TraXServer..TraX.PRINT)
        * [.toggleRealtimeView([force])](#module_TraXServer..TraX.toggleRealtimeView)
        * [.toggleDebug([isDebug])](#module_TraXServer..TraX.toggleDebug)
        * [.toggleStatus()](#module_TraXServer..TraX.toggleStatus)
        * [.changeUpdateFreq()](#module_TraXServer..TraX.changeUpdateFreq)
        * [.toggleMap()](#module_TraXServer..TraX.toggleMap)
        * [.toggleOptionsMenu([force])](#module_TraXServer..TraX.toggleOptionsMenu)
        * [.toggleFriendsView([force])](#module_TraXServer..TraX.toggleFriendsView)
        * [.sessionInputChange()](#module_TraXServer..TraX.sessionInputChange)
        * [.handleClickBigButton()](#module_TraXServer..TraX.handleClickBigButton)
        * [.handleClickTimers()](#module_TraXServer..TraX.handleClickTimers)
        * [.handleClickCustom()](#module_TraXServer..TraX.handleClickCustom)
        * [.triggerHUDFullscreen()](#module_TraXServer..TraX.triggerHUDFullscreen)
        * [.releaseHUDFullscreen()](#module_TraXServer..TraX.releaseHUDFullscreen)
        * [.toggleHUDFullscreen()](#module_TraXServer..TraX.toggleHUDFullscreen)
        * [.addFriend()](#module_TraXServer..TraX.addFriend)
        * [.removeFriend(id)](#module_TraXServer..TraX.removeFriend)
        * [.declineFriend(id)](#module_TraXServer..TraX.declineFriend)
        * [.acceptFriend(id)](#module_TraXServer..TraX.acceptFriend)
        * [.blockFriend(id)](#module_TraXServer..TraX.blockFriend)
        * [.unblockUser(id)](#module_TraXServer..TraX.unblockUser)
        * [.copyFriendLink()](#module_TraXServer..TraX.copyFriendLink)
        * [.handleClickBluetoothRefresh()](#module_TraXServer..TraX.handleClickBluetoothRefresh)
        * [.leaveDataView()](#module_TraXServer..TraX.leaveDataView)
    * _inner_
        * [~patreonTiers](#module_TraXServer..TraX..patreonTiers) : <code>Array</code> ℗
        * [~parseCookies(headers)](#module_TraXServer..TraX..parseCookies) ⇒ <code>object</code>
        * [~updatePatreonTiers()](#module_TraXServer..TraX..updatePatreonTiers) ℗
        * [~setFriendRelation(user, friend, relation, exists, callback)](#module_TraXServer..TraX..setFriendRelation)
        * [~checkIfFriends(user, friend, callback)](#module_TraXServer..TraX..checkIfFriends)
        * [~checkFilePerms(filename, userId, otherId, callback)](#module_TraXServer..TraX..checkFilePerms)
        * [~checkFriendFilePerms(filename, userId, otherId, callback)](#module_TraXServer..TraX..checkFriendFilePerms)
        * [~appendChunk(filename, chunkId, buffer, socket)](#module_TraXServer..TraX..appendChunk)
        * [~forwardChunk(userId, chunkId, buffer, [isPublic])](#module_TraXServer..TraX..forwardChunk)
        * [~trackIdsToNames(idArray, callback)](#module_TraXServer..TraX..trackIdsToNames)
        * [~getFriendsList(userId, relation, callback)](#module_TraXServer..TraX..getFriendsList)
        * [~getFriendRelation(user, friend, callback)](#module_TraXServer..TraX..getFriendRelation)
        * [~updateVersionNum()](#module_TraXServer..TraX..updateVersionNum)
        * [~sendVersionToAll()](#module_TraXServer..TraX..sendVersionToAll)

<a name="module_TraXServer..TraX.togglePause"></a>

#### TraX.togglePause([force])
Toggle recording of data.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force state, or toggle with undefined. |

<a name="module_TraXServer..TraX.init"></a>

#### TraX.init()
Initialize script

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.requestFilesize"></a>

#### TraX.requestFilesize()
Request total storage size the user has on server.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.setURLOption"></a>

#### TraX.setURLOption(option, setting)
Set query option in URL.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>string</code> | The key name. |
| setting | <code>string</code> | The key value. |

<a name="module_TraXServer..TraX.getVersion"></a>

#### TraX.getVersion() ⇒ <code>string</code>
Returns current client version.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Returns**: <code>string</code> - Current version.  
**Access**: public  
<a name="module_TraXServer..TraX.sessionTrackNameChange"></a>

#### TraX.sessionTrackNameChange()
Dropdown menu for track name changed.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.sessionConfigNameChange"></a>

#### TraX.sessionConfigNameChange()
Dropdown menu for config name changed.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.PRINT"></a>

#### TraX.PRINT()
Print stored lap data to console.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.toggleRealtimeView"></a>

#### TraX.toggleRealtimeView([force])
Toggle the live data view. If force is set to true or false it will force the
UI open or closed.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Set view state or toggle if undefined. |

<a name="module_TraXServer..TraX.toggleDebug"></a>

#### TraX.toggleDebug([isDebug])
Toggle the debug menu open or closed.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [isDebug] | <code>boolean</code> | Sets debug mode, or toggles if undefined. |

<a name="module_TraXServer..TraX.toggleStatus"></a>

#### TraX.toggleStatus()
Toggle the status light UI.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.changeUpdateFreq"></a>

#### TraX.changeUpdateFreq()
Called when user changes save frequency dropdown.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.toggleMap"></a>

#### TraX.toggleMap()
Toggle the friendmap visibility.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.toggleOptionsMenu"></a>

#### TraX.toggleOptionsMenu([force])
Toggle the options menu visibility.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force menu state or undefined to toggle. |

<a name="module_TraXServer..TraX.toggleFriendsView"></a>

#### TraX.toggleFriendsView([force])
Toggle the friends view/manager visibility.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | Force view to state, or undefined to toggle. |

<a name="module_TraXServer..TraX.sessionInputChange"></a>

#### TraX.sessionInputChange()
Session name changed in input box.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.handleClickBigButton"></a>

#### TraX.handleClickBigButton()
User chose HUD 0, big button.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.handleClickTimers"></a>

#### TraX.handleClickTimers()
User chose HUD 1, realtime timers.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.handleClickCustom"></a>

#### TraX.handleClickCustom()
User chose HUD 2, custom.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.triggerHUDFullscreen"></a>

#### TraX.triggerHUDFullscreen()
Bring HUD to fullscreen to remove distractions.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.releaseHUDFullscreen"></a>

#### TraX.releaseHUDFullscreen()
Exit fullscreen.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.toggleHUDFullscreen"></a>

#### TraX.toggleHUDFullscreen()
Toggle fullscreen HUD state.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.addFriend"></a>

#### TraX.addFriend()
Add friend button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.removeFriend"></a>

#### TraX.removeFriend(id)
Remove friend button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of friend to remove as friend. |

<a name="module_TraXServer..TraX.declineFriend"></a>

#### TraX.declineFriend(id)
Decline friend request button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to decline friend request. |

<a name="module_TraXServer..TraX.acceptFriend"></a>

#### TraX.acceptFriend(id)
Accept friend request button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to accept friend request. |

<a name="module_TraXServer..TraX.blockFriend"></a>

#### TraX.blockFriend(id)
Block user button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of friend to block. |

<a name="module_TraXServer..TraX.unblockUser"></a>

#### TraX.unblockUser(id)
Unblock user button clicked.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of user to unblock. |

<a name="module_TraXServer..TraX.copyFriendLink"></a>

#### TraX.copyFriendLink()
Clicked copy link button on account for sharing.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.handleClickBluetoothRefresh"></a>

#### TraX.handleClickBluetoothRefresh()
Click add bluetooth device.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX.leaveDataView"></a>

#### TraX.leaveDataView()
Go to previous page.

**Kind**: static method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: public  
<a name="module_TraXServer..TraX..patreonTiers"></a>

#### TraX~patreonTiers : <code>Array</code> ℗
Stores the current Patreon tier benefits read from patreon.json

**Kind**: inner property of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: private  
<a name="module_TraXServer..TraX..parseCookies"></a>

#### TraX~parseCookies(headers) ⇒ <code>object</code>
Get list of cookies from headers.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Returns**: <code>object</code> - list Object of key-pairs for each cookie.  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Headers from socket handshake or request. |

<a name="module_TraXServer..TraX..updatePatreonTiers"></a>

#### TraX~updatePatreonTiers() ℗
Read the Patreon tier beneits from patreon.json

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  
**Access**: private  
**See**: {patreonTiers}  
<a name="module_TraXServer..TraX..setFriendRelation"></a>

#### TraX~setFriendRelation(user, friend, relation, exists, callback)
Sets two users relation in the database.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | User id of the current user. |
| friend | <code>string</code> | User id of the other user in the relationship. |
| relation | <code>number</code> | Relation between the users we are setting. |
| exists | <code>bool</code> | If the users already exist in the table. |
| callback | <code>basicCallback</code> |  |

<a name="module_TraXServer..TraX..checkIfFriends"></a>

#### TraX~checkIfFriends(user, friend, callback)
Checks if the two users are friends.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The current user's id. |
| friend | <code>string</code> | The other user's id we are comparing. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServer..TraX..checkFilePerms"></a>

#### TraX~checkFilePerms(filename, userId, otherId, callback)
Checks if the given userId has permission to view the given filename.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id that must be provided if the filename is in a different user's userdata. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServer..TraX..checkFriendFilePerms"></a>

#### TraX~checkFriendFilePerms(filename, userId, otherId, callback)
Checks if the given userId has permission to view otherId's data.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id to check if we have perms. |
| callback | <code>permCallback</code> |  |

<a name="module_TraXServer..TraX..appendChunk"></a>

#### TraX~appendChunk(filename, chunkId, buffer, socket)
Appends a given session chunk to its file. Responds to socket.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The base name of the file we are writing to. |
| chunkId | <code>string</code> | The id of the chunk we are writing in order to tell the client the status of this chunk. |
| buffer | <code>string</code> | The data to write to the file. |
| socket | <code>socket</code> | The socket.io socket to respond to with status updates. |

<a name="module_TraXServer..TraX..forwardChunk"></a>

#### TraX~forwardChunk(userId, chunkId, buffer, [isPublic])
Forwards received chunk data to all clients requesting live data.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | The Id of the user sending the data. |
| chunkId | <code>string</code> |  | The id of the chunk we are forwarding. |
| buffer | <code>string</code> |  | The data to forward. |
| [isPublic] | <code>boolean</code> | <code>false</code> | Should this stream be sent to everybody not just friends? |

<a name="module_TraXServer..TraX..trackIdsToNames"></a>

#### TraX~trackIdsToNames(idArray, callback)
Takes an array of directories describing a track, and returns an array of
objects of the names and ids of the tracks.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| idArray | <code>array</code> | The array of absolute paths to tracks and configs. |
| callback | <code>callback</code> | Callback containing only the returned object as an argument. |

<a name="module_TraXServer..TraX..getFriendsList"></a>

#### TraX~getFriendsList(userId, relation, callback)
Gets list of all users with relation to userId.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The id of the user we are looking up. |
| relation | <code>number</code> | Relation number to filter for. |
| callback | <code>rowCallback</code> |  |

<a name="module_TraXServer..TraX..getFriendRelation"></a>

#### TraX~getFriendRelation(user, friend, callback)
Gets the relation between two users.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The id of the user we are looking up. |
| friend | <code>string</code> | The id of the other user we are comparing. |
| callback | <code>rowCallback</code> |  |

<a name="module_TraXServer..TraX..updateVersionNum"></a>

#### TraX~updateVersionNum()
Checks the versionNumFile for updated current app version.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  
<a name="module_TraXServer..TraX..sendVersionToAll"></a>

#### TraX~sendVersionToAll()
Sends the version number to all connected clients.

**Kind**: inner method of [<code>TraX</code>](#module_TraXServer..TraX)  
<a name="module_TraXServer..connectSQL"></a>

### TraXServer~connectSQL() ℗
Connect to SQL server. Only used for initial connection test or to reconnect
on fatal error.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServer)  
**Access**: private  
<a name="module_TraXServer..handler"></a>

### TraXServer~handler(req, res) ℗
Handler for all http requests. Should never be called unless something broke.

**Kind**: inner method of [<code>TraXServer</code>](#module_TraXServer)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | Client request. |
| res | <code>http.ServerResponse</code> | Server response. |

<a name="module_TraXServer..permCallback"></a>

### TraXServer~permCallback : <code>function</code>
Response from checking a user's permissions.

**Kind**: inner typedef of [<code>TraXServer</code>](#module_TraXServer)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>boolean</code> \| <code>number</code> | True or >0 if has perms. Or number designating level of permission. |

<a name="module_TraXServer..basicCallback"></a>

### TraXServer~basicCallback : <code>function</code>
Basic callback with only error response.

**Kind**: inner typedef of [<code>TraXServer</code>](#module_TraXServer)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |

<a name="module_TraXServer..rowCallback"></a>

### TraXServer~rowCallback : <code>function</code>
Response from a query to a database.

**Kind**: inner typedef of [<code>TraXServer</code>](#module_TraXServer)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>array</code> | Array of rows as objects. |

<a name="addSourceToVideo"></a>

## addSourceToVideo(element, type, dataURI)
Add data to for video to play.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | The parent video element to attach the source to. |
| type | <code>string</code> | The mimeType of the source. |
| dataURI | <code>string</code> | The src value. |

<a name="keepAwakeSetting"></a>

## keepAwakeSetting(mode)
Set method for keeping device awake.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The method to use. |

<a name="keepAwake"></a>

## keepAwake(setting)
Enable/Disable keeping device awake.
TODO: Fix pageload leak.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| setting | <code>boolean</code> | Enable or Disable. |

