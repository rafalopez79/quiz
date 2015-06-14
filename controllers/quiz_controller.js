var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
    models.Quiz.find(quizId).then(function(quiz){
       if (quiz){
           req.quiz = quiz;
           next();
       }else{
           next(new Error('No existe quizId: '+quizId));
       }
    });    
};

exports.show = function(req, res){
    res.render('quizes/show',{ quiz: req.quiz, errors:[]});
};

exports.answer = function(req, res){   
    var resultado = "Incorrecto";    
    if (req.query.respuesta ===req.quiz.respuesta){         
        res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors:[]});
    }else{
        res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors:[]});
    };        
};

exports.index = function(req, res){   
    var search = req.query.search;
    if (search){
       search = '%'+search+'%';
       search = search.replace(' ','%');
       models.Quiz.findAll({where: ["pregunta like ?", search], order: 'pregunta'}).then(function(quizes){
           res.render('quizes/index', { quizes: quizes, errors:[]});
        }).catch(function(error){ next(error);});
    }else{
        models.Quiz.findAll({order: 'pregunta'}).then(function(quizes){
           res.render('quizes/index', { quizes: quizes, errors:[]});
        }).catch(function(error){ next(error);});
    }
};

exports.new = function(req, res){   
    var quiz = models.Quiz.build({pregunta: 'Pregunta', respuesta: 'Respuesta'});
    res.render('quizes/new', {quiz: quiz, errors:[]});         
};

exports.create = function(req, res){
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate().then(function (err){
        if (err){
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
        }else{
            quiz.save({fields: ["pregunta","respuesta"]}).then(function(){res.redirect('/quizes');});
        }
    });
};