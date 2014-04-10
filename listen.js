var CONFFILE = "./config.js";
var http = require("http"),
    fs = require("fs"),
    conf = require(CONFFILE),
    urlParse = require("url").parse,
    path = require("path"),
    Mock = require("mockjs");

var Main = {
  start: function() {
    this.bindEvent();
    this.update();
    console.log("Listener was start, at " + conf.PORT);
  },
  update: function() {
    var self = this;
    this.server = null;
    this.server = http.createServer(function(request, res) {
      self.bindBlankForRes(res);
      var pathname = urlParse(request.url).pathname;
      if (pathname.indexOf("favicon.ico") != -1) return;
      console.log((new Date().getTime())+" : " + pathname);
      var result = self.match(pathname);
      if (result){
        result = result.replace(/\//g, '\\');
        var getewd = process.cwd()
        var filePath = getewd + path.sep + 'data' + path.sep + result;
        //support ajax Cross domain
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-type","text/plain");
        try {
          var stats = fs.statSync(filePath);
        } catch (e) {
          res.sendBlank();
        }
        if (stats && stats.isFile()) {
          fs.readFile(filePath, "utf-8", function(err, template) {
            if (err) {
              res.sendBlank();
            }
            var json = {};
            try{
              json = JSON.parse(template);
              json = Mock.mock(json);
            } catch(e){
              res.sendBlank();
            }
            res.end(JSON.stringify(json, null, 4));
          });
        } else {
          res.sendBlank();
        }
      } else {
        res.sendBlank();
      }
    }).listen(conf.PORT);
  },
  bindBlankForRes: function(res) {
    res.sendBlank = function(){
      this.end("{}");
    }
  },
  match: function(pathname) {
    var paths = conf.paths;
    var pathURL = path.normalize(pathname);
    var data = false;
    for (var item in paths) {
      var matchURL = path.join(conf.URLBASE, item);
      matchURL = path.normalize(matchURL);
      if (pathURL == matchURL) {
        data = paths[item];
      }
    }
    return data;
  },
  bindEvent: function() {
    var self = this;
    fs.watch(CONFFILE, function() {
      console.log("config is update, please restart!");
    })
  }

};
Main.start();