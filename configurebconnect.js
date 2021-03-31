const { json } = require('body-parser');
var Struct = require('struct');
var configs = require('./config/bman.config')
var packetTypes = require('./app/models/packettypes.model');
var requestTypes = require('./app/models/requesttypes.model');
var net = require('net');
const { request } = require('http');


const start_read = '\xe2\x94\x90';
const end_read = '\xe2\x94\x94';


function formatPacket( packetData, packetEnum) {
    packetData = packetData + "\00"
    const packetSize = Buffer.byteLength(packetData, 'utf8')
    const Packet =  Struct()
        .word16Ule('packetEnum')
        .chars('packetData', packetSize)
    Packet.allocate()
    var buffer = Packet.buffer();
    var proxy = Packet.fields;
    proxy.packetEnum = packetEnum;
    proxy.packetData = packetData;
    return buffer
}

function formatRequest(requestId, packetData, packetEnum) {
    packetData = `"${requestId}" "${packetData}"`
    return formatPacket(packetData, packetEnum)
}



function convertToJson(data) {
    const packetStart = data.indexOf(start_read, 0, 'ascii')
    const packetEnd = data.indexOf(end_read, packetStart, 'ascii')
    const jsonString = data.slice(packetStart + 7,packetEnd).toString();
    
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return undefined
    }

}

function respondToPing(client) {
    // send a packet back with the ping response
    client.write(formatPacket("1",1))
}

function requestScoreboard(client) {
    client.write(formatRequest("1","1", 7 ))
}


function tdmRequests(data, client) {
    if (data.EventID == 41) {
        console.log("Got ping")
        if (parseInt(data.Time) % 2 == 0) {
            requestScoreboard(client);
        }
    }
}

function dmRequests(data, client) {
    if (data.EventID == 41) {
        respondToPing(client);
        if (parseInt(data.Time) % 2 == 0) {
            requestScoreboard(client);
        }
    }
}

function svlRequests(data, client) {
    if (data.EventID == 41) {
        respondToPing(client);
        if (parseInt(data.Time) % 2 == 0) {
            requestScoreboard(client);
        }
    }
}

module.exports = function configureBConnect(io) {
    configs.forEach((serverConfig) => {
        console.log(serverConfig.ip)
        var client = new net.Socket();
        console.log(serverConfig.port)
        console.log(serverConfig.ip)
        client.connect( serverConfig.port, serverConfig.ip, function() {
            client.write(formatPacket(serverConfig.password, 0));
        })
        client.on('data', function(data) {
            data = convertToJson(data)
            if (data !== undefined) {
                switch (serverConfig.gamemode) {
                    case "tdm":
                        tdmRequests(data, client);
                        break;
                    case "dm":
                        dmRequests(data, client);
                        break;
                    case "svl":
                        svlRequests(data, client);
                        break
                    case "ctf":
                        svlRequests(data, client);
                        break
                }
                var packetType = packetTypes[parseInt(data.EventID)]
                
                if (packetType == "request_data") {
                    packetType = requestTypes[parseInt(data.CaseID)]
                }


                console.log(data)
                console.log(serverConfig.roomName)
                io.to(serverConfig.roomName).emit(packetType, data)
            }
            
        });
        client.on('close', function() {
            client.setTimeout(10000, function() {
                client.connect(serverConfig.port, serverConfig.ip, () => {
                    client.write(formatPacket(serverConfig.password, 0));
                });
            })
        });
        client.on('error', function(e) {
            console.error(e)
        })
    })
}
