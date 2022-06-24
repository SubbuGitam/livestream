let Stream = require("node-rtsp-stream");
ws = require('ws')
url = require('url')
STREAM_MAGIC_BYTES = "jsmp"
let wsServer = new ws.Server({
  port: 6789
})

wsServer.on("connection", (socket, request) => {

  return onSocketConnect(socket, request)
})




const onSocketConnect = function (socket, request) {


  var streamHeader
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  streamHeader = new Buffer(8)
  streamHeader.write(STREAM_MAGIC_BYTES)
  streamHeader.writeUInt16BE(this.width, 4)
  streamHeader.writeUInt16BE(this.height, 6)
  socket.send(streamHeader, {
    binary: true
  })
  //console.log(`Conn Url ${request.url} sfgjkdshfdskh`);
  const queryObject = url.parse(request.url, true).query;

  this.streamUrl = queryObject.id;
  socket.id = queryObject.id;
  socket.remoteAddress = request.connection.remoteAddress

  console.log(queryObject.id);
  stream = new Stream({
    name: "Streaming",
    // streamUrl: "rtsp://YOUR_IP:PORT",
    streamUrl: queryObject.id,
    soc: wsServer,
    wsPort: 6789,
    ffmpegOptions: { // options ffmpeg flags
      "-f": "mpegts", // output file format.
      "-codec:v": "mpeg1video", // video codec
      "-b:v": "2000k", // video bit rate
      "-stats": "",
      "-r": 25, // frame rate
      "-s": "640x480", // video size
      "-bf": 0,
      // audio
      "-codec:a": "mp2", // audio codec
      "-ar": 44100, // sampling rate (in Hz)(in Hz)
      "-ac": 1, // number of audio channels
      "-b:a": "128k", // audio bit rate
    },
  });


  return socket.on("close", (code, message) => {
    return console.log("exited")
  })
}



