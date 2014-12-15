var http = require("http"),
    fs = require("fs"),
    urlParse = require("url"),
    path = require("path"),
    network = require("./network"),
    conf = require('./config'),
    Mock = require("mockjs"),
    self;

var Main = {
  server:null,
  start: function() {
    console.log("Listener was start, at " + conf.PORT);
    self = this;
    self.server = null;
    self.server = http.createServer(function(request,res){
      var pathname = urlParse.parse(request.url).pathname;
      if(pathname !== '/favicon.ico'){
          self.log("Request " + pathname);
		  if(pathname == '/'){
		  	self.resposeToClient(res, conf.paths);
			return;
		  }
          var result = self.match(pathname);
          if(!result){
            self.errorHandler(res);
            return;
          }
          if(!/^http/.test(result)){
            var getewd = process.cwd();
            var filePath = getewd + path.sep + result;
            try{
                var stats = fs.statSync(filePath);
                if(!(stats && stats.isFile())){
                    self.errorHandler(res);
                    return;
                }
            }catch (e) {
                self.errorHandler(res);
                return;
            }
            self.staticFileService(filePath,res);
          } else{
            var body = "", name = "_" + result.replace(/\//g,"").replace(/\./g,"").replace(/\:/g,"");
            request.addListener("data", function(chunk){
                body += chunk;
            });
            request.addListener("end", function() { 
                network.get({
                 url : result,
                 param : body,
                 requestType : request.headers['Content-Type']
               }, function(json){                    
                  var data = JSON.parse(json);
                  data = Mock.mock(data);
                  self.resposeToClient(res, data);
                });
            });
          }
      }
    });
    return self.server;
  },
  resposeToClient : function(res, data){
    self.log("Respose Status: 200");
    res.writeHead('200',{
      'Access-Control-Allow-Headers':'Content-Type, Accept',
      'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Max-Age':30 * 24 * 3600
    });
    res.end(JSON.stringify(data, null, 4));
  },
  errorHandler: function(res) {
      self.log("Respose status: 404");
      res.writeHead('404',{'Content-Type': 'text/html'});
      res.end("<h1>hi all this request is 404 or handler is bad</h1>");
  },
  log: function(log){
    console.log((new Date().toString().match(/\d{1,2}:\d{1,2}:\d{1,2}/)[0])+" : " + log);
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
        self.resposeToClient(res, json);
    });
  }
};
Main.start().listen(conf.PORT);
