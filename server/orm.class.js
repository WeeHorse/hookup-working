var System = require('./system.class');

module.exports = class Orm extends System{

  constructor(){
    super();
    this.db = this.modules.mysql.createPool(this.config.db);
  }

  middleware(req, res, next){
    console.log('req', req);
    if(true){
      res.json({a:1});
      res.end();
    }else{
      next();
    }
  }

}
