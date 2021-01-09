const bcrypt = require('bcryptjs');
const UserSchema = require('../models/auth.model.js');


exports.loginUser = (req, res, next) => {
	console.log(req.body)
  UserSchema.findOne({ email: req.body.email})
  .then(data => {
  	
  	if (bcrypt.compareSync(req.body.password, data.hash)) {
  		const userData = {
  			...data._doc,
  			hash: ''
  		}
  		res.status(200).json(userData);
  		return;
  	}
  	res.status(400).json("Incorrect credentials");
  })
  .catch(err => {
  	console.log(err);
  	res.status(400).json("Unable to signup");
  })
}

exports.registerUser = (req, res, next) => {

	const { firstName, lastName, email, phone, hash, program } =  req.body;
	var hashValue = bcrypt.hashSync(hash, 8);
	
	new UserSchema({
		firstName, lastName, email, phone, hash: hashValue, program
	})
	.save()
	.then(data => res.status(200).json("Registration Successful!"))
	.catch(err => {
		console.log(err);
		res.status(400).json("Unable to register!");		
	})
}