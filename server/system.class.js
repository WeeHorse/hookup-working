var config = require('../config.json'),
    packageJson = require('../package.json');

module.exports = class System{

  constructor(){
    this.config = config;
    this.modules = {};
    this.registerModules();
    var path = this.modules.path;
    this.basePath = path.normalize(path.join(__dirname,'../'.split('/').join(path.sep)));
    this.clientPath = path.normalize(path.join(this.basePath, this.config.clientPath));
  }

  listModules(){
    return [...Object.keys(packageJson.dependencies), ...this.config.modules];
  }

  registerModules(){
    this.listModules().forEach((module)=>{
      this.modules[module.replace(/(\-)(\w)/g, function(r){return r[1].toUpperCase();})] = require(module);
    });
  }

}
