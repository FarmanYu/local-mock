var http = require('http'),
		url = require('url');
/**
 * @param options {object}
 * @param callback {function}
 * @example options:
 *    {
 *		url : 'xxx',
 *		param : {
 *         id : "11"
 *		},
 *		method : 'GET/POST' //deafult post
 *    },
 *    requestType : "application/json"
 */
var network = {
	get: function(options, callback) {
		var urlInfo = url.parse(options.url);
		var data = options.param;
		var requestOptions = {
			host: urlInfo.host,
			path: urlInfo.pathname,
			port: urlInfo.port || 80,
			method: options.method || "POST",
			headers: {
				'Content-Type': options.requestType || 'application/json',
				'Content-Length': data.length
			}
		};
		var req = http.request(requestOptions, function(res) {
			console.log(options.url + " " + res.statusCode);
			var body = "";
			res.setEncoding('utf8');
			res.on("data", function(chunk) {
				body += chunk;
			});
			res.on("end", function() {
				 callback(body);
			});
		});
		req.on("error", function(e) {
			console.log("problem with request :" + e.message);
		});
		req.write(data);
		req.end();
	}
};

module.exports = network;