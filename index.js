const bodyParser = require('body-parser');
const express = require('express');
const cluster = require('cluster');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const sequelize = require('./utils/database');
const env = require('./utils/env');
const morgan = require('morgan');
const Post = require('./models/post');
const User = require('./models/user');

// Initiating worker process
if (cluster.isMaster) {

  // Spawning workers by forking cluster
  cluster.fork();
  cluster.fork();
} else {

  const app = express();

  app.use(bodyParser.json()); //for encoding application/json content type
  app.use(morgan('short')); //for logging http requests
  
  // Adding headers setup
  app.use((req, res, next) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 
    next();
 })

//  Adding available routes in service
  app.use('/feed', postRoutes);
  app.use('/auth', authRoutes);

  // Centralized error handling 
  app.use((error, req, res, next) =>{

    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    
    return res.status(statusCode).json({
       message: message,
       data: data
    });
 });
  
  const PORT = env.parseEnvNumber('APP_PORT', 5000);

  // Initializing sequelize models relations
  User.hasMany(Post, { as: 'posts'});
  Post.belongsTo(User, { 
    constraints: true, 
    onDelete: 'CASCADE', 
    as: 'user', 
    foreignKey: 'userId'
  });
  
  // Starting up service
  sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
      app.listen(PORT, () => {
        console.log(`Listening on port`, PORT);
      });
    })
    .catch(err => {
      console.log(err);
    });
}
