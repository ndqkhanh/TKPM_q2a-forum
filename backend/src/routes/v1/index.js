const express = require('express');
const authRoute = require('./auth.route');
const answerRoute = require('./answer.route');
const questionRoute = require('./question.route');
const userRoute = require('./user.route');
const router = express.Router();

const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path: '/user',
      route: userRoute,
    },
    {
    path: '/answer',
    route: answerRoute,
    },
    {
      path: '/question',  
      route: questionRoute,
    }
];

const devRoutes = [
    // routes available only in development mode
    {
      path: '/docs',
      route: docsRoute,
    },
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  /* istanbul ignore next */
  if (config.env === 'development') {
    devRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });
  }
module.exports = router;