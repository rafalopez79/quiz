var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  
    omitNull: true      
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

Quiz.avgCommentCount = function(callback, cerror){    
    sequelize.query("SELECT ROUND(AVG(c),2) as c FROM (SELECT a.id, COUNT(DISTINCT b.id) c FROM \"Quizzes\" a LEFT JOIN \"Comments\" b ON a.id = b.\"QuizId\"  GROUP BY a.id ) a")
    .then(function(c){ callback(c);})
    .catch(function(error){cerror(error)});
};

Quiz.noCommentCount = function(callback, cerror){    
    sequelize.query("SELECT COUNT(*) as c FROM \"Quizzes\" a WHERE NOT EXISTS (SELECT 1 FROM \"Comments\" b WHERE a.id = b.\"QuizId\") ")
    .then(function(c){ callback(c);})
    .catch(function(error){cerror(error)});
};

Quiz.commentCount = function(callback, cerror){    
    sequelize.query("SELECT COUNT(*) as c FROM \"Quizzes\" a WHERE EXISTS (SELECT 1 FROM \"Comments\" b WHERE a.id = b.\"QuizId\") ")
    .then(function(c){ callback(c);})
    .catch(function(error){cerror(error)});
};


exports.Quiz = Quiz;
exports.Comment = Comment;

sequelize.sync().success(
    function(){
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.create( {pregunta: 'Capital de Italia',   respuesta: 'Roma', tematica: 'otro'});
            Quiz.create( {pregunta: 'Capital de Portugal',   respuesta: 'Lisboa' , tematica: 'otro'})
            .then(function(){console.log('Base de datos inicializada')});
          };
        });
    }
);