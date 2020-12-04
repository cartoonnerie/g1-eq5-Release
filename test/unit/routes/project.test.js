const Project = require('../../../src/models/project');
const Backlog = require('../../../src/models/backlog');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../src/app');
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('Projects routes', () => {

    beforeEach((done) => {
        Project.deleteMany({}).then(() => done());
    });

    describe('TTES-08 /GET projects', () => {
        it('should GET projects list ', () => {
            chai.request(server)
                .get('/projects')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });
        });
    });

    describe('TTES-03 /POST projects', () => {
        it('should POST a project', () => {
            chai.request(server)
                .post('/projects')
                .send('key=TES3&name=project')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                });
        });
        it('should not POST an existing project', () => {
            chai.request(server)
                .post('/projects')
                .send('key=TES3&name=project')
                .end((err, res) => {
                    res.should.have.status(201);
                });
            chai.request(server)
                .post('/projects')
                .send('key=TES3&name=project')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                });
        });

    });

    describe('TTES-05 /PUT projects', () => {
        const name = 'chaitest';
        const key = 'CTES';
        let id;

        beforeEach((done) => {
            let project = new Project({name: name, key: key, backlog: new Backlog(), tasks: []});
            project.save().then(() => {
                Project.findOne({name: name}).then((p) => {
                    id = p._id;
                    done();
                });
            });
        });

        it('should PUT a project', () => {
            chai.request(server)
                .put('/projects/update')
                .send('_id='+id+'&name=project')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });
        });
        it('should not PUT a project with a wrong id', () => {
            chai.request(server)
                .put('/projects/update')
                .send('_id=848dv&name=project')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                });
        });

    });

    describe('TTES-02 /GET projects/create', () => {
        it('should GET a project form', () => {
            chai.request(server)
                .get('/projects/create')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                });
        });
    });
});
