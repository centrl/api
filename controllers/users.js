module.exports = function(db) {
    var usersCollection = db.collection('users');

    return {
        findOne: function(uid, cb) {
            usersCollection.findOne({uid: uid}, function(err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        },

        findOrCreate: function(user, cb) {
            usersCollection.findAndModify({
                uid: user.uid
            },
            null, {
                $setOnInsert: user
            }, {
                new: true,
                upsert: true
            }, function(err, user) {
                if (err) {
                    return cb(err);
                }

                cb(null, user);
            });
        }
    };
};
