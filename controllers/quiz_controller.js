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
    res.render('quizes/show',{ quiz: req.quiz});
};

exports.answer = function(req, res){   
    var resultado = "Incorrecto";    
    if (req.query.respuesta ===req.quiz.respuesta){         
        res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
    }else{
        res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
    };        
};
exports.index = function(req, res){   
    var search = req.query.search;
    if (search){
       search = '%'+search+'%';
       search = search.replace(' ','%');
       models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes){
           res.render('quizes/index', { quizes: quizes});
        }).catch(function(error){ next(error);});
    }else{
        models.Quiz.findAll().then(function(quizes){
           res.render('quizes/index', { quizes: quizes});
        }).catch(function(error){ next(error);});
    }
};