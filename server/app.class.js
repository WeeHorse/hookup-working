var System = require('./system.class'),
    Orm = require('./orm.class');

module.exports = class App extends System{

  constructor(){
    super();

    // set up express
    var app = this.modules.express();
    app.set('env', this.config.env);
    app.set('trust proxy', (app.get('env') === 'production')? 1: 0); // trust first proxy
    app.use(this.modules.expressSession({
      secret: this.config.secret,
      cookie: {
        secure: (app.get('env') === 'production') // serve secure cookies
      },
    }));
    app.use(this.modules.compression());
    app.use(this.modules.bodyParser.json({limit: this.config.requestBodyLimit}));
    app.use(this.modules.bodyParser.urlencoded({ extended: false }));

    // setup orm
    var orm = new Orm();
    app.use(function(req, res, next){orm.middleware(req, res, next)});

    // all traffic to/from db
    app.all(['/concepts/*', '/entities/*', '/views/*'], function(req, res, next){
      orm.routes(req, res, next);
    });

    // serve frontend files
    app.use(this.modules.express.static(this.clientPath));

    // not found
    app.all('*',function(req, res, next){
      res.status(404);
      res.end();
    });

    app.listen(this.config.port);
    console.log("Express listening on port " + this.config.port);
  }

}
