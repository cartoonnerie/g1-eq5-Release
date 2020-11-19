const UserStory = require('./../models/userStory');
const Sprint = require('./../models/sprint');

function addUserStory(project, name, description) {
    return new Promise((resolve, reject) => {
        if(!project)
            return reject(new Error('project parameter is required'));
        if(!name)
            return reject(new Error('name parameter is required'));

        const index = project.backlog.currentUSId+1;
        let userStory = new UserStory({id:project.key + '-' +index, name:name, description:description});
        userStory.save()
            .then(() => {
                project.backlog.userStories.push(userStory);
                project.backlog.currentUSId = index;
                resolve(project.save());
            });
    });

}

function getBacklog(project){
    return new Promise((resolve, reject) => {
        if(!project)
            return reject(new Error('project parameter is required'));
        const sprints = getSpints(project.backlog);
        getUserStories(project.backlog.userStories)
            .then(userStories =>
                resolve({
                    sprints: sprints,
                    userStories: userStories
                }));
    });
}

function updateUserStory(id, name, description, difficulty, priority){
    return new Promise((resolve, reject) => {
        if(!id) {
            return reject(new Error('id parameter is required'));
        }
        if (!name || name == "") {
            return reject(new Error('name parameter is required'));
        }
        if(!description) {
            description = ""
        }
        if(!difficulty){
            return reject(new Error('difficulty parameter is required'));
        }
        if(!priority){
            return reject(new Error('priority parameter is required'));
        }
        if(priority < 0 || priority > 3){
            return reject(new Error('priority is clamp into 0 and 3'))
        }
        resolve(UserStory.findOneAndUpdate({_id: id}, {name:name, description: description, difficulty:difficulty, priority:priority}, {
                new: true,
                useFindAndModify: false
            }));
    });
}

function deleteUserStory(id, project){
    return new Promise((resolve, reject) => {
        if(!id){
            return reject(new Error('id parameter is required'));
        }
        UserStory.deleteOne({_id:id}).then(() => {
            resolve(project.backlog.userStories.pull(id))
        })
        .catch((err) => reject(err))
    })
}

// eslint-disable-next-line no-unused-vars
function getSpints(backlog){
    return [];
}

function getUserStories(arrayId){
    return UserStory.find({_id:arrayId});
}

function addSprint(project, name, dateBegin, dateEnd){
    
}

module.exports = {
    addUserStory,
    updateUserStory,
    deleteUserStory,
    getUserStories,
    getBacklog,
    addSprint
};
