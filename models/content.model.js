const mongoose = require('mongoose');

const Schema =  mongoose.Schema;


const contentSchema = new Schema({
	courseId: {
		type: String,
		required: true
	},
	// outlineId: {
	// 	type: String,
	// 	required: true
	// },
	video: [
		{
			title: {
				type: String,
				required: true
			},
			path: {
				type: String,
				required: true,
				unique: true
			},
			outlineId: {
				type: String,
				require: true
			}
		}
	]
});


module.exports = mongoose.model('Content', contentSchema);