const rootPath = require('path');
const fs = require('fs');
const Course = require('../models/courses.model.js');
const Outline = require('../models/outline.model.js');
const Content = require('../models/content.model.js');



exports.createNewCourse = (req, res, next) => {// Creates a new course, outline and content
  const { name, alias_name, photoUrl, outline, video } = req.body;
  new Course({
    name, alias_name, photoUrl
  })
  .save()
  .then(({ courseId }) => {
    new Outline({ 
      courseId,
      outline: [...outline]
    })
    .save()
    .then(({ outline }) => {
      console.log(outline);
      const id = outline[outline.length - 1]._id;
      const newOutlineVideos = video.map(content => ({ 
        outlineId: id,
        title: content.title,
        path: content.path
      }));
      new Content({
        courseId,
        video: [...newOutlineVideos]
      })
      .save()
      .then(data => {
        res.status(200).json('Course created.')
      })
      .catch(err => {
        console.log(err);
        res.status(400).json('Unable to create course.');
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json('Unable to create course.');
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).json('Unable to create course.');
  });
};


exports.getAllCourses = (req, res, next) => {
  Course.find()
    .then(data => res.status(200).json(data))
    .catch(err => {
      console.log(err);
      res.status(400).json('Unable to fetch.');
    })
};

exports.updateCourseOutlineAndContent = (req, res, next) => {
  Outline.findOne({ courseId: req.body.id })
    .then(product => {
      const createProduct = {...product._doc};
      const findMatch = createProduct.outline.find((item) => item.alias_name === req.body.outline.alias_name);   
      if (!findMatch) {
        product.overwrite({
          ...createProduct,
          outline: [...createProduct.outline, req.body.outline]
        });
        return product.save();
      }
      return product;
    })
    .then(data => {
      Content.findOne({ courseId: req.body.id })
        .then(content => {
          const id = data.outline[data.outline.length - 1]._id;
          const newOutlineVideos = {
            ...req.body.content,
            outlineId: id
          }
          const findVideoMatch = content.video.find(item => item.title === newOutlineVideos.title);
          if (!findVideoMatch) {
            content.overwrite({
              ...content,
              courseId: content.courseId,
              video: [...content.video, newOutlineVideos]
            })
            return content.save();
          }
          return content;
        })
        .then(data => res.status(200).json("Updated!"))
        .catch(err => {
          console.log(err);
          res.status(400).json("Unsuccessful!")
        })
    })
    .catch(err => {
      // console.log(err);
      res.status(400).json('Unable to update.');
    })
};

exports.getCourseOutline = (req, res, next) => { 
  const id = req.params.id;
  Outline.findOne({ courseId: id })
    .then(data => {
      console.log(data._doc);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json('Unable to get course outline.');
    })
}

exports.getImage = (req, res, next) => {
  res.sendFile(`assets/videos/${req.params.course_alias}/${req.params.id}`, { root: "." });
}

exports.getVideo = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  const path =  rootPath.join(__dirname, `../assets/videos/${req.params.course_alias}/${req.params.outline_alias}`, `${req.params.id}.mp4` );
  console.log(path);
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}