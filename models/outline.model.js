const mongoose = require('mongoose');
const MUUID = require('uuid-mongodb');
const Schema = mongoose.Schema;


const outlineSchema = new Schema({
	courseId: {
		type: String,
		required: true
	},
	outline: [
		{
			name: {
				type: "String",
				required: true
			},
			alias_name: {
				type: "String",
				required: true,
				// unique: true 
			}
		}
	]
});


module.exports = mongoose.model("Outline", outlineSchema);