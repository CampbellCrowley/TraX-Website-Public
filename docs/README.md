Auto-Generated from JSDocs.
## Members

<dl>
<dt><a href="#patreonTiers">patreonTiers</a> : <code>Array</code> ℗</dt>
<dd><p>Stores the current Patreon tier benefits read from patreon.json</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#connectSQL">connectSQL()</a> ℗</dt>
<dd><p>Connect to SQL server. Only used for initial connection test or to reconnect
on fatal error.</p>
</dd>
<dt><a href="#handler">handler(req, res)</a> ℗</dt>
<dd><p>Handler for all http requests. Should never be called unless something broke.</p>
</dd>
<dt><a href="#parseCookies">parseCookies(headers)</a> ⇒ <code>object</code></dt>
<dd><p>Get list of cookies from headers.</p>
</dd>
<dt><a href="#updatePatreonTiers">updatePatreonTiers()</a> ℗</dt>
<dd><p>Read the Patreon tier beneits from patreon.json</p>
</dd>
<dt><a href="#setFriendRelation">setFriendRelation(user, friend, relation, exists, callback)</a></dt>
<dd><p>Sets two users relation in the database.</p>
</dd>
<dt><a href="#checkIfFriends">checkIfFriends(user, friend, callback)</a></dt>
<dd><p>Checks if the two users are friends.</p>
</dd>
<dt><a href="#checkFilePerms">checkFilePerms(filename, userId, otherId, callback)</a></dt>
<dd><p>Checks if the given userId has permission to view the given filename.</p>
</dd>
<dt><a href="#checkFriendFilePerms">checkFriendFilePerms(filename, userId, otherId, callback)</a></dt>
<dd><p>Checks if the given userId has permission to view otherId&#39;s data.</p>
</dd>
<dt><a href="#appendChunk">appendChunk(filename, chunkId, buffer, socket)</a></dt>
<dd><p>Appends a given session chunk to its file. Responds to socket.</p>
</dd>
<dt><a href="#forwardChunk">forwardChunk(userId, chunkId, buffer, [isPublic])</a></dt>
<dd><p>Forwards received chunk data to all clients requesting live data.</p>
</dd>
<dt><a href="#trackIdsToNames">trackIdsToNames(idArray, callback)</a></dt>
<dd><p>Takes an array of directories describing a track, and returns an array of
objects of the names and ids of the tracks.</p>
</dd>
<dt><a href="#updateVersionNum">updateVersionNum()</a></dt>
<dd><p>Checks the versionNumFile for updated current app version.</p>
</dd>
<dt><a href="#sendVersionToAll">sendVersionToAll()</a></dt>
<dd><p>Sends the version number to all connected clients.</p>
</dd>
<dt><a href="#getFriendsList">getFriendsList(userId, relation, callback)</a></dt>
<dd><p>Gets list of all users with relation to userId.</p>
</dd>
<dt><a href="#getFriendRelation">getFriendRelation(user, friend, callback)</a></dt>
<dd><p>Gets the relation between two users.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#permCallback">permCallback</a> : <code>function</code></dt>
<dd><p>Response from checking a user&#39;s permissions.</p>
</dd>
<dt><a href="#basicCallback">basicCallback</a> : <code>function</code></dt>
<dd><p>Basic callback with only error response.</p>
</dd>
<dt><a href="#rowCallback">rowCallback</a> : <code>function</code></dt>
<dd><p>Response from a query to a database.</p>
</dd>
</dl>

<a name="patreonTiers"></a>

## patreonTiers : <code>Array</code> ℗
Stores the current Patreon tier benefits read from patreon.json

**Kind**: global variable  
**Access**: private  
<a name="connectSQL"></a>

## connectSQL() ℗
Connect to SQL server. Only used for initial connection test or to reconnect
on fatal error.

**Kind**: global function  
**Access**: private  
<a name="handler"></a>

## handler(req, res) ℗
Handler for all http requests. Should never be called unless something broke.

**Kind**: global function  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | Client request. |
| res | <code>http.ServerResponse</code> | Server response. |

<a name="parseCookies"></a>

## parseCookies(headers) ⇒ <code>object</code>
Get list of cookies from headers.

**Kind**: global function  
**Returns**: <code>object</code> - list Object of key-pairs for each cookie.  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>object</code> | Headers from socket handshake or request. |

<a name="updatePatreonTiers"></a>

## updatePatreonTiers() ℗
Read the Patreon tier beneits from patreon.json

**Kind**: global function  
**Access**: private  
**See**: {patreonTiers}  
<a name="setFriendRelation"></a>

## setFriendRelation(user, friend, relation, exists, callback)
Sets two users relation in the database.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | User id of the current user. |
| friend | <code>string</code> | User id of the other user in the relationship. |
| relation | <code>number</code> | Relation between the users we are setting. |
| exists | <code>bool</code> | If the users already exist in the table. |
| callback | [<code>basicCallback</code>](#basicCallback) |  |

<a name="checkIfFriends"></a>

## checkIfFriends(user, friend, callback)
Checks if the two users are friends.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The current user's id. |
| friend | <code>string</code> | The other user's id we are comparing. |
| callback | [<code>permCallback</code>](#permCallback) |  |

<a name="checkFilePerms"></a>

## checkFilePerms(filename, userId, otherId, callback)
Checks if the given userId has permission to view the given filename.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id that must be provided if the filename is in a different user's userdata. |
| callback | [<code>permCallback</code>](#permCallback) |  |

<a name="checkFriendFilePerms"></a>

## checkFriendFilePerms(filename, userId, otherId, callback)
Checks if the given userId has permission to view otherId's data.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename to check if userId has perms. |
| userId | <code>number</code> | The user id we are checking permissions for. |
| otherId | <code>number</code> | A friend Id to check if we have perms. |
| callback | [<code>permCallback</code>](#permCallback) |  |

<a name="appendChunk"></a>

## appendChunk(filename, chunkId, buffer, socket)
Appends a given session chunk to its file. Responds to socket.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The base name of the file we are writing to. |
| chunkId | <code>string</code> | The id of the chunk we are writing in order to tell the client the status of this chunk. |
| buffer | <code>string</code> | The data to write to the file. |
| socket | <code>socket</code> | The socket.io socket to respond to with status updates. |

<a name="forwardChunk"></a>

## forwardChunk(userId, chunkId, buffer, [isPublic])
Forwards received chunk data to all clients requesting live data.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| userId | <code>string</code> |  | The Id of the user sending the data. |
| chunkId | <code>string</code> |  | The id of the chunk we are forwarding. |
| buffer | <code>string</code> |  | The data to forward. |
| [isPublic] | <code>boolean</code> | <code>false</code> | Should this stream be sent to everybody not just friends? |

<a name="trackIdsToNames"></a>

## trackIdsToNames(idArray, callback)
Takes an array of directories describing a track, and returns an array of
objects of the names and ids of the tracks.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| idArray | <code>array</code> | The array of absolute paths to tracks and configs. |
| callback | <code>callback</code> | Callback containing only the returned object as an argument. |

<a name="updateVersionNum"></a>

## updateVersionNum()
Checks the versionNumFile for updated current app version.

**Kind**: global function  
<a name="sendVersionToAll"></a>

## sendVersionToAll()
Sends the version number to all connected clients.

**Kind**: global function  
<a name="getFriendsList"></a>

## getFriendsList(userId, relation, callback)
Gets list of all users with relation to userId.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | The id of the user we are looking up. |
| relation | <code>number</code> | Relation number to filter for. |
| callback | [<code>rowCallback</code>](#rowCallback) |  |

<a name="getFriendRelation"></a>

## getFriendRelation(user, friend, callback)
Gets the relation between two users.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The id of the user we are looking up. |
| friend | <code>string</code> | The id of the other user we are comparing. |
| callback | [<code>rowCallback</code>](#rowCallback) |  |

<a name="permCallback"></a>

## permCallback : <code>function</code>
Response from checking a user's permissions.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>boolean</code> \| <code>number</code> | True or >0 if has perms. Or number designating level of permission. |

<a name="basicCallback"></a>

## basicCallback : <code>function</code>
Basic callback with only error response.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |

<a name="rowCallback"></a>

## rowCallback : <code>function</code>
Response from a query to a database.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>string</code> | Defined if error, null if no error. |
| response | <code>array</code> | Array of rows as objects. |

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

