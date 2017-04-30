module.exports = class Route{

  constructor(req){
    this.method = req.method;

    var parts = req.url.replace(/^\//,'').split('/');

    var type = parts.shift();
    this.type = (type && ['concepts', 'entities', 'views'].indexOf(type) > -1)? type : null;

    var table = parts.shift();
    this.table = (table && this.inDb(table))? table : null;

    var filter = parts.shift();
    this.id = (filter && Number.isSafeInteger(filter/1))? filter : null;
    this.filter = (filter && !this.id)? filter : null;

    var sort = parts.shift();
    this.sort = sort || null;

    this.request = {};
    this.request.body = req.body || null;
    this.request.session = req.session || null;

    this.valid = this.method && this.type && this.table;
  }

  inDb(table){
    return true;
  }

}
