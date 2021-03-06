const mongoose = require('mongoose');
const userStorySchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    description: {type: String},
    priority: {type: Number, min: 1, max: 3, default: 1},
    difficulty: {type: Number, min: 0, default: 0},
    sprint: {type: mongoose.Schema.Types.ObjectId, ref: 'Sprint'},
    taskCount: {type: Number, min: 0, default: 0}
});
module.exports = mongoose.model('UserStory', userStorySchema);
