const {LiveStream} = require('../Model/liveStream');
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
    // localhost:3000/api/v1/liveStreams?categories=2342342,234234
    let filter = {};
    
    const liveStreamList = await LiveStream.find();

    if(!liveStreamList) {
        res.status(500).json({success: false})
    } 
    res.send(liveStreamList);
})

router.get(`/:id`, async (req, res) =>{
    const liveStream = await LiveStream.findById(req.params.id);

    if(!liveStream) {
        res.status(500).json({success: false})
    } 
    res.send(liveStream);
})

router.post(`/`,uploadOptions.single('image'), async (req, res) =>{
  

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file?.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let liveStream = new LiveStream({
        name: req.body.name,
        description: req.body.description,
        streamUrl: req.body.streamUrl,
        passcode:req.body.passcode,
        date:req.body.date,
        time:req.body.time,
        image: `${basePath}${fileName}`,  //"http://localhost:9191/public/uploads/image-12344"
      
    })

    liveStream = await liveStream.save();

    if(!liveStream) 
    {
        return res.status(500).send('The liveStream cannot be created')
    }

    res.send(liveStream);
})



router.put('/:id',uploadOptions.single('image'), async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid LiveStream Id')
    }
 


    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = LiveStream.image;
    }


    const updatedLiveStream  = await LiveStream.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            streamUrl: req.body.streamUrl,
            passcode:req.body.passcode,
            image: imagepath,
            date:req.body.date,
            time:req.body.time,
        },
        { new: true}
    )

    if(!updatedLiveStream)
    return res.status(500).send('the product cannot be updated!')

    res.send(updatedLiveStream);
})


router.delete('/:id', (req, res)=>{
    LiveStream.findByIdAndRemove(req.params.id).then(liveStream =>{
        if(liveStream) {
            return res.status(200).json({success: true, message: 'the liveStream is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "liveStream not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const liveStreamCount = await LiveStream.collection.countDocuments()

    if(!liveStreamCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        LiveStreamCount: liveStreamCount
    });
})

router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const liveStreams = await LiveStream.find({isFeatured: true}).limit(+count);

    if(!liveStreams) {
        res.status(500).json({success: false})
    } 
    res.send(liveStreams);
})


router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid LiveStream Id');
        }

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const liveStream = await LiveStream.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },

            { new: true }
        );

        if (!liveStream)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(liveStream);
    }
);



module.exports =router;