const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser =  require('body-parser');
const courseRoute = require('./routes/course.route');
const authRoute = require("./routes/auth.route");
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(courseRoute);
app.use(authRoute);

mongoose.connect('mongodb://127.0.0.1:27017/?compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass&ssl=false', { 
	// useNewUrlParser: true, 
	// useUnifiedTopology: true 
})
	.then(data => {
		app.listen(5000, () => console.log("Server running on PORT: 5000"));
	})
	.catch(err => console.log(err))




// / returns available courses.
// /outline returns all the course outline for a specific course.
// /:outline/videos returns the videos in a specific course outline.
// /:outline/video/:id returns specific video from course outline.
// /login logs in a user.
// /register registers a new user.
// /payment 