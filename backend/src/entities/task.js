const { Schema, model } = require("mongoose");

const TaskSchema = new Schema({
    description: { type: String, required: true },
    done: { type: Boolean, default: false, required: true},
});


exports.Task = model('Task', TaskSchema);