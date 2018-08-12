// Copyright 2018 Campbell Crowley. All rights reserved.
// Author: Campbell Crowley (web@campbellcrowley.com)

/* eslint-env node, es6, browser:false */

/**
 * The Server side of TraX.
 * @module TraXServerModule
 */

const auth = require('/var/www/servers/auth.js');
const CLIENT_ID = auth.gClientTokenAuthId;
const common = require('/var/www/servers/common.js');
const http = require('http');
const app = http.createServer(handler);
// const https_ = require('https');
const path = require('path');
const io = require('socket.io')(app, {
  path: '/' + path.relative('/var/www', process.cwd()).split('/')[0] +
      '/socket.io/',
  serveClient: false,
});
const fs = require('fs');
const sql = require('mysql');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const getSize = require('get-folder-size');
// var LZString = require('lz-string');

const gal = require('google-auth-library');
const client = new gal.OAuth2Client(CLIENT_ID, '', '');

/**
 * String defining which version this script is.
 * @private
 * @constant
 * @type {string}
 */
const versionType = __dirname == '/var/www/trax.campbellcrowley.com' ?
    'release' :
    'development';

/**
 * Directory to find and store user data.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const userdata = '/var/www/data/user/';
/**
 * Subdirectory in specific user's filder where we store our data.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const traxsubdir = '/TraX/';
/**
 * Subdirectory within the user's TraX folder to store session data.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const sessionsubdir = 'sessions/';
/**
 * Subdirectory within the user's TraX folder to store track data.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const usertracksubdir = 'tracks/';
/**
 * Subdirectory within user's TraX folder to store summary data.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const usersummariessubdir = 'summaries/';
/**
 * Folder paths to find public track data.
 * @default
 * @constant
 * @private
 * @type {Object.<string>}
 */
const trackdataDirs = {
  development: '/var/www/dev.campbellcrowley.com/trax/trackdata/',
  release: '/var/www/trax.campbellcrowley.com/trackdata/',
};
/**
 * Selected path from trackdataDirs to use for this version of the script.
 * @constant
 * @private
 * @type {string}
 */
const trackdata = trackdataDirs[versionType];

/**
 * The table where account data is stored about users.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const accountsTable = 'Accounts';
/**
 * The table where relationship statuses are stored.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const friendTable = 'Friends';
/**
 * The column within the friendTable to look for the relationship value between
 * the users.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const statusColumn = 'relationship';
/**
 * No relationship.
 * @TODO: Move relationship values to enum-like structure.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const noStatus = -1;
/**
 * User 1 requested to be friends.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const oneRequestStatus = 0;
/**
 * User 2 requested to be friends.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const twoRequestStatus = 1;
/**
 * Users are friends.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const friendStatus = 2;
/**
 * User 1 blocked user 2.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const oneBlockedStatus = 3;
/**
 * User 2 blocked user 1.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const twoBlockedStatus = 4;
/**
 * Both users blocked eachother.
 * @default
 * @constant
 * @private
 * @type {number}
 */
const bothBlockedStatus = 5;
/**
 * User 1 requested User 2 to be crew for 1.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const onePullRequestCrew = 6;
/**
 * User 1 requested to be crew for 2.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const onePushRequestCrew = 7;
/**
 * user 2 requested 1 to be crew for 2.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const twoPushRequestCrew = 8;
/**
 * User 2 requested to be crew for 1.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const twoPullRequestCrew = 9;
/**
 * User 1 is crew for 2.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const oneCrewStatus = 10;
/**
 * User 2 is crew for 1.
 * @default
 * @constant
 * @private
 * @type {number}
 */
// const twoCrewStatus = 11;

/**
 * File to find the current version of the project.
 * @default
 * @constant
 * @private
 * @type {string}
 */
const versionNumFile = './version.txt';


if (versionType == 'development') {
  common.begin(false, false);
  common.log('STARTING IN DEVELOPMENT MODE!');
} else {
  common.begin(false, true);
  common.log('STARTING IN RELEASE MODE!');
}
app.listen(process.argv[2]);

/**
 * Stores the information about the SQL server connection.
 * @private
 * @type {sql.ConnectionConfig}
 */
let sqlCon;
/**
 * Connect to SQL server. Only used for initial connection test or to reconnect
 * on fatal error.
 *
 * @private
 */
function connectSQL() {
  /* eslint-disable-next-line new-cap */
  sqlCon = new sql.createConnection({
    user: auth.sqlUsername,
    password: auth.sqlPassword,
    host: 'campbell-pi-2.local',
    database: 'appusers',
    port: 3306,
  });
  sqlCon.on('error', function(e) {
    common.error(e);
    if (e.fatal) {
      connectSQL();
    }
  });
}
connectSQL();

/**
 * Handler for all http requests. Should never be called unless something broke.
 *
 * @private
 * @param {http.IncomingMessage} req Client request.
 * @param {http.ServerResponse} res Server response.
 */
function handler(req, res) {
  common.error('TEAPOT ' + req.url);
  res.writeHead(418);
  res.end('I\'m a little teapot.');
}

/**
 * @classdesc Manages all client connections and requests. The entire server
 * side of TraX.
 * @class
 */
function TraXServer() {
  /**
   * All connected sockets.
   * @private
   * @default
   * @type {Array.<io.Client>}
   */
  let sockets = [];
  /**
   * All connected sockets requesting live data streams.
   * @default
   * @private
   * @type {Array.<io.Client>}
   */
  let liveSockets = [];

  /**
   * The current version read from file.
   * @see {TraXServerModule~versionNumFile}
   * @private
   * @default
   * @type {string}
   */
  let versionNum = 'Unknown';
  /**
   * The last time at which the version number was read from file.
   * @private
   * @default
   * @type {number}
   */
  let versionNumLastUpdate = 0;
  setInterval(updateVersionNum, 15000);
  updateVersionNum();

  /**
   * Get list of cookies from headers.
   *
   * @param {object} headers Headers from socket handshake or request.
   * @return {object} list Object of key-pairs for each cookie.
   */
  function parseCookies(headers) {
    let list = {};
    let rc = headers.cookie;

    rc && rc.split(';').forEach(function(cookie) {
      let parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
  }
  /**
   * Stores the current Patreon tier benefits read from patreon.json
   * @default
   * @private
   * @type {Array}
   */
  let patreonTiers = [];
  /**
   * Read the Patreon tier beneits from patreon.json
   * @see {patreonTiers}
   *
   * @private
   */
  function updatePatreonTiers() {
    common.log('Reading patreon.json');
    fs.readFile('./patreon.json', function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      try {
        let parsed = JSON.parse(data);
        if (parsed) {
          patreonTiers = parsed;
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
  updatePatreonTiers();
  fs.watchFile('./patreon.json', function(curr, prev) {
    if (curr.mtime == prev.mtime) return;
    updatePatreonTiers();
  });


  // TODO: Move events to functions.
  io.on('connection', function(socket) {
    let lastReceiveTime = 0;
    let lastReceiveName = '';
    let userId = '';
    let token = parseCookies(socket.handshake.headers)['token'];
    let hastoken = token && token !== 'undefined' && token !== 'null';
    let dirname;
    let streaming = false;
    let streamIsPublic = false;
    let dataLimit;
    let dataSize;
    sockets.push(socket);
    const ip = common.getIPName(
        socket.handshake.headers['x-forwarded-for'] ||
        socket.handshake.address);
    updateDirname = function(userId) {
      dirname = userdata + userId + traxsubdir + sessionsubdir;
    };

    if (hastoken) {
      try {
        client.verifyIdToken(
            {idToken: token, audience: CLIENT_ID}, function(e, login) {
              if (e) {
              } else if (typeof login !== 'undefined') {
                let payload = login.getPayload();
                let userid = payload['sub'];
                common.log(
                    'ID: ' + (userId ? userId + ' to ' : '') + userid,
                    socket.id);
                userId = userid;
                socket.userId = userId;
                updateDirname(userId);
              }
            });
      } catch (e) {
        common.error(e);
      }
    }
    common.log(
        ip + ': Connected (token: ' + hastoken + '), Connected: ' +
            sockets.length,
        socket.id);
    updateDirname(userId);

    socket.emit('connected');

    fetchDataLimit();
    fetchDataSize();

    // New connection procedure ends here.

    socket.on('disconnect', function(reason) {
      common.log(userId + ': Disconnect (' + reason + ')', socket.id);
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].id == socket.id) {
          sockets.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < liveSockets.length; i++) {
        if (liveSockets[i].id == socket.id) {
          liveSockets.splice(i, 1);
          break;
        }
      }
    });

    socket.on('ping', function(data) {
      socket.emit('pong', data);
    });
    socket.on('ping_', function(...args) {
      socket.emit(['pong_', 'PONG'].concat(args));
    });

    socket.on('setliveview', function() {
      common.log('Set to live view', socket.id);
      socket.live = true;
      liveSockets.push(socket);
    });
    socket.on('unsetliveview', function() {
      common.log('Unset live view', socket.id);
      for (let i = 0; i < liveSockets.length; i++) {
        if (liveSockets[i].id == liveSockets.id) {
          socket.live = false;
          liveSockets.splice(i, 1);
          break;
        }
      }
    });
    socket.on('getnumliveview', function() {
      socket.emit('numliveview', liveSockets.length);
    });

    socket.on('newtoken', function(token) {
      hastoken = token && token !== 'undefined' && token !== 'null';
      if (hastoken) {
        try {
          client.verifyIdToken(
              {idToken: token, audience: CLIENT_ID}, function(e, login) {
                if (e) {
                  common.log(e + token, socket.id);
                } else if (typeof login !== 'undefined') {
                  let payload = login.getPayload();
                  let userid = payload['sub'];
                  if (userid != userId) {
                    userId = userid;
                    socket.userId = userId;
                    updateDirname(userId);
                    fetchDataLimit();
                    fetchDataSize();
                    common.log(
                        userId + ': New token (token: ' + hastoken + ')',
                        socket.id);
                  }
                }
              });
        } catch (e) {
          common.error(e);
        }
      } else {
        common.log('New token attempted without sending token.', socket.id);
        userId = '';
        socket.userId = '';
      }
    });

    socket.on(
        'newsession', function(
                          sessionName, trackId, trackOwnerId, configId,
                          configOwnerId, sessionId) {
          if (typeof sessionId !== 'string' || sessionId.length <= 0) {
            sessionId = Date.now() + socket.id;
          }
          const mydir = path.normalize(dirname + sessionId);
          const filename = path.normalize(mydir + '/data.json');
          const file = JSON.stringify({
            id: sessionId,
            ownerId: userId + '',
            name: sessionName,
            date: Date.now(),
            trackId: trackId,
            trackOwnerId: trackOwnerId,
            configId: configId,
            configOwnerId: configOwnerId,
          });
          checkFilePerms(filename, userId, undefined, function(err2, perms) {
            if (err2 || !perms) {
              socket.emit('fail', err2);
              return;
            }
            mkdirp(mydir, {mode: 700}, function(err3) {
              if (err3) {
                socket.emit('fail', 'writeerror');
                common.error(
                    'Failed to create directory ' + filename + ' ' + err3,
                    socket.id);
                return;
              }
              fs.readFile(filename, function(err3, readFileData) {
                if (!err3 && readFileData) {
                  socket.emit('fail', 'sessionexists', sessionId);
                  return;
                }

                // Write data file
                fs.writeFile(filename, file, function(err4) {
                  if (err4) {
                    socket.emit('fail', 'writeerror');
                    common.error(
                        'Failed to write to ' + filename + ' ' + err4,
                        socket.id);
                    return;
                  }
                  common.log('Added new session to ' + filename, socket.id);
                  socket.emit('createdsession', sessionId);
                });
              });
            });
          });
        });

    socket.on(
        'editsession', function(
                           sessionName, trackId, trackOwnerId, configId,
                           configOwnerId, sessionId) {
          const mydir = path.normalize(dirname + sessionId);
          const filename = path.normalize(mydir + '/data.json');
          checkFilePerms(filename, userId, undefined, function(err, perms) {
            if (err || !perms) {
              socket.emit('fail', 'noperm');
              return;
            }
            fs.readFile(filename, function(err, oldData) {
              if (err || oldData.length == 0) {
                // Can't edit session that doesn't exist.
                return;
              }
              try {
                oldData = JSON.parse(oldData);
              } catch (e) {
                common.error(filename + e, socket.id);
                return;
              }
              const file = JSON.stringify({
                id: sessionId,
                ownerId: oldData.ownerId,
                name: sessionName,
                date: oldData.date,
                lastEdit: Date.now(),
                trackId: trackId,
                trackOwnerId: trackOwnerId,
                configId: configId,
                configOwnerId: configOwnerId,
              });
              // Write data file
              fs.writeFile(filename, file, function(err4) {
                if (err4) {
                  socket.emit('fail', 'writeerror');
                  common.error(
                      'Failed to write to ' + filename + ' ' + err4, socket.id);
                  return;
                }
                common.log('Edited session ' + filename, socket.id);
                socket.emit('editedsession', sessionId);
              });
            });
          });
        });

    socket.on('appendsession', function(sessionId, chunkId, buffer) {
      if (!sessionId) {
        socket.emit('fail', 'invalidsessionid', sessionId);
        return;
      }
      const mydir = dirname + sessionId;
      const filename = path.normalize(mydir + '/session.dat');
      checkFilePerms(filename, userId, undefined, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err, sessionId);
          return;
        }
        if (Date.now() - lastReceiveTime > 30000 ||
            lastReceiveName != sessionId) {
          common.log(
              'Started receiving session ' + userId + '/' + sessionId,
              socket.id);
          /* if (userId !== "112755862396374027799")
            sendEventToTopic(
                'notification_message', "TraX: User started recording
            session.");
            */
          lastReceiveName = sessionId;
        }
        lastReceiveTime = Date.now();
        forwardChunk(userId, chunkId, buffer, streamIsPublic);
        if (buffer.length * 2 + dataSize > dataLimit && dataLimit > 0) {
          socket.emit('fail', 'nostorage');
          return;
        }
        appendChunk(filename, sessionId, chunkId, buffer, socket);
        dataSize += buffer.length * 2;
      });
    });

    socket.on('setpublic', function(value) {
      streamIsPublic = value;
      socket.public = value;
    });

    socket.on('requestsessionsize', function(sessionId, otherId) {
      let mydir = path.normalize(dirname + sessionId);
      if (typeof otherId !== 'undefined' && otherId !== userId &&
          otherId !== '') {
        mydir = path.normalize(
            userdata + otherId + traxsubdir + sessionsubdir + sessionId);
      }
      const filename = path.normalize(mydir /* + "/session.dat"*/);
      checkFilePerms(filename, userId, otherId, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        getSize(filename, function(err2, size) {
          if (err2) {
            common.error('Failed to get filesize of ' + filename + '. ' + err2);
            socket.emit('stats', -1, sessionId);
          } else {
            socket.emit('stats', size, sessionId);
            if (filename === dirname) dataSize = size;
          }
        });
      });
    });

    /**
     * Calculates the amount of data the current user is using on the server.
     * Result is stored in `dataSize`.
     *
     * @private
     */
    function fetchDataSize() {
      if (!userId) return;
      getSize(dirname, function(err, size) {
        if (err) {
          common.error('Failed to get filesize of ' + dirname + '. ' + err);
        } else {
          dataSize = size;
        }
      });
    }

    /**
     * Calculates the current user's data limit based off their Patreon pledge
     * amount, or account override. Result is stored in `dataLimit`.
     *
     * @private
     */
    function fetchDataLimit() {
      if (!userId || dataLimit < 0) return;
      if (!dataLimit) dataLimit = -1;

      let patreonParsed;
      let accountParsed;

      let requestsComplete = function() {
        let currentTier = -1;
        const pledgeAmount = accountParsed || patreonParsed.pledge || 0;
        for (let i = 0; i < patreonTiers.length; i++) {
          if (patreonTiers[i].cost <= pledgeAmount &&
              (currentTier < 0 ||
               patreonTiers[currentTier].cost < patreonTiers[i].cost)) {
            currentTier = i;
          }
        }
        if (currentTier >= 0) {
          dataLimit = patreonTiers[currentTier].dataLimit;
        } else {
          dataLimit = 100 * 1000 * 1000;  // 100MB
        }
        socket.emit('datalimit', dataLimit);
      };
      let numRes = 0;
      const resCount = 2;

      const reqOpts1 = {
        port: 89,
        path: '/fetchaccount/id/' + userId,
        headers: {'x-local-server-override-key': auth.localServerOverrideKey},
      };
      let req1 = http.request(reqOpts1, function(res1) {
        let data = '';
        res1.on('data', function(chunk) {
          data += chunk;
        });
        res1.on('end', function() {
          try {
            patreonParsed = JSON.parse(data);
          } catch (err) {
            common.error('Failed to parse response from our Patreon', ip);
            return;
          }
          numRes++;
          if (resCount == numRes) requestsComplete();
        });
      });
      req1.end();
      const reqOpts2 = {
        port: 82,
        path: '/fetchuser/' + userId + '/patreonPledgeOverride',
        headers: {'x-local-server-override-key': auth.localServerOverrideKey},
      };
      let req2 = http.request(reqOpts2, function(res2) {
        let data = '';
        res2.on('data', function(chunk) {
          data += chunk;
        });
        res2.on('end', function() {
          try {
            accountParsed = data === 'null' ? null : data;
          } catch (err) {
            common.error('Failed to parse response from our Account', ip);
            return;
          }
          numRes++;
          if (resCount == numRes) requestsComplete();
        });
      });
      req2.end();
    }

    socket.on('requestsessionlimit', function() {
      if (!dataLimit || dataLimit < 0) {
        fetchDataLimit();
      } else {
        socket.emit('datalimit', dataLimit);
      }
    });

    socket.on('requestsessionlist', function(otherId) {
      let mydir = dirname;
      if (otherId && otherId !== 'undefined') {
        mydir = path.normalize(userdata + otherId + traxsubdir + sessionsubdir);
      }
      checkFilePerms(mydir, userId, otherId, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        fs.readdir(mydir, function(err2, files) {
          if (err2) {
            socket.emit('sessionlist', 'readerror', 'requestsessionlist');
            common.error('Failed to read ' + mydir + ' ' + err2, socket.id);
            return;
          }
          let responses = 0;
          let callback = function() {
            responses++;
            if (responses == files.length) {
              trackIdsToNames(finalfiles, function(nameList) {
                for (let i = 0; i < nameList.length; i++) {
                  if (!nameList[i]['ownerId']) {
                    nameList[i]['ownerId'] = otherId || userId;
                  }
                }
                socket.emit('sessionlist', nameList);
              });
            }
          };
          let finalfiles = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fs.stat(path.join(mydir, file), function(err3, stats) {
              if (err3) {
                common.error(
                    'Failed to stat ' + mydir + '/' + file + ' ' + err3,
                    socket.id);
              } else {
                if (stats.isDirectory()) finalfiles.push(mydir + '/' + file);
              }
              callback();
            });
          }
          if (files.length == 0) socket.emit('sessionlist', [], sessionId);
        });
      });
    });

    socket.on(
        'streamsession', function(sessionId, otherId, startByte, endByte) {
          if (streaming) return;
          if (typeof sessionId === 'number' && sessionId >= 0) {
            sessionId = sessionId + '';
          }
          if (typeof sessionId !== 'string' || sessionId.length <= 0) return;
          streaming = true;
          let mydir = dirname + sessionId;
          if (typeof otherId !== 'undefined' && otherId !== userId) {
            mydir = userdata + otherId + traxsubdir + sessionsubdir + sessionId;
          }
          const sessionFile = mydir + '/session.dat';
          checkFilePerms(sessionFile, userId, otherId, function(err, perm) {
            if (err || !perm) {
              streaming = false;
              socket.emit('fail', err);
              return;
            }
            fs.stat(sessionFile, function(err, stats) {
              if (err) {
                socket.emit('fail', 'readerr', sessionId);
                common.log(
                    'Failed to stat ' + sessionFile + ': ' + err, socket.id);
                streaming = false;
                return;
              }

              let bytessent = 0;
              const numbytes = stats['size'];

              let options = {};
              if (typeof startByte !== 'undefined') options.start = startByte;
              if (typeof endByte !== 'undefined') options.end = endByte;
              let stream = fs.createReadStream(sessionFile, options);

              common.log('Stream of ' + sessionFile + ' started', socket.id);
              stream.on('readable', function() {
                let chunk;
                while (null !== (chunk = stream.read())) {
                  const size = chunk.length;
                  bytessent += size;
                  socket.emit(
                      'streamresponse', size, chunk.toString(), sessionId,
                      bytessent, numbytes);
                }
              });
              stream.on('close', function() {
                socket.emit(
                    'streamresponse', -1, null, sessionId, bytessent, numbytes);
                streaming = false;
              });
              stream.on('error', function(err2) {
                common.log(
                    'Stream of ' + sessionFile + ' errored ' + bytessent + '/' +
                        numbytes + ' (' + err + ')',
                    socket.id);
              });
            });
          });
        });

    socket.on('deletesession', function(sessionId) {
      common.log('Deleting session ' + userId + '/' + sessionId, socket.id);
      if (typeof sessionId === 'number' && sessionId >= 0) {
        sessionId = sessionId + '';
      }
      if (typeof sessionId !== 'string' || sessionId.length <= 0) return;
      const mydir = dirname + sessionId;
      checkFilePerms(mydir, userId, undefined, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        rimraf(mydir, function(err2) {
          if (err2) {
            common.error('Failed to delete ' + mydir + err2, socket.id);
            socket.emit('fail', 'rmerror');
          }
        });
      });
    });

    socket.on('renamesession', function(sessionId, newName) {
      newName = String(newName);
      const filename = path.normalize(dirname + sessionId + '/data.json');
      console.log('Renaming session ' + userId + '/' + sessionId);
      checkFilePerms(filename, userId, undefined, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        fs.readFile(filename, function(err2, file) {
          if (err2) {
            socket.emit('fail', 'readerror', 'renamesession');
            return;
          }
          try {
            file = JSON.parse(file);
          } catch (e) {
            common.error(filename + e, socket.id);
            return;
          }
          file.name = newName;
          fs.writeFile(filename, JSON.stringify(file), function(err3) {
            if (err3) {
              socket.emit('fail', 'writeerror');
              common.error('Failed to rename session ' + sessionId, socket.id);
              return;
            }
          });
        });
      });
    });


    socket.on('deletefolder', function(trackId, otherId) {
      if (otherId != userId || !userId) {
        // Must be crew to do this.
        socket.emit('fail', 'noperms');
        return;
      }
      // TODO: Check if otherId is crew, not friend.
      /* if (typeof otherId !== 'undefined' && otherId !== userId &&
          otherId !== "") {
        mydir = userdata + otherId + traxsubdir + usertracksubdir + "/" +
      trackId;
      } */
      trackId = String(trackId);
      let mydir = userdata + (otherId ? otherId : userId) + traxsubdir +
          usertracksubdir + '/' + trackId;
      mydir = path.normalize(mydir);
      checkFilePerms(mydir, userId, otherId, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        rimraf(mydir, function(err2) {
          if (err2) {
            socket.emit('filelist', 'deleteerror');
            common.error('Failed to delete ' + mydir + ' ' + err2, socket.id);
          } else {
            common.log('Deleted ' + mydir, socket.id);
          }
        });
      });
    });

    socket.on('editfolder', function(trackId, newName, otherId) {
      if (otherId != userId || !userId) {
        // Must be crew to do this.
        socket.emit('fail', 'noperms');
        return;
      }
      // TODO: Check if crew, not friend.
      /* if (typeof otherId !== 'undefined' && otherId !== userId &&
          otherId !== "") {
        mydir =
            userdata + otherId + traxsubdir + usertracksubdir + "/" + trackId;
      } */
      let mydir = userdata + (otherId ? otherId : userId) + traxsubdir +
          usertracksubdir + '/' + trackId + '/data.json';
      mydir = path.normalize(mydir);
      checkFilePerms(mydir, userId, otherId, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', err);
          return;
        }
        fs.readFile(mydir, function(err2, file) {
          if (err2) {
            socket.emit('filelist', 'editerror');
            common.error('Failed to edit ' + mydir + ' ' + err2, socket.id);
          } else {
            let newFile;
            try {
              newFile = JSON.parse(file);
            } catch (e) {
              common.error(mydir + e, socket.id);
              return;
            }
            newFile.name = newName;
            fs.writeFile(mydir, JSON.stringify(newFile), function(err3) {
              if (err3) {
                socket.emit('filelist', 'editerror');
                common.error('Failed to edit ' + mydir + ' ' + err3, socket.id);
              }
            });
          }
        });
      });
    });

    socket.on('requesttracklist', function(pathname, otherId) {
      let origPath = pathname;
      if (typeof pathname == 'undefined' || pathname == 'track') pathname = '';
      const useUserDir = ((otherId && true) || false);
      const isFriendDir = useUserDir && otherId != 'myself';

      if (useUserDir && !isFriendDir) otherId = userId;

      const mydir = path.normalize(trackdata + pathname);
      const userdir = path.normalize(
          userdata + otherId + traxsubdir + usertracksubdir + pathname);
      const finalDir = useUserDir ? userdir : mydir;

      checkFilePerms(
          finalDir, userId, isFriendDir ? otherId : undefined,
          function(err, perms) {
            if (err || !perms) {
              socket.emit('fail', err);
              return;
            }
            fs.readdir(finalDir, function(err2, files) {
              if (err2) {
                socket.emit('tracklist', 'readerror', 'requesttracklist');
                common.error(
                    'Failed to read ' + finalDir + ' ' + err2, socket.id);
                return;
              }
              let responses = 0;
              let callback = function() {
                responses++;
                if (responses == files.length) {
                  trackIdsToNames(finalfiles, function(nameList) {
                    for (let i = 0; i < nameList.length; i++) {
                      if (!nameList[i]['ownerId']) {
                        nameList[i]['ownerId'] =
                            nameList[i]['owner'] || otherId || '';
                      }
                    }
                    socket.emit('tracklist', nameList, origPath, otherId);
                  });
                }
              };
              let finalfiles = [];
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                fs.stat(path.join(finalDir, file), function(err5, stats) {
                  if (err5) {
                    common.error(
                        'Failed to stat ' + finalDir + '/' + file + ' ' + err5,
                        socket.id);
                  } else {
                    if (stats.isDirectory()) {
                      finalfiles.push(finalDir + '/' + file);
                    }
                  }
                  callback();
                });
              }
              if (files.length == 0) {
                socket.emit('tracklist', [], origPath, otherId);
              }
            });
          });
    });

    socket.on('newtrack', function(trackName, trackCoords) {
      const idFile = path.normalize(
          userdata + userId + traxsubdir + usertracksubdir + '/data.json');
      fs.readFile(idFile, function(err, idData) {
        let trackId;
        if (err) {
          common.log('Creating new track data for user ' + err, socket.id);
          trackId = 0;
        } else {
          try {
            trackId = JSON.parse(idData)['nextId'];
          } catch (e) {
            common.error(idFile + e, socket.id);
            return;
          }
        }
        const mydir = path.normalize(
            userdata + userId + traxsubdir + usertracksubdir + trackId);
        const filename = path.normalize(mydir + '/data.json');
        const file = JSON.stringify({
          id: trackId,
          name: trackName,
          coord: trackCoords,
          createdDate: Date.now(),
          nextId: 0,
          ownerId: userId + '',
        });
        mkdirp(mydir, {mode: 700}, function(err2) {
          if (err2) {
            socket.emit('fail', 'writeerror');
            common.error(
                'Failed to create directory ' + filename + ' ' + err2,
                socket.id);
            return;
          }
          fs.writeFile(filename, file, function(err3) {
            if (err3) {
              socket.emit('fail', 'writeerror');
              common.error(
                  'Failed to write to ' + filename + ' ' + err3, socket.id);
            }
            common.log('Added new track to ' + filename, socket.id);
            fs.writeFile(
                idFile, JSON.stringify({nextId: trackId + 1}), function(err3) {
                  if (err3) {
                    common.error(
                        'Failed to increment track ID!' + idFile, socket.id);
                  }
                });
          });
        });
      });
    });

    socket.on('edittrack', function(trackName, trackCoords, trackId) {
      const mydir = path.normalize(
          userdata + userId + traxsubdir + usertracksubdir + trackId);
      const filename = path.normalize(mydir + '/data.json');
      checkFilePerms(filename, userId, undefined, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', 'badtrackid');
          return;
        }
        fs.readFile(filename, function(err2, oldData) {
          if (err2) {
            common.error('Failed to read old trackData' + err2, socket.id);
            socket.emit('fail', 'editreaderr', 'edittrack');
            return;
          }
          try {
            oldData = JSON.parse(oldData);
          } catch (e) {
            common.error(filename + e, socket.id);
            return;
          }
          const file = JSON.stringify({
            id: trackId,
            name: trackName,
            coord: trackCoords,
            createdDate: oldData.createdDate,
            lastEdit: Date.now(),
            nextId: oldData.nextId,
            ownerId: oldData.ownerId,
          });
          fs.writeFile(filename, file, function(err3) {
            if (err3) {
              socket.emit('fail', 'writeerror');
              common.error(
                  'Failed to write to ' + filename + ' ' + err3, socket.id);
              return;
            }
            common.log('Edited track ' + filename, socket.id);
          });
        });
      });
    });

    socket.on(
        'newconfig',
        function(trackId, trackName, configName, start, finish, sectors) {
          const idFile = path.normalize(
              userdata + userId + traxsubdir + usertracksubdir + trackId +
              '/data.json');
          checkFilePerms(idFile, userId, undefined, function(err, perms) {
            if (err || !perms) {
              socket.emit('fail', 'badtrackid');
              return;
            }
            fs.readFile(idFile, function(err2, idData) {
              if (err2) {
                socket.emit('fail', 'readerr', 'newconfig');
                return;
              }
              try {
                idData = JSON.parse(idData);
              } catch (e) {
                (idFile + e, socket.id);
                return;
              }
              const configId = idData['nextId'];
              const mydir = path.normalize(
                  userdata + userId + traxsubdir + usertracksubdir + trackId +
                  '/' + configId);
              const filename = path.normalize(mydir + '/data.json');
              const file = JSON.stringify({
                id: configId,
                ownerId: userId + '',
                createdDate: Date.now(),
                trackId: trackId,
                name: configName,
                start: start,
                finish: finish,
                sectors: sectors,
              });
              mkdirp(mydir, {mode: 700}, function(err3) {
                if (err3) {
                  socket.emit('fail', 'writeerror');
                  common.error(
                      'Failed to create directory ' + mydir + ' ' + err3,
                      socket.id);
                  return;
                }
                fs.writeFile(filename, file, function(err4) {
                  if (err4) {
                    socket.emit('fail', 'writeerror');
                    common.error(
                        'Failed to write to ' + filename + ' ' + err4,
                        socket.id);
                  }
                  common.log('Added new config to ' + filename, socket.id);
                  idData.nextId++;
                  fs.writeFile(idFile, JSON.stringify(idData), function(err5) {
                    if (err5) {
                      common.error(
                          'Failed to increment config id! ' + err4, socket.id);
                    }
                  });
                });
              });
            });
          });
        });

    socket.on(
        'editconfig',
        function(
            trackId, trackName, configName, start, finish, sectors, configId) {
          const mydir = path.normalize(
              userdata + userId + traxsubdir + usertracksubdir + trackId + '/' +
              configId);
          const filename = path.normalize(mydir + '/data.json');
          checkFilePerms(filename, userId, undefined, function(err, perms) {
            if (err || !perms) {
              socket.emit('fail', 'badtrackids');
              return;
            }
            fs.readFile(filename, function(err2, oldData) {
              if (err2) {
                socket.emit('fail', 'editreaderr', 'editconfig');
                return;
              }
              try {
                oldData = JSON.parse(oldData);
              } catch (e) {
                common.error(filename + e, socket.id);
                return;
              }
              const file = JSON.stringify({
                id: configId,
                ownerId: oldData.ownerId,
                createdDate: oldData.createdDate,
                lastEdit: Date.now(),
                trackId: trackId,
                name: configName,
                start: start,
                finish: finish,
                sectors: sectors,
              });
              fs.writeFile(filename, file, function(err3) {
                if (err3) {
                  socket.emit('fail', 'writeerror');
                  common.error(
                      'Failed to write to ' + filename + ' ' + err3, socket.id);
                  return;
                }
                common.log('Edited config ' + filename, socket.id);
              });
            });
          });
        });

    socket.on('getfriendslist', function() {
      getFriendsList(userId, friendStatus, function(err, data) {
        if (err) {
          common.error('Failed to get relation list' + err, socket.id);
          return;
        }
        socket.emit('friendslist', data);
      });
    });

    socket.on('getallrelations', function() {
      getFriendsList(userId, undefined, function(err, data) {
        if (err) {
          common.error('Failed to get relation list' + err, socket.id);
          return;
        }
        socket.emit('relationshiplist', data);
      });
    });

    socket.on('acceptrequest', function(friendId) {
      getFriendRelation(userId, friendId, function(err, row) {
        if (err) {
          common.error(err, socket.id);
          return;
        }
        let newRel = friendStatus;
        if (row) {
          let rel = row[statusColumn];
          if ((row['user1'] == userId && rel != twoRequestStatus) ||
              (row['user2'] == userId && rel != oneRequestStatus)) {
            return;
          }
        } else {
          common.log(
              'Can\'t accept request, no relation ' + friendId, socket.id);
          return;
        }

        common.log('Accepting request' + friendId, socket.id);
        setFriendRelation(userId, friendId, newRel, true, function(err) {
          if (err) {
            common.error('Failed to accept request. ' + err, socket.id);
          }
        });
      });
    });
    socket.on('denyrequest', function(friendId) {
      getFriendRelation(userId, friendId, function(err, row) {
        if (err) {
          common.error(err, socket.id);
          return;
        }
        let newRel = noStatus;
        if (row) {
          let rel = row[statusColumn];
          if ((row['user1'] == userId && rel != twoRequestStatus) ||
              (row['user2'] == userId && rel != oneRequestStatus)) {
            return;
          }
        } else {
          common.log('Can\'t deny request, no relation ' + friendId, socket.id);
          return;
        }

        common.log('Denying request' + friendId, socket.id);
        setFriendRelation(userId, friendId, newRel, true, function(err) {
          if (err) {
            common.error('Failed to deny request. ' + err, socket.id);
          }
        });
      });
    });
    socket.on('removefriend', function(friendId) {
      getFriendRelation(userId, friendId, function(err, row) {
        if (err) {
          common.error(err, socket.id);
          return;
        }
        let newRel = noStatus;
        if (row) {
          let rel = row[statusColumn];
          if (rel != friendStatus) {
            if (row['user1'] == userId && rel != oneRequestStatus) {
              if (row['user2'] == userId && rel != twoRequestStatus) {
                return;
              }
            }
          }
        } else {
          common.log(
              'Can\'t accept request, no relation ' + friendId, socket.id);
          return;
        }

        common.log('Removing friends ' + friendId, socket.id);
        setFriendRelation(userId, friendId, newRel, true, function(err) {
          if (err) {
            common.error('Failed to deny request. ' + err, socket.id);
          }
        });
      });
    });
    socket.on('blockrequest', function(friendId) {
      getFriendRelation(userId, friendId, function(err, row) {
        let newRel = oneBlockedStatus;
        if (row) {
          if (row[statusColumn] == bothBlockedStatus) return;
          if (row['user1'] == userId) {
            if (row[statusColumn] == twoBlockedStatus) {
              newRel = bothBlockedStatus;
            } else {
              newRel = oneBlockedStatus;
            }
          } else {
            if (row[statusColumn] == oneBlockedStatus) {
              newRel = bothBlockedStatus;
            } else {
              newRel = twoBlockedStatus;
            }
          }
        }

        common.log('Blocking friends ' + friendId, socket.id);
        setFriendRelation(userId, friendId, newRel, true, function(err) {
          if (err) {
            common.error('Failed to block user. ' + err, socket.id);
          }
        });
      });
    });

    socket.on('unblockuser', function(friendId) {
      getFriendRelation(userId, friendId, function(err, row) {
        let newRel = noStatus;
        if (row) {
          if (row['user1'] == userId) {
            if (row[statusColumn] == twoBlockedStatus) {
              return;
            } else if (row[statusColumn] == oneBlockedStatus) {
              newRel = noStatus;
            } else if (row[statusColumn] == bothBlockedStatus) {
              newRel = twoBlockedStatus;
            } else {
              return;
            }
          } else {
            if (row[statusColumn] == oneBlockedStatus) {
              return;
            } else if (row[statusColumn] == twoBlockedStatus) {
              newRel = noStatus;
            } else if (row[statusColumn] == bothBlockedStatus) {
              newRel = oneBlockedStatus;
            } else {
              return;
            }
          }
        } else {
          return;
        }

        common.log('Unblocking user' + friendId, socket.id);
        setFriendRelation(userId, friendId, newRel, true, function(err) {
          if (err) {
            common.error('Failed to unblock user. ' + err, socket.id);
          }
        });
      });
    });

    socket.on('addfriend', function(friendId) {
      if (friendId == userId) {
        socket.emit('friendfail', 'addingself');
        return;
      }
      const toSend = sqlCon.format(
          'SELECT * FROM ?? WHERE ((??=? AND ??=?) OR (??=? AND ??=?))', [
            friendTable,
            'user1',
            userId,
            'user2',
            friendId,
            'user1',
            friendId,
            'user2',
            userId,
          ]);
      sqlCon.query(toSend, function(err, res) {
        if (err) {
          socket.emit('fail', err);
          return;
        }
        let newRel = oneRequestStatus;
        if (res && res.length > 0) {
          let data = res[0];
          let rel = data[statusColumn];
          if (rel == friendStatus) {
            socket.emit('friendfail', 'alreadyfriends');
            return;
          } else if (data['user1'] == userId) {
            if (rel == oneRequestStatus) {
              socket.emit('friendfail', 'alreadyrequested');
              return;
            } else if (rel == twoRequestStatus) {
              setFriendRelation(
                  userId, friendId, friendStatus, true, function(err) {
                    if (err) {
                      socket.emit('friendfail', 'servererr');
                    } else {
                      socket.emit('friendfail', 'nowfriends');
                      common.log(
                          'Updated relationship: ' + friendId + ' -> ' +
                              friendStatus,
                          socket.id);
                    }
                  });
              return;
            } else if (rel == oneBlockedStatus) {
              socket.emit('friendfail', 'blockedother');
              return;
            } else if (rel == twoBlockedStatus) {
              socket.emit('friendfail', 'otherblocked');
              return;
            } else if (rel == noStatus) {
              newRel =
                  data['user1'] == userId ? oneRequestStatus : twoRequestStatus;
            } else {
              socket.emit('friendfail', 'notimplemented', 0);
              return;
            }
          } else if (data['user2'] == userId) {
            if (rel == oneRequestStatus) {
              setFriendRelation(
                  userId, friendId, friendStatus, true, function(err) {
                    if (err) {
                      socket.emit('friendfail', 'servererr');
                    } else {
                      socket.emit('friendfail', 'nowfriends');
                      common.log(
                          'Updated relationship: ' + friendId + ' -> ' +
                              friendStatus,
                          socket.id);
                    }
                  });
              return;
            } else if (rel == twoRequestStatus) {
              socket.emit('friendfail', 'alreadyrequested');
              return;
            } else if (rel == oneBlockedStatus) {
              socket.emit('friendfail', 'otherblocked');
              return;
            } else if (rel == twoBlockedStatus) {
              socket.emit('friendfail', 'blockedother');
              return;
            } else if (rel == noStatus) {
              newRel =
                  data['user1'] == userId ? oneRequestStatus : twoRequestStatus;
            } else {
              socket.emit('friendfail', 'notimplemented', 1);
              return;
            }
          }
        }
        const toSend = sqlCon.format(
            'SELECT * FROM ?? WHERE ??=?', [accountsTable, 'id', friendId]);
        sqlCon.query(toSend, function(err, acc) {
          if (err) common.error(err);
          if (!acc || acc.length == 0) {
            socket.emit('friendfail', 'unknownuser');
            return;
          }
          setFriendRelation(
              userId, friendId, newRel, res && res.length > 0, function(err) {
                if (err) {
                  socket.emit('friendfail', 'servererr');
                } else {
                  socket.emit('friendfail', 'success');
                  common.log(
                      'Updated relationship: ' + friendId + ' -> ' + newRel,
                      socket.id);
                  for (let i = 0; i < sockets.length; i++) {
                    if (sockets[i].userId == userId ||
                        sockets[i].userId == friendId &&
                            sockets[i].id != socket.id) {
                      sockets[i].emit('friendlistchanged');
                    }
                  }
                }
              });
        });
      });
    });

    socket.on('updateposition', function(pos) {
      getFriendsList(userId, friendStatus, function(err, data) {
        for (let j = 0; j < sockets.length; j++) {
          for (let i = 0; i < data.length; i++) {
            if (sockets[j].userId == data[i].id) {
              sockets[j].emit('friendPos', pos);
            }
          }
          if (sockets[j].userId == userId && sockets[j].id != socket.id) {
            sockets[j].emit('friendPos', userId, pos);
          }
        }
      });
    });

    socket.on(
        'updatesummary', function(trackId, configId, user, friendId, data) {
          if (user == 'myself') {
            user = userId;
          } else if (!user) {
            user = '0';
          }
          const trackFileName =
              friendId + ',' + trackId + ',' + configId + '.json';
          const mydir = path.normalize(
              userdata + user + traxsubdir + usersummariessubdir);
          const filename = path.normalize(mydir + trackFileName);
          checkFilePerms(filename, userId, undefined, function(err, perms) {
            if (err || !perms) {
              socket.emit('fail', 'badsummaryids');
              return;
            }
            mkdirp(mydir, {mode: 700}, function(err3) {
              if (err3) {
                socket.emit('fail', 'writeerror');
                common.error(
                    'Failed to create directory ' + mydir + ' ' + err3,
                    socket.id);
                return;
              }
              fs.writeFile(filename, data, function(err4) {
                if (err4) {
                  socket.emit('fail', 'writeerror');
                  common.error(
                      'Failed to write to ' + filename + ' ' + err4, socket.id);
                }
                common.log('Updated summary: ' + filename, socket.id);
              });
            });
          });
        });

    socket.on('getsummary', function(trackId, configId, user, friendId) {
      if (user == 'myself') {
        user = userId;
      } else if (!user) {
        user = '';
      }
      if (!configId && typeof configId !== 'number') {
        socket.emit('fail', 'badsumaryids');
        return;
      }
      if (!trackId && typeof trackId !== 'number') {
        socket.emit('fail', 'badsummaryids');
        return;
      }
      if (!friendId) friendId = '';
      const trackFileName = friendId + ',' + trackId + ',' + configId + '.json';
      const mydir =
          path.normalize(userdata + user + traxsubdir + usersummariessubdir);
      const filename = path.normalize(mydir + trackFileName);
      checkFilePerms(filename, userId, user, function(err, perms) {
        if (err || !perms) {
          socket.emit('fail', 'badsummaryids');
          return;
        }
        fs.readFile(filename, function(err2, data) {
          if (err2) {
            socket.emit('fail', 'readerr', 'getsummary');
            return;
          }
          socket.emit('newsummary', trackId, configId, user, friendId, data);
        });
      });
    });

    socket.on('getversion', function() {
      socket.emit('version', versionNum);
    });
  });

  /**
   * Response from checking a user's permissions.
   *
   * @callback permCallback
   * @param {string} error Defined if error, null if no error.
   * @param {boolean|number} response True or >0 if has perms. Or number
   * designating level of permission.
   */

  /**
   * Basic callback with only error response.
   *
   * @callback basicCallback
   * @param {string} error Defined if error, null if no error.
   */

  /**
   * Response from a query to a database.
   *
   * @callback rowCallback
   * @param {string} error Defined if error, null if no error.
   * @param {array} response Array of rows as objects.
   */

  /**
   * Sets two users relation in the database.
   *
   * @private
   * @param {string} user User id of the current user.
   * @param {string} friend User id of the other user in the relationship.
   * @param {number} relation Relation between the users we are setting.
   * @param {bool} exists If the users already exist in the table.
   * @param {basicCallback} callback
   */
  function setFriendRelation(user, friend, relation, exists, callback) {
    if (user == friend || !user || !friend) {
      callback('baduser');
      return;
    }
    let toSend = '';
    if (exists) {
      const dat = {};
      dat[statusColumn] = relation;
      toSend = sqlCon.format(
          'UPDATE ?? SET ? WHERE ((??=? AND ??=?) OR (??=? AND ??=?))', [
            friendTable,
            dat,
            'user1',
            user,
            'user2',
            friend,
            'user1',
            friend,
            'user2',
            user,
          ]);
    } else {
      const dat = {'user1': user, 'user2': friend};
      dat[statusColumn] = relation;
      toSend = sqlCon.format('INSERT INTO ?? SET ?', [
        friendTable,
        dat,
      ]);
    }
    sqlCon.query(toSend, function(err) {
      if (err) {
        common.error('Failed to update relationship' + err);
        callback('sqlerr');
      }
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].userId == user || sockets[i].userId == friend) {
          sockets[i].emit('friendlistchanged');
        }
      }
      callback();
    });
  }

  /**
   * Checks if the two users are friends.
   *
   * @private
   * @param {string} user The current user's id.
   * @param {string} friend The other user's id we are comparing.
   * @param {permCallback} callback
   */
  function checkIfFriends(user, friend, callback) {
    if (!user || !friend) {
      callback('baduser', false);
      return;
    }
    if (user == friend) {
      callback(null, true);
      return;
    }
    const toSend = sqlCon.format(
        'SELECT * FROM ?? WHERE ((??=? AND ??=?) OR (??=? AND ??=?)) AND ??=?',
        [
          friendTable,
          'user1',
          user,
          'user2',
          friend,
          'user1',
          friend,
          'user2',
          user,
          statusColumn,
          friendStatus,
        ]);
    sqlCon.query(toSend, function(err, res) {
      if (err) common.error(err);
      let friends = (res && res.length && true) || false;
      callback(friends ? null : 'notfriends', friends);
    });
  }

  /**
   * Checks if the given userId has permission to view the given filename.
   *
   * @private
   * @param {string} filename The filename to check if userId has perms.
   * @param {number} userId The user id we are checking permissions for.
   * @param {number} otherId A friend Id that must be provided if the filename
   * is in a different user's userdata.
   * @param {permCallback} callback
   */
  function checkFilePerms(filename, userId, otherId, callback) {
    if (!userId) {
      callback('noid', false);
      return;
    }
    const mydir = userdata + userId + traxsubdir;
    const pubdir = trackdata;
    const normFilename = path.normalize(filename);
    if (typeof otherId !== 'undefined' && otherId !== userId) {
      checkFriendFilePerms(filename, userId, otherId, callback);
      return;
    }
    if (normFilename.indexOf(mydir) != 0 && normFilename.indexOf(pubdir) != 0) {
      callback('baddir', false);
      return;
    }
    callback(null, true);
  }

  /**
   * Checks if the given userId has permission to view otherId's data.
   *
   * @private
   * @param {string} filename The filename to check if userId has perms.
   * @param {number} userId The user id we are checking permissions for.
   * @param {number} otherId A friend Id to check if we have perms.
   * @param {permCallback} callback
   */
  function checkFriendFilePerms(filename, userId, otherId, callback) {
    checkIfFriends(userId, otherId, function(err, res) {
      if (err || !res) {
        callback(err, false);
        common.log(
            (userId || 'No Id') + ' Requested non-friend\'s data: ' +
            (otherId || 'No Id') + ' ' + err);
      } else {
        checkFilePerms(filename, otherId, undefined, callback);
      }
    });
  }

  /**
   * Checks if the given userId has permission to view the given filenames.
   *
   * @private
   * @param {array} fileList Array of filenames to check.
   * @param {number} userId The user id we are checking permissions for.
   * @param {number} otherId A friend Id that must be provided if the filename
   * is
   * in a different user's userdata.
   * @param {permCallback} callback
   */
  /* function checkAllFilePerms(fileList, userId, otherId, callback) {
    let responded = false;
    cb = function(err, perms) {
      if (!responded && (err || !perms)) callback(err, perms);
      responded = true;
    };
    for (let i = 0; i < fileList.length; i++) {
      checkFilePerms(fileList[i], userId, otherId, cb);
    }
  } */

  /**
   * Appends a given session chunk to its file. Creates parent directories if
   * necessary. Responds to socket.
   *
   * @private
   * @param {number} attempts Number of different failure recovery options we
   * have remaining to try.
   * @param {string} filename The base name of the file we are writing to.
   * @param {string} dirname The directory we are writing filename to.
   * @param {string} chunkId The id of the chunk we are writing in order to tell
   * the client the status of this chunk.
   * @param {string} buffer The data to write to the file.
   * @param {socket} socket The socket.io socket to respond to with status
   * updates.
   */
  /* function appendFile(attempts, filename, dirname, chunkId, buffer, socket) {
    attempts--;
    if (typeof filename === 'undefined' || filename.length < 1) {
      socket.emit('fail', 'invalidname');
      return;
    }
    fs.appendFile(filename, buffer, {mode: 0o600}, function(err) {
      if (err) {
        if (attempts == 0) {
          common.error('Failed to append file: "' + filename + '"', socket.id);
          console.log(err);
          socket.emit('fail', 'writeerror', chunkId);
        } else if (attempts == 1) {
          mkdirp(dirname, {mode: 700}, function(err2) {
            if (err2) {
              attempts = 0;
              common.error('Failed to create dir: ' + dirname, socket.id);
              console.log(err);
              socket.emit('fail', 'writeerror', chunkId);
            } else {
              appendFile(attempts, filename, dirname, chunkId, buffer, socket);
            }
          });
        }
      } else {
        socket.emit('success', chunkId);
        attempts = 0;
      }
    });
  } */

  /**
   * Appends a given session chunk to its file. Responds to socket.
   *
   * @private
   * @param {string} filename The base name of the file we are writing to.
   * @param {string} sessionId The session id the client requested to append to,
   * in case it doesn't exist and we need to inform them of such.
   * @param {string} chunkId The id of the chunk we are writing in order to tell
   * the client the status of this chunk.
   * @param {string} buffer The data to write to the file.
   * @param {socket} socket The socket.io socket to respond to with status
   * updates.
   * @param {boolean} [retry=true] Attempt to create the directory and retry
   * writing if the first try fails.
   */
  function appendChunk(
      filename, sessionId, chunkId, buffer, socket, retry = true) {
    fs.appendFile(filename, buffer, {mode: 0o600}, function(err) {
      if (err) {
        if (retry) {
          mkdirp(path.dirname(filename), {mode: 700}, function(err2) {
            if (err2) {
              common.error(
                  'Failed to create directory: "' + filename + '" ' + err2,
                  socket.id);
              socket.emit('fail', 'writeerror', chunkId);
            } else {
              fs.writeFile(filename, buffer, {mode: 0o600}, function(err3) {
                if (err3) {
                  common.error(
                      'Failed to write file in directory: "' + filename + '" ' +
                          err3,
                      socket.id);
                } else {
                  common.log(
                      'Created directory and file for session: ' + filename,
                      socket.id);
                  socket.emit('fail', 'createsession', sessionId);
                }
              });
            }
          });
        } else {
          common.error(
              'Failed to append file: "' + filename + '" ' + err, socket.id);
          socket.emit('fail', 'writeerror', chunkId);
        }
      } else {
        socket.emit('success', chunkId);
      }
    });
  }

  /**
   * Forwards received chunk data to all clients requesting live data.
   *
   * @private
   * @param {string} userId The Id of the user sending the data.
   * @param {string} chunkId The id of the chunk we are forwarding.
   * @param {string} buffer The data to forward.
   * @param {boolean} [isPublic=false] Should this stream be sent to everybody
   * not just friends?
   */
  function forwardChunk(userId, chunkId, buffer, isPublic) {
    if (liveSockets.length == 0) return;
    if (!isPublic) {
      getFriendsList(userId, friendStatus, function(err, rows) {
        if (err) {
          common.log('Failed to get friends list for ' + userId + ': ' + err);
          return;
        }
        for (let i = -1; i < rows.length; i++) {
          const friendId = (i < 0) ? userId : rows[i].id;
          for (let j = 0; j < liveSockets.length; j++) {
            if (friendId == liveSockets[j].userId) {
              liveSockets[j].emit('livefrienddata', userId, chunkId, buffer);
            }
          }
        }
      });
    } else {
      for (let j = 0; j < liveSockets.length; j++) {
        liveSockets[j].emit('livefrienddata', userId, chunkId, buffer);
      }
    }
  }

  /**
   * Takes an array of directories describing a track, and returns an array of
   * objects of the names and ids of the tracks.
   *
   * @private
   * @param {array} idArray The array of absolute paths to tracks and configs.
   * @param {callback} callback Callback containing only the returned object as
   * an
   * argument.
   */
  function trackIdsToNames(idArray, callback) {
    let fileList = [];
    let numFail = 0;
    for (let i = 0; i < idArray.length; i++) {
      let filename = path.normalize(idArray[i] + '/data.json');
      fs.readFile(filename, function(err, data) {
        if (err) {
          numFail++;
          common.error('Failed to read /data.json ' + err);
        }
        try {
          if (!err) {
            let fileData;
            try {
              fileData = JSON.parse(data);
            } catch (e) {
              common.error(filename + e);
              callback([]);
              return;
            }
            fileList.push(fileData);
          }
        } catch (e) {
          numFail++;
          common.error('Failed to parse data.json ' + e);
          console.log(e);
        }
        if (fileList.length + numFail == idArray.length) {
          callback(fileList);
        }
      });
    }
  }

  /**
   * Gets list of all users with relation to userId.
   *
   * @private
   * @param {string} userId The id of the user we are looking up.
   * @param {number} relation Relation number to filter for.
   * @param {rowCallback} callback
   */
  function getFriendsList(userId, relation, callback) {
    let toSend = sqlCon.format(
        'SELECT * FROM ?? WHERE (??=? OR ??=?)',
        [friendTable, 'user1', userId, 'user2', userId]);
    if (typeof relation !== 'undefined') {
      toSend += sqlCon.format(' AND ??=?', [statusColumn, relation]);
    }
    sqlCon.query(toSend, function(err, res) {
      if (err) {
        common.error(err);
        callback('Data format error', false);
      } else {
        if (!res || res.length == 0) {
          callback(null, []);
          return;
        }
        let chunk = function(res) {
          let friendsList = [];
          let numRes = 0;
          let cb = function(data) {
            numRes++;
            friendsList = friendsList.concat(data);
            if (numRes == res.length) callback(null, friendsList);
          };
          let query = function(res) {
            const Id = res['user1'] == userId ? res['user2'] : res['user1'];
            const toSend = sqlCon.format(
                'SELECT * FROM ?? WHERE ??=?', [accountsTable, 'id', Id]);
            sqlCon.query(toSend, function(err, res2) {
              if (err) common.error(err);
              if (err || !res2 || res2.length == 0) {
                res2 = [];
              } else {
                for (let j = 0; j < res2.length; j++) {
                  // I am assuming nobody will have the name 'undefined' here.
                  if (res2[j]['firstName'] === 'undefined' ||
                      !res2[j]['firstName']) {
                    res2[j]['firstName'] = '';
                  }
                  if (res2[j]['lastName'] === 'undefined' ||
                      !res2[j]['lastName']) {
                    res2[j]['lastName'] = '';
                  }
                  res2[j]['relation'] = res[statusColumn];
                  res2[j]['usernum'] = res['user1'] == userId ? 1 : 2;
                  res2[j]['perms'] = 'REDACTED';
                  res2[j]['email'] = 'REDACTED';
                }
              }
              cb(res2);
            });
          };
          for (let i = 0; i < res.length; i++) {
            query(res[i]);
          }
        };
        chunk(res);
      }
    });
  }

  /**
   * Gets the relation between two users.
   *
   * @private
   * @param {string} user The id of the user we are looking up.
   * @param {string} friend The id of the other user we are comparing.
   * @param {rowCallback} callback
   */
  function getFriendRelation(user, friend, callback) {
    const toSend = sqlCon.format(
        'SELECT * FROM ?? WHERE (??=? AND ??=?) OR (??=? AND ??=?)', [
          friendTable,
          'user1',
          user,
          'user2',
          friend,
          'user1',
          friend,
          'user2',
          user,
        ]);
    sqlCon.query(toSend, function(err, res) {
      if (err) common.error(err);
      callback(err ? 'sqlerr' : null, res ? res[0] : undefined);
    });
  };

  /**
   * Checks the versionNumFile for updated current app version.
   *
   * @private
   */
  function updateVersionNum() {
    fs.stat(versionNumFile, function(err, stats) {
      if (err) {
        common.error(err);
        return;
      }
      let mtime = stats['mtime'] + '';
      if (versionNumLastUpdate === mtime &&
          typeof versionNumFile !== 'undefined') {
        return;
      }

      versionNumLastUpdate = mtime;
      fs.readFile(versionNumFile, function(err, data) {
        if (err !== null) {
          common.error(err);
          return;
        }
        common.log('Updating ' + versionNumFile);
        try {
          versionNum = data.toString();
          sendVersionToAll();
        } catch (e) {
          common.error(e);
        }
      });
    });
  }
  /**
   * Sends the version number to all connected clients.
   *
   * @private
   */
  function sendVersionToAll() {
    for (let i = 0; i < sockets.length; i++) {
      sockets[i].emit('version', versionNum);
    }
  }

  /**
   * Send notifications via Firebase.
   */
  /* const topicHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'key=' + auth.firebaseNotificationKey,
  };
  const sendTopic = {
    hostname: 'fcm.googleapis.com',
    path: '/fcm/send',
    headers: topicHeaders,
    port: 443,
    method: 'POST',
  };
  function sendEventToTopic(topic, message) {
    common.log('Sending topic request: ' + topic + message);
    message = '{\n  "to": "/topics/' + topic +
        '",\n  "data": {\n    "message":  "' + (message || topic) + '",\n }\n}';
    let req = https_.request(sendTopic, function(response) {
      let content = '';
      response.on('data', function(chunk) {
        content += chunk;
      });
      response.on('end', function() {
        common.log('Firebase replied: ' + content);
      });
      response.on('close', function() {
        common.log('Firebase request closed! ' + content.length);
      });
      response.on('error', function() {
        common.log('Firebase request errored! ' + content.length);
      });
    });
    req.write(message);
    req.end();
    req.on('error', function(e) {
      common.error(e);
    });
  } */
}

module.exports = new TraXServer();
