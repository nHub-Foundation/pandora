const mongoose = require('mongoose');
const MUUID = require('uuid-mongodb');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	alias_name: {
		type: String,
		required: true,
		unique: true
	},
	photoUrl: {
		type: String,
		required: true,
	},
	courseId: {
		type: String,
		required: true,
		default: () => MUUID.v4().toString(),
		unique: true
	}
});

module.exports = mongoose.model('Course', courseSchema);