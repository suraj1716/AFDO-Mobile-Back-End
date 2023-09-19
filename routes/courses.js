const {Course} = require('../Model/course');
const express = require('express');
const router = express.Router();




router.get(`/`, async (req, res) =>{
    const courseList = await Course.find();

    if(!courseList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(courseList);
})

router.get('/:id', async(req,res)=>{

    const course=await Course.findById(req.params.id);

    if(!course){
        res.status(500).json({success: false, message:'course with given id was not found'})
    } 
    res.status(200).send(course);
})


router.put('/:id', async(req,res)=>{

    const course=await Course.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color: req.body.color

        },
            {new:true}

        );

    if(!course){
        res.status(500).json({success: false, message:'course with given id was not found'})
    } 
    res.status(200).send(course);
})



router.post('/', async (req,res)=>{
   let course = new Course({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
        image:req.body.image,
        price:req.body.price,
        description:req.body.description,
        numReviews:req.body.numReviews,
        rating:req.body.rating,
        isFeatured:req.body.isFeatured,


   }) 

   course= await course.save();

   if(!course)
    return res.status(404).send("the course cannot be created"); 

   res.send(course); 

})


router.delete('/:id',(req,res)=>{

    Course.findByIdAndRemove(req.params.id).then(course=>{
        if(course){
        return res.status(200).json({success: true, message:'the course is deleted'} )
        }
        else{
            return res.status(404).json({success: false, message:'course not found'})
        }
    
    }).catch(err=>{
        return res.status(400).json({success:false, error:err})

    })

})

module.exports =router;