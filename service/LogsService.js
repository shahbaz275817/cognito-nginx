
var exec = require('child_process').exec; // required for executing shell commands 
const fs = require('fs') // used for file handling
const readline = require('readline');
const stream = require('stream');

exports.getLogs = function (body, type, callback) {
  const filename = `/var/log/nginx/${type}.log`
  let logFileInputStream = fs.createReadStream(filename)

  let outputResponseCollectorStream = new stream()
  outputResponseCollectorStream.readable = true
  outputResponseCollectorStream.writable = true

  var rl = readline.createInterface({
    input: logFileInputStream,
    output: outputResponseCollectorStream,
    terminal: false
  });

  let lineCount = 0;
  const idx = Number(body.idx)
  const range = getRange(idx)


  let resData = []
  rl.on('line', function (line) {
    lineCount++;
    if (lineCount >= range.startLine && lineCount <= range.endLine) {
      resData.push(line)
    }
    if(lineCount > range.endLine) rl.close();
  });

  rl.on('error', function (err) {
    callback(err);
  })

  rl.on('close', function () {
    callback(null, { ...resData })
  })

}

const getRange = (index) => {
  const LOGS_LIMIT = 5;
  const endLine = index * LOGS_LIMIT
  const startLine = endLine - LOGS_LIMIT

  return {startLine, endLine}
}
