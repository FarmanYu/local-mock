var http = require("http"),
    fs = require("fs"),
    urlParse = require("url"),
    path = require("path");
try{
  var conf = require('./config'),Mock = require("mockjs"),self;
}catch(e){
  console.log('not find module config or mock.js');
  return false;
}
var Main = {
  server:null,
  start: function() {
    console.log("Listener was start, at " + conf.PORT);
    self = this;
    self.server = null;
    self.server = http.createServer(function(request,res){
      var pathname = urlParse.parse(request.url).pathname;
      if(pathname !== '/favicon.ico'){
          console.log((new Date().toString().match(/\d{1,2}:\d{1,2}:\d{1,2}/)[0])+" : " + pathname);
          var result = self.match(pathname);
          if(!result)self.errorHandler(res);
          var getewd = process.cwd()
          var filePath = getewd + path.sep + result;
          try{
              var stats = fs.statSync(filePath);
              if(!(stats && stats.isFile())){
                  self.errorHandler(res);
              }
          }catch (e) {
              self.errorHandler(res);
          }
          self.staticFileService(filePath,res);
      }
    });
    return self.server;
  },
  errorHandler: function(res) {
      res.writeHead('404',{'Content-Type': 'text/html'});
      res.end("<h1>hi all this request is 404 or handler is bad</h1>");
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
  staticFileService:function(filePath,res){
    fs.readFile(filePath, "utf-8", function(err, template) {
        if (err) {
          self.errorHandler(res);
        }
        var json = {};
        try{
          json = JSON.parse(template);
          json = Mock.mock(json);
        } catch(e){
          self.errorHandler(res);
        }
        res.writeHead('200',{
          'Access-Control-Allow-Headers':'Content-Type, Accept',
          'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Max-Age':30 * 24 * 3600
        });
        res.end(JSON.stringify(json, null, 4));
    });
  }
};
Main.start().listen(conf.PORT);