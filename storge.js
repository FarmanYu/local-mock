var fs = require("fs"),
	  path = require("path"),
	  fileConf = "temp",
	  fileConfig = "utf-8";
var storge = {
	save: function(name, data) {
		var filePath = this._withPath(name);
		if (!this.hasDataByName(name)) {
			fs.writeFileSync(filePath, data, fileConfig);
		}
	},
	hasDataByName: function(name) {
		var filename = this._withPath(name);
		var hasFile = false;
		try {
			var stats = fs.statSync(filename);
			if (stats && stats.isFile()) {
				hasFile = true;
			}
		} catch (e) {
			hasFile = false;
		}

		return hasFile;
	},
	getDataByName: function(name) {
		var filePath = this._withPath(name);
		if (this.hasDataByName(name)) {
			return fs.readFileSync(filePath, fileConfig);
		} else {
			return "";
		}
	},
	_withPath: function(name){
		var getewd = process.cwd();
		var filePath = getewd + path.sep + fileConf + path.sep + name + ".json";
		return filePath;
	},
	removeByName: function(name) {
		 var filePath = this._withPath(name);
		 if(this.hasDataByName(name)){
		 		fs.unlink(filePath);
		 }
	}
}

module.exports = storge;