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
    this.server = http.createServer(function(request, response) {
      self.bindBlankForRes(response);
      var pathname = urlParse(request.url).pathname;
      if (pathname.indexOf("favicon.ico") != -1) return;
      console.log((new Date().getTime())+" : " + pathname);
      var result = self.match(pathname);
      if (result) {
        result = result.replace(/\//, '\\');
        var getewd = process.cwd()
        var filePath = getewd + path.sep + 'data' + path.sep + result;
        try {
          var stats = fs.statSync(filePath);
        } catch (e) {
          response.sendBlank();
        }
        if (stats.isFile()) {
          fs.readFile(filePath,"utf-8", function(err, template) {
            if (err) {
              self.writeBlank(response);
            }
            
            var json = {};
            try{
              json = JSON.parse(template);
              json = Mock.mock( json );
            } catch(e){
              response.sendBlank();
            }
            response.end(JSON.stringify(json, null, 4));
          });
        } else {
          response.sendBlank();
        }
      } else {
        response.sendBlank();
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
      self.update();
      console.log("config is update!!");
      conf = require(CONFFILE);
    })
  }

};
Main.start();

// var server = http.createServer(function(request, response) {

// })
// server.listen(8096)