const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  let file = 'index';
  res.render(file, {
    meta: {
      title: 'Express MVC H5BP',
      description: 'A simple boilerplate',
      keywords: 'Express, MVC, html5, boilerplate',
      file: file
    },
    title: 'Express MVC H5BP'
  });
});

module.exports = router;
