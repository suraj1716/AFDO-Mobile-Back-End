const {Chapter} = require('../Model/chapter');
const express = require('express');
const { Course } = require('../Model/course');
const router = express.Router();
const mongoose = require('mongoose');
const multer=require('multer');



const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, './public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});


const uploadOptions = multer({ storage: storage })




router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/chapters?courses=2342342,234234
    let filter = {};
    if(req.query.courses)
    {
         filter = {course: req.query.courses.split(',')}
    }

    const chapterList = await Chapter.find(filter).populate('course');

    if(!chapterList) {
        res.status(500).json({success: false})
    } 
    res.send(chapterList);
})

router.get(`/:id`, async (req, res) =>{
    const chapter = await Chapter.findById(req.params.id).populate('course');

    if(!chapter) {
        res.status(500).json({success: false})
    } 
    res.send(chapter);
})

router.post(`/`,uploadOptions.single('video'), async (req, res) =>{
    const course = await Course.findById(req.body.course);
    if(!course) return res.status(400).send('Invalid Course');

     const file = req.file;
    //  if (!file) return res.status(400).send('No image in the request');

    const fileName = file?.filename;
    // const imageBasePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
     const videoBasePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let chapter = new Chapter({
        name: req.body.name,
        description: req.body.description,
        YoutubeUrl:req.body.YoutubeUrl,
        thumbnail:req.body.thumbnail,
        //PageNo:req.body.PageNo,
        video: `${videoBasePath}${fileName}`,//req.body.video
         image:  req.body.image,       //req.body.image   ,  //"http://localhost:9191/public/uploads/image-12344"
        course: req.body.course,
       
     
    })

    chapter = await chapter.save();

    // if(!chapter) 
    // {
    //     return res.status(500).send('The chapter cannot be created')
    // }

    res.send(chapter);
})

router.put('/:id',uploadOptions.single('video'), async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid chapter Id')
    }
    const course = await Course.findById(req.body.course);
    // if(!course) return res.status(400).send('Invalid Course')

    const file = req.file;
    let videopath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        videopath = `${basePath}${fileName}`;
    } else {
        videopath = Chapter.video;
    }


    const updatedchapter  = await Chapter.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            YoutubeUrl:req.body.YoutubeUrl,
            //PageNo:req.body.PageNo,
            video:videopath,//req.body.video
            image:  req.body.image      ,
            thumbnail:req.body.thumbnail,
            course: req.body.course,
        },
        { new: true}
    )

    if(!updatedchapter)
    return res.status(500).send('the chapter cannot be updated!')

    res.send(updatedchapter);
})



router.delete('/:id', (req, res)=>{
    Chapter.findByIdAndRemove(req.params.id).then(chapter =>{
        if(chapter) {
            return res.status(200).json({success: true, message: 'the chapter is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "chapter not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const chapterCount = await Chapter.collection.countDocuments()

    if(!chapterCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        chapterCount: chapterCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const chapters = await Chapter.find({isFeatured: true}).limit(+count);

    if(!chapters) {
        res.status(500).json({success: false})
    } 
    res.send(chapters);
})


router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid chapter Id');
        }

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const chapter = await chapter.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },

            { new: true }
        );

        if (!chapter)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(chapter);
    }
);




module.exports =router;