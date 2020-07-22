const logsService = require('../service/LogsService')

exports.accessLogs = function (req, res) {
  const body = req.body
  logsService.getLogs(body,'access', function (err, result) {
    if (err)
      res.send(err);
    res.send(result);
  })
}

exports.errorLogs = function (req, res) {
  const body = req.body
  logsService.getLogs(body,'error',function (err, result) {
    if (err)
      res.send(err);
    res.send(result);
  })
}

