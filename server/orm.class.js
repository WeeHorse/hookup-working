var System = require('./system.class'),
    Route = require('./route.class');

module.exports = class Orm extends System{

  constructor(){
    super();
    this.db = this.modules.mysql.createPool(this.config.db);
    console.log('ORM is setup');
  }

  middleware(req, res, next){
    var route = new Route(req);
    console.log('route', route);
    if(route.valid){
      this[route.method](route, function(response){
        res.json(response);
        res.end();
      });
    }else{
      next();
    }
  }


  /**
   * Helper to perform REPLACE (instead of insert or update) from a data object
   * (matching the target table schema)
   * ex: this.replace('users', res.body, callback)
   */
  replace(table, data, cb){
    var query = "REPLACE INTO " + table + " SET ?";
    console.log('sqlSet query', query);
    this.db.query(query, data, function(err, rows, fields){
      console.log('insertUpdate result', err, rows, fields);
      cb(rows);
    });
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

  POST(route, cb){
    this.replace(route.table, route.request.body, cb);
  }

  PUT(route, cb){
    // add id to the data object if it is not there already
    if(!route.request.body.id && route.id){
      route.request.body.id = route.id;
    }
    this.replace(route.table, route.request.body, cb);
  }

  DELETE(route, cb){
    var q = "DELETE FROM ?? WHERE id = ?";
    this.db.query(q, [route.table, route.id], function(err, rows, fields){
      console.log('DELETE result', err, rows, fields);
      cb(rows);
    });
  }

  /*

  tableExists($table){
    $statement = $this->db->prepare('SHOW TABLES LIKE :table');
    $statement->execute(array( 'table' => $table ));
    $result = $statement->fetch();
    return $result? true : false;
  }
  */


}
