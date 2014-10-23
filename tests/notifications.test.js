var superagent = require('superagent');
var expect = require('expect.js');

describe('centrl rest api server', function() {
    var id;

    it ('post a notification', function(done) {
        superagent.post('http://localhost:3000/test/notification/')
        .send({
            title: 'Test Notification',
            message: 'This is a test notification'
        })
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(res.body.length).to.eql(1);
            expect(res.body[0]._id.length).to.eql(24);

            id = res.body[0]._id;
            done();
        });
    });

    it('Can get a single notification', function(done) {
        superagent.get('http://localhost:3000/test/notification/' + id)
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(typeof res.body).to.eql('object');
            expect(res.body._id.length).to.eql(24);
            expect(res.body._id).to.eql(id);

            done();
        });
    });

    it('Can get all notifications for a project', function(done) {
        superagent.get('http://localhost:3000/test/notifications')
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(res.body.length).to.be.above(0);
            expect(res.body.map(function(item) {
                return item._id;
            })).to.contain(id);

            done();
        });
    });

    it('Can update a notification', function(done) {
        superagent.put('http://localhost:3000/test/notification/' + id)
        .send({
            title: 'Test Notification updated',
            message: 'This notification has been updated'
        })
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(typeof res.body).to.eql('object');
            expect(res.body.msg).to.eql('success');

            done();
        });
    });

    it('Can verify updated object', function(done) {
        superagent.get('http://localhost:3000/test/notification/' + id)
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(typeof res.body).to.eql('object');
            expect(res.body._id.length).to.eql(24);
            expect(res.body._id).to.eql(id);
            expect(res.body.title).to.eql('Test Notification updated');

            done();
        });
    });

    it('Can remove a notification', function(done) {
        superagent.del('http://localhost:3000/test/notification/' + id)
        .end(function(e, res) {
            expect(e).to.eql(null);
            expect(typeof res.body).to.eql('object');
            expect(res.body.msg).to.eql('success');

            done();
        });
    });
});
