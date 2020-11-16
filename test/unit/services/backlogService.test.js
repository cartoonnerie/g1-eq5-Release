process.env.NODE_ENV = 'test';

const assert = require('assert');
const backlogService = require('../../../src/services/backlogService');
const dbConfig = require('../../../config/db');
const UserStory = require('../../../src/models/userStory');
const Backlog = require('../../../src/models/backlog');
const Project = require('../../../src/models/project');

function testCatchAdd(done, project, name, description){
    backlogService.addUserStory(project, name, description)
    .catch(() => {
        UserStory.countDocuments((err, count) => {
            assert.deepStrictEqual(count, 0);
            done();
        })
    })
}

function testThenAdd(done, project, name, description){
    backlogService.addUserStory(project, name, description)
    .then((data) => {
        assert(!data.isNew);
        UserStory.countDocuments((err, count) => {
            assert.deepStrictEqual(count, 1);
            done();
        });
    });
}

function testCatchUpdate(done, id, name, description, objId, objName, objDescription){
    backlogService.updateUserStory(id, name, description)
    .catch(() => {
        UserStory.findById(objId)
        .then((p) => {
            assert.deepStrictEqual(p._id, objId);
            assert.deepStrictEqual(p.name, objName);
            assert.deepStrictEqual(p.description, objDescription);
            done();
        });
    });
}

describe('Backlogs service', () => {
    const backlog = new Backlog({sprints:[], userStories:[]});
    const project = new Project({ name: 'mochatest', key: 'MTES', backlog: backlog, tasks: []});
    const name = 'mochaUStest';
    const description = 'Une description test';

    before('connect', function(){
        dbConfig.connectToDB();
    });

    beforeEach('empty db', (done) => {
        UserStory.deleteMany({}).then(() => done());
    });

    describe('TTES-11 Create UserStory', () => {

        it('cannot add an empty userStory', (done) => {
            testCatchAdd(done, null, null, null);
        });
        it('cannot add a userStory with no project', (done) => {
            testCatchAdd(done, null, name, description);
        });
        it('cannot add a userStory with no name', (done) => {
            testCatchAdd(done, project, null, description);
        });
        it('creates a userStory with out description', (done) => {
            testThenAdd(done, project, name, null);
        });
        it('creates a userStory', (done) => {
            testThenAdd(done, project, name, description);
        });
    });

    describe('TTES-14 Update UserStory', () => {
        let id;
        const idUS = "PAC-01"
        const newName = 'mochaUStest BIS';
        const newDescription = 'Une description test BIS';

        beforeEach('create a userStory', (done) => {
            let userstory = new UserStory({id:idUS, name: name, description: description});
            userstory.save().then(() => {
                UserStory.findOne({id: idUS}).then((p) => {
                    id = p._id;
                    done();
                });
            });
        });

        it('cannot update with empty values', (done) => {
            testCatchUpdate(done, null, null, null, id, name, description);
        });
        it('cannot update a userstory with no id', (done) => {
            testCatchUpdate(done, null, newName, newDescription, id, name, description);
        });
        it('cannot update a userstory with no name', (done) => {
            testCatchUpdate(done, id, null, newDescription, id, name, description);
        });
        it('cannot update a userstory with invalid id', (done) => {
            testCatchUpdate(done, 0, newName, newDescription, id, name, description);
        });
        it(' update a userstory with no description', (done) => {
            backlogService.updateUserStory(id, newName, null)
            .then((data) => {
                assert(!data.isNew);
                assert.deepStrictEqual(data._id, id);
                assert.deepStrictEqual(data.name, newName);
                assert.deepStrictEqual(data.description, "");
                done();
            });
        });
        it('update a userstory', (done) => {
            backlogService.updateUserStory(id, newName, newDescription)
            .then((data) => {
                assert(!data.isNew);
                assert.deepStrictEqual(data._id, id);
                assert.deepStrictEqual(data.name, newName);
                assert.deepStrictEqual(data.description, newDescription);
                done();
            });
        });
    });

    describe('TTES-34 ', () => {
        const backlog = new Backlog({sprints:[], userstories:[]});
        const project = new Project({ name: 'mochatest', key: 'MTES', backlog: backlog, tasks: []});
        const idA = 'MTES-01';
        const idB = 'MTES-02';
        const nameA = 'mochaUStestA';
        const descriptionA = 'Une description test A';
        const nameB = 'mochaUStestB';
        const descriptionB = 'Une description test B';

        console.log('parameter');

        beforeEach('add a userStory', async () => {
            await Project.deleteMany({});
            let userstoryA = new UserStory({id: idA, name: nameA, description:descriptionA});
            await userstoryA.save();
            let userstoryB = new UserStory({id: idB, name: nameB, description:descriptionB});
            await userstoryB.save();
            project.backlog.userStories.push(userstoryA);
            project.backlog.userStories.push(userstoryB);
            await project.save();
        });

        it('return the backlog of project', async () => {
            let backlog = await backlogService.getBacklog(project);
            assert.deepStrictEqual(backlog.userStories.length, 2);
            assert.deepStrictEqual(backlog.userStories[0].name, nameA);
            assert.deepStrictEqual(backlog.userStories[1].name, nameB);
            assert.deepStrictEqual(backlog.userStories[0].description, descriptionA);
            assert.deepStrictEqual(backlog.userStories[1].description, descriptionB);
        });
    });
});
