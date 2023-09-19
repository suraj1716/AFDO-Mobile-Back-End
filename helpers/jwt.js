const {expressjwt: jwt }= require('express-jwt');

function authJwt(){

    const secret=process.env.secret;
    const api=process.env.API_URL;

    return jwt({
        secret, 
        algorithms: ['HS256'],
        isRevoked: isRevoked  
    }).unless({
        path: [  
            {url: /\/api\/v1\/uploads(.*)/, methods:['GET']},
           {url: /\/api\/v1\/products(.*)/, methods:['GET']},
           
           {url:/\/api\/v1\/categories(.*)/, methods:['GET']},
           {url:/\/api\/v1\/users(.*)/, methods:['GET']},
           {url:/\/api\/v1\/orders(.*)/, methods:['GET']},
           {url:/\/api\/v1\/chapters(.*)/, methods:['GET']},
           {url:/\/api\/v1\/courses(.*)/, methods:['GET']},
           {url:/\/api\/v1\/freeVideos(.*)/, methods:['GET']},
           {url:/\/api\/v1\/liveStreams(.*)/, methods:['GET']},
            
           `${api}/users/login`,
            `${api}/users/register`,
           
           
        
        ]

    })


}


async function isRevoked(req, payload) {
    console.log(payload);
    if (payload.isAdmin == false) {
      console.log('Not Admin');
      return true;
    }
    console.log('Admin');
    return false;
  }

// async function isRevoked(req, payload, done){

// if(!payload.isAdmin){
//     return  done(null, true);
// }

//     return  done()

// }


module.exports=authJwt;