const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	program: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true,
		unique: true
	},
	hash: {
		type: String,
		required: true
	}
});


module.exports = mongoose.model('User', userSchema);