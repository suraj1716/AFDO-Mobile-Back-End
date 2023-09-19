const {FreeVideo} = require('../Model/freeVideo');
const express = require('express');

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
    // localhost:3000/api/v1/freeVideos?categories=2342342,234234
    let filter = {};
    
    const freeVideoList = await FreeVideo.find();

    if(!freeVideoList) {
        res.status(500).json({success: false})
    } 
    res.send(freeVideoList);
})

router.get(`/:id`, async (req, res) =>{
    const freeVideo = await FreeVideo.findById(req.params.id);

    if(!freeVideo) {
        res.status(500).json({success: false})
    } 
    res.send(freeVideo);
})

router.post(`/`,uploadOptions.single('image'), async (req, res) =>{
   

    // const file = req.file;
    // if (!file) return res.status(400).send('No image in the request');

    // const fileName = file?.filename;
    // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let freeVideo = new FreeVideo({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,      /*   `${basePath}${fileName}`,  //"http://localhost:9191/public/uploads/image-12344" */
        video: req.body.video
    })

    freeVideo = await freeVideo.save();

    if(!freeVideo) 
    {
        return res.status(500).send('The freeVideo cannot be created')
    }

    res.send(freeVideo);
})

router.put('/:id',uploadOptions.single('image'), async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid FreeVideo Id')
    }

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = FreeVideo.image;
    }

    const updatedFreeVideo  = await FreeVideo.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,                  
            video: req.body.video
        },
        { new: true}
    )

    if(!updatedFreeVideo)
    return res.status(500).send('the freeVideo cannot be updated!')

    res.send(updatedFreeVideo);
})



router.delete('/:id', (req, res)=>{
    FreeVideo.findByIdAndRemove(req.params.id).then(freeVideo =>{
        if(freeVideo) {
            return res.status(200).json({success: true, message: 'the freeVideo is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "freeVideo not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const freeVideoCount = await FreeVideo.collection.countDocuments()

    if(!freeVideoCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        FreeVideoCount: freeVideoCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const freeVideos = await FreeVideo.find({isFeatured: true}).limit(+count);

    if(!freeVideos) {
        res.status(500).json({success: false})
    } 
    res.send(freeVideos);
})


router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid FreeVideo Id');
        }

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const freeVideo = await FreeVideo.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },

            { new: true }
        );

        if (!freeVideo)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(freeVideo);
    }
);



module.exports =router;