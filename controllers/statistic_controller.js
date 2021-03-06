var models = require('../models/models.js');

var Quiz = models.Quiz;
var Comment = models.Comment;

exports.stats = function(req, res, next) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    var stats = {questionNumber: 0, commentNumber: 0, avgComment: 0, questionWithoutComments: 0, questionWithComments: 0};
    Quiz.count().then(
        function(count){
            stats.questionNumber = count;
            Comment.count().then(
                function(ccount){
                    stats.commentNumber = ccount;                         
                    Quiz.avgCommentCount(
                        function(c){
                            stats.avgComment = c[0].c;
                            Quiz.noCommentCount(
                                function(c){
                                    stats.questionWithoutComments = c[0].c;
                                    Quiz.commentCount(
                                        function(c){
                                            stats.questionWithComments = c[0].c;
                                            res.render('stats/stats', {stats: stats, errors: errors});
                                        },function(err){
                                            next(err);
                                        }                                        
                                    );
                                },
                                function(err){
                                    next(err);
                                }                               
                            );                           
                        }, function(err){
                            next(err);
                        }
                    );                    
                }
            ).catch(function(error){next(error)});
        }
    ).catch(function(error){next(error)});
    //res.render('stats/stats', {stats: stats, errors: errors});
};