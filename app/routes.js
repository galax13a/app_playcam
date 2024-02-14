// apps/routes.js
const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { app } = require('electron');

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

router.get('/app/traductor/audio', (req, res) => {  
  res.render('traductor/traductor_audio', { message: 'start recording your greetings or want to go faster than writing!' });
});

router.get('/app/lougee', (req, res) => {  
  res.render('lougee/lougee', { message: 'Hola desde Lougee!' });
});

router.get('/app/settings', (req, res) => {  
  res.render('settings/settings', { message: 'Hola desde Settings!' });
});

/* youtube */ 
//const audiosDirectory = path.join(__dirname, 'public', 'audios', 'youtube');
const audiosDirectory = path.join(app.getPath('userData'), 'public', 'audios', 'youtube');

router.get('/app/youtube', (req, res) => {
  if (!fs.existsSync(audiosDirectory)) {
    res.render('youtube/youtube', { audioFiles: [] });
    return;
  }
  const audioFiles = fs.readdirSync(audiosDirectory);
  res.render('youtube/youtube', { audioFiles });
});

/*
router.get('/app/youtube', (req, res) => {
  try {
  //  const folderPath = path.join(__dirname, 'public', 'audios', 'youtube');
    if (!fs.existsSync(audiosDirectory)) {
        res.render('youtube/youtube', { audioFiles: [] });
        return;
    }

    const audioFiles = fs.readdirSync(audiosDirectory)
      .map((file) => {
        const filePath = path.join(audiosDirectory, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          created: stats.ctime, // Fecha de creación
        };
      })
      .sort((a, b) => b.created - a.created) // Ordenar de manera descendente por fecha de creación
      .map((file) => file.name);

    res.render('youtube/youtube', { audioFiles });
  } catch (error) {
    console.error(error);
   // res.status(500).send('Error reading audio files');
   
  }
});

*/
router.post('/app/youtube/download', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioUrl = audioFormats[0].url;

    // Obtener el título del video y formatearlo como nombre de archivo
    const rawTitle = info.videoDetails.title;
    const cleanedTitle = rawTitle.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    const randomSuffix = `_${Math.floor(Math.random() * 100)}`;
    const formattedTitle = `${cleanedTitle}${randomSuffix}.mp3`;

    const filePath = path.join(audiosDirectory, formattedTitle);

    // Verificar si la carpeta existe, de lo contrario, crearla
    if (!fs.existsSync(audiosDirectory)) {
      fs.mkdirSync(audiosDirectory, { recursive: true });
    }

    res.header('Content-Disposition', `attachment; filename="${formattedTitle}"`);

    const video = ytdl(videoUrl, { quality: 'highestaudio', filter: 'audioonly' });

    video.pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        console.log(`Audio downloaded and saved at: ${filePath}`);
        // Realizar una redirección a la ruta que obtiene el nuevo listado de audios
        res.redirect('/app/youtube');
      })
      .on('error', (error) => {
        console.error(error);
        res.status(500).send('Error during download');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during download / error / ' + error);
  }
});

router.get('/app/youtube/play/:audio', (req, res) => {
  const audioFile = req.params.audio;
  const filePath = path.join(audiosDirectory, audioFile);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  try {

  if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg',
      };

      res.writeHead(206, head);
      file.pipe(res);
  } else {
      const head = {
          'Content-Length': fileSize,
          'Content-Type': 'audio/mpeg',
      };

      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
  }
}catch (error) {
  
  res.status(500).send(`no file found audio` );
  //res.redirect('/app/youtube');
}
});

router.get('/app/youtube/delete/:audio', (req, res) => {
  const audioFile = req.params.audio;
  const filePath = path.join(audiosDirectory, audioFile);

  try {
    fs.unlinkSync(filePath);
    console.log(`Audio deleted: ${filePath}`);
    const modulePath = require.resolve(audiosDirectory); // Reemplaza con la ruta completa a tu archivo
    delete require.cache[modulePath];

    res.redirect('/app/youtube');
  } catch (error) {
    if (error.code === 'EPERM') {
      res.status(500).send(`the file may have already been deleted <br> <a href="/app/youtube">Go back to Youtube Play </a>` );
    }
    console.error(error);
    //res.status(500).send(`Error during deletion.<br> or the file may have already been deleted <br> <a href="/app/youtube">Go back to Youtube Play </a>` );
    res.redirect('/app/youtube');
  }

});

router.get('/app/chaturbate/get-exhibitionist', async (req, res) => {
  try {
      const response = await fetch('https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=gQ4iQ&client_ip=request_ip&exhibitionist=true&limit=500');
      const data = await response.json();
      
      res.render('exhibitionist/exhibitionist', { exhibitionists: data.results }); // Renderiza la vista con todos los resultados obtenidos
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'There was an error processing the request, Server Express PlaycamHub' });
  }
});




module.exports = router;