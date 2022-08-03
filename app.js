const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const path = require('path');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const commentsRouter = require('./controllers/comments');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use(
  '/api/blogs/:id/comments',
  (request, _response, next) => {
    request.args = request.params;
    next();
  },
  commentsRouter
);

if (process.env.NODE_ENV === 'production') {
  let protected = ['favicon.ico'];

  app.get('*', (req, res) => {
    let path = req.params['0'].substring(1);

    if (protected.includes(path)) {
      // Return the actual file
      res.sendFile(`${__dirname}/build/${path}`);
    } else {
      // Otherwise, redirect to /build/index.html
      res.sendFile(`${__dirname}/build/index.html`);
    }
  });
}

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
