var System = require('./system.class'),
    Route = require('./route.class');

module.exports = class Orm extends System{

  constructor(){
    super();
    this.db = this.modules.mysql.createPool(this.config.db);
  }

  // mapRoute(req){
  //   var parts = req.url.split('/');
  //   this.route = {
  //     method: req.method,
  //     type: null,
  //     table: null,
  //     id: null,
  //     filter: null,
  //     sort: null
  //   };
  //   this.route.type = parts.shift();
  //   if(this.route.type.indexOf(['concepts', 'entities', 'views']) < 0){
  //     return false;
  //   }
  //   this.route.table = parts.shift();
  //   if(!this.route.table){ // or not in db
  //     return false;
  //   }
  //   var filter = parts.shift();
  //   if(filter && Number.isSafeInteger(filter/1)){
  //     this.route.id = filter;
  //   }else if(filter){
  //     this.route.filter = filter;
  //   }
  //   var sort = parts.shift();
  //   if(sort){
  //     this.route.sort = sort;
  //   }
  //   return true;
  // }

  middleware(req, res, next){
    var route = new Route(req);
    if(route.valid){
      console.log(route);
      res.json(route);
      res.end();
    }else{
      next();
    }
  }

}
