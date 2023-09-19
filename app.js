const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt=require("./helpers/jwt");
const errorHandler=require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));


//[Later remove comment: userRole function]    
// app.use(authJwt());  


app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const coursesRoutes = require("./routes/courses");
const chaptersRoutes = require("./routes/chapters");
const freeVideosRoutes = require("./routes/freeVideos");
const liveStreamsRoutes = require("./routes/liveStreams");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/courses`, coursesRoutes);
app.use(`${api}/chapters`, chaptersRoutes);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(`${api}/freeVideos`, freeVideosRoutes);
app.use(`${api}/liveStreams`, liveStreamsRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });




// if (process.env.NODE_ENV === 'development') {
  //Server  Development
app.listen(process.env.PORT, () => {
  console.log("server is running http://localhost:"+ process.env.PORT);
});

// }


if (process.env.NODE_ENV === 'production') {
    var server=app.listen(process.env.PORT || process.env.PORT, function(){
    var port =server.address().port;
    console.log("Express is working on port" + port )
  })
}




