var authService = require('../service/AuthService');


exports.register = function (req, res) {
  let register = authService.Register(req.body, function (err, result) {
    if (err)
      res.send(err);
    res.send(result);
  })
}

exports.login = function (req, res) {
  let login = authService.Login(req.body, function (err, result) {
    if (err)
      res.send(err)
    res.send(result);
  })
}

exports.verify = function (req, res) {
  let verify = authService.Verify(req.body, function (err, result) {
    if (err)
      res.send(err)
    console.log({ result })
    res.send(result);
  })
}

exports.validate_token = function (req, res) {
  let validate = authService.Validate(req.body.token, function (err, result) {
    if (err)
      res.send(err.message);
    console.log({ message })
    res.send(result);
  })
}

exports.simple_hello = function (req, res) {
  res.send("Server up and running...login or register to continue
}
