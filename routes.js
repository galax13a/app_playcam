// apps/routes.js
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname,'..','src', '.env') });
const router = express.Router();

router.get('/', (req, res) => {
  const nomeSite = process.env.nome_site;
  res.render('index', { nomeSite });
  console.log(' express render index');
});

router.get('/login', (req, res) => {
  const nomeSite = process.env.nome_site;
  res.render('login', { nomeSite });
});

router.get('/app/moderator', (req, res) => {
  console.log(' moderator render');
  res.render('moderator/moderator');
});


module.exports = router;