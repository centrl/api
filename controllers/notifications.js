module.exports = function() {
    return {
        insert: function(req, res, next) {
            // Append related project onto notification.
            // TODO: Make this a hardset field that cannot be passed.
            var notification = req.body;
            notification.project = req.project;

            req.collection.insert(notification, {}, function(err, result) {
                if (err) {
                    return next(err);
                }

                res.send(result);
            });
        },

        findOne: function(req, res, next) {
            req.collection.findById(req.params.id, function(err, result) {
                if (err) {
                    return next(err);
                }

                res.send(result);
            });
        },

        findAll: function(req, res, next) {
            req.collection.find({
                project: req.project
            },
            {
                limit: 10,
                sort: [['_id', -1]]
            }).toArray(function(err, results) {
                if (err) {
                    return next(err);
                }

                res.send(results);
            });
        },

        update: function(req, res, next) {
            req.collection.updateById(req.params.id, { $set:req.body }, { safe: true, multi: false },
            function(err, result) {
                if (err) {
                    return next(err);
                }

                var json = {};

                if (result === 1) {
                    json.msg = 'success';
                } else {
                    json.msg = 'error';
                }

                res.send(json);
            });
        },

        delete: function(req, res, next) {
            req.collection.removeById(req.params.id, function(err, result) {
                if (err) {
                    return next(err);
                }

                var json = {};

                if (result === 1) {
                    json.msg = 'success';
                } else {
                    json.msg = 'error';
                }

                res.send(json);
            });
        },

        send: function(req, res, next) {
            // TODO????
        }
    };
}();
