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
    .then(({ outline, outlineId }) => {
      // console.log("Outline--------->", outline);
      const id = outline[outline.length - 1]._id;
      // console.log("Video--------->", video);
      const newOutlineVideos = video.map(content => ({ 
        outlineId: id,
        title: content.title,
        path: content.path
      }));
      // console.log("New Outline Video----->", newOutlineVideos);
      new Content({
        courseId,
        outlineId,
        video: [...newOutlineVideos]
      })
      .save()
      .then(data => {
        console.log("Content Data--------->", data)
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
      product.overwrite({
        ...createProduct,
        outline: [...createProduct.outline, req.body.outline]
      });
      return product.save();    
    })
    .then(data => {
      console.log(data);
      Content.findOne({ outlineId: data.outlineId })
        .then(content => {
          const createContent = {...content};
          content.overwrite({
            ...createContent,
            video: [...content.video, req.body.content]
          });
          console.log(content);
          return content.save();
        })
        .then(data => res.status(200).json("Updated!"))
        .catch(err => {
          console.log(err);
          res.status(400).json("Unsuccessful!")
        })
    })
    .catch(err => {
      console.log(err);
      res.status(400).json('Unable to update.');
    })
}




exports.getAllCourses = (req, res, next) => {
  res.json(
    [
      {
        title: "The complete web developer in 2020",
        id: 0,
        courseId: "ufdnkkkdddjdjddj",
        photoUrl: "0.jpg",
        description: "web developer course"
      },
      {
        title: "Learning to learn",
        id: 1,
        courseId: "ufdnkkkdddjdjddjfff",
        photoUrl: "1.jpg",
        description: "learning to learn"
      },
      {
        title: "CS50",
        id: 2,
        courseId: "ufdnkkkdddjdjdnndj",
        photoUrl: "2.jpg",
        description: "computer science 50"
      }
    ]
  );
}

exports.getImage = (req, res, next) => {
  res.sendFile(`assets/photos/${req.params.photoUrl}`, { root: "." });
}

exports.getAllCourseOutline = (req, res, next) => {
  res.json(
    {
      id: [
        {
          name: "Introduction",
          outlineId: "5fcf42f69620c575fffac5d1",
          photoUrl: "0.jpg"
        },
        {
          name: "How the internet works",
          outlineId: "5fcf42f69620c575fffac5d2",
          photoUrl: "0.jpg"
        }
      ]
    }
  );




  // res.json(
  //   [
  //     {
  //       id: 0,
  //       name: "introduction",
  //       photoUrl: "0.jpg"
  //     },
  //     {
  //       id: 1, name: "how the internet works",
  //       photoUrl: "0.jpg"
  //     },
  //     {
  //       id: 2, name: "history of the web",
  //       photoUrl: "0.jpg"
  //     },
  //     {
  //       id: 3, name: "html 5",
  //       photoUrl: "0.jpg"
  //     },
  //     {
  //       id: 4, name: "advanced html 5",
  //       photoUrl: "0.jpg"
  //     }
  //   ]
  // );
}


exports.getCourseVideos = (req, res, next) => {
  // This returns videos for specific course outline.
  res.json([
    {
      id: 0,
      name: "why this course",
      duration: "4mins",
      outline: "introduction",
      url: "0.mp4"
    },
    {
      id: 1,
      name: "course outline",
      duration: "3mins",
      outline: "introduction",
      url: "1.mp4"
    },
  ]);
}

exports.getVideo = (req, res, next) => {
  // console.log(req.params)
  const path =  rootPath.join(__dirname, `../assets/videos/${req.params.outline}`, `${req.params.id}.mp4` );
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