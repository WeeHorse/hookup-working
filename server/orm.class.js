var System = require('./system.class'),
    Route = require('./route.class');

const NAMED_PLACEHOLDERS = false;

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

  /**
   * Helper to create the SQL portion of
   * SET foo = :foo, bar = :bar
   * type queries
   */
  assocDataToSqlPairs(data){
    var sql = '';
    for(var key in data) {
      if(NAMED_PLACEHOLDERS){
        sql += " " + key + " = :" + key + ",";
      }else{
        sql += " " + key + " = ? ,";
      }
    }
    sql = sql.replace(/,$/,'');
    return sql;
  }

  /**
   * Helper to perform an INSERT or UPDATE (or possibly REPLACE) from a data object
   * (matching the target table schema)
   * ex: this.sqlSet('INSERT', 'users', res.body, callback)
   */
  sqlSet(sqlMethod, table, data, cb){
    var id = false, query;
    // we do not want a SET pair for id on UPDATE
    if(sqlMethod == 'XUPDATE' && data.id){
      id = data.id;
      delete(data.id);
    }
    var sqlPairs = this.assocDataToSqlPairs(data);
    if(NAMED_PLACEHOLDERS){
      query = sqlMethod + " " + table + " SET " + sqlPairs;
    }else{
      query = sqlMethod + " " + table + " SET ?";
    }
    // once the SET pairs are done we can put the id back into data
    if(false && id){
      if(NAMED_PLACEHOLDERS){
        query += " WHERE id = :id";
      }else{
        query += " WHERE id = ?";
      }
      data.id = id;
    }
    console.log('sqlSet query', query);
    this.db.query(query, data, function(err, rows, fields){
      console.log('sqlSet result', err, rows, fields);
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

  INDEX(){ // plain list

  }

  QUERY(){ // filtered query

  }

  POST(route, cb){
    this.sqlSet('REPLACE', route.table, route.request.body, cb);
  }

  PUT(route, cb){
    // add id to the data object if it is not there already
    if(!route.request.body.id && route.id){
      route.request.body.id = route.id;
    }
    this.sqlSet('REPLACE', route.table, route.request.body, cb);
  }

  DELETE(route, cb){
    var q = "DELETE FROM ?? WHERE id = ?";
    this.db.query(q, [route.table, route.id], function(err, rows, fields){
      console.log('DELETE result', err, rows, fields);
      cb(rows);
    });
  }

  CREATE(){

  }

  ALTER(){

  }

  /*

  tableExists($table){
    $statement = $this->db->prepare('SHOW TABLES LIKE :table');
    $statement->execute(array( 'table' => $table ));
    $result = $statement->fetch();
    return $result? true : false;
  }

  GET($request){
    $statement = $this->db->prepare('SELECT * FROM ' . $request->table . ' WHERE id = :id');
    $statement->execute(array( 'id' => $request->id ));
    $result = $statement->fetch(PDO::FETCH_OBJ);
    return $result;
  }

  INDEX($request){
    $statement = $this->db->prepare('SELECT * FROM ' . $request->table);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return $result;
  }

  POST($request){
    $sql = $this->assocArrToSqlPairs($request->body);
    $statement = $this->db->prepare("INSERT INTO " . $request->table . " SET " . $sql);
    $result = $statement->execute($request->body);
    return $result;
  }

  PUT($request){
    // remove id from requestData if it is there, we can't have it now.
    unset($request->body['id']);
    $sql = $this->assocArrToSqlPairs($request->body);
    $statement = $this->db->prepare("UPDATE " . $request->table . " SET " . $sql . " WHERE id = :id");
    // put id in(!) because we need it now.
    $request->body['id'] = $request->id;
    $result = $statement->execute($request->body);
    return $result;
  }

  DELETE($request){
    $statement = $this->db->prepare('DELETE FROM ' . $request->table . ' WHERE id = :id');
    $result = $statement->execute(array( 'id' => $request->id ));
    return $result;
  }
  */

}
