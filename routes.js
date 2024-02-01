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

router.get('/app/bots', (req, res) => {
  console.log(' bots render');  
  res.render('guests/bots', { message: 'Hola desde Bots!' });
});

router.get('/app/biography', (req, res) => {
  res.render('biography/biography', { message: 'Hola desde Biography!' });
});

router.get('/app/contacts', (req, res) => {
  res.render('contacts/contacts', { message: 'Hola desde Contacts!' });
});

router.get('/app/broadcast', (req, res) => {
  res.render('broadcast/broadcast', { message: 'Hola desde Broadcast!' });
});

router.get('/app/topmodels', (req, res) => {
  res.render('topmodels/topmodels', { message: 'Hola desde Top Models!' });
});

router.get('/app/dashboard', (req, res) => {  
  res.render('dashboard/dashboard', { message: 'Hola desde Dashboard!' });
});

router.get('/app/analytics', (req, res) => {  
  res.render('analytics/analytics', { message: 'Hola desde Analytics!' });
});

router.get('/app/topics', (req, res) => {
  res.render('topics/topics', { message: 'Hola desde Topics!' });
});

router.get('/app/favorites', (req, res) => {  
  res.render('favorites/favorites', { message: 'Hola desde Favorites!' });
});

router.get('/app/traductor', (req, res) => {  
  res.render('traductor/traductor', { message: 'Hola desde Traductor!' });
});

router.get('/app/lougee', (req, res) => {  
  res.render('lougee/lougee', { message: 'Hola desde Lougee!' });
});

router.get('/app/settings', (req, res) => {  
  res.render('settings/settings', { message: 'Hola desde Settings!' });
});

module.exports = router;