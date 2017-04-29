var System = require('./system.class'),
    Route = require('./route.class');

module.exports = class Orm extends System{

  constructor(){
    super();
    this.db = this.modules.mysql.createPool(this.config.db);
  }

  middleware(req, res, next){
    var route = new Route(req);
    console.log('route', route);
    if(route.valid){
      console.log('this', this);
      this[route.method](route, function(response){
        res.json(response);
        res.end();
      });
    }else{
      next();
    }
  }

  GET(route, cb){
    var q = "SELECT * FROM ??";
    var p = {};
    (route.id || route.filter) && (q += " WHERE ?");
    route.id && (p.id = route.id);
    route.filter && (p = route.filter);
    this.db.query(q, [route.table, p], function(err, rows, fields){
      console.log('rows', rows);
      cb(rows);
    });
  }

}
