const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Variable to hold the latest screenshot data url in memory
let latestImage = null;

// Route 1: Frontend sends screenshots here
app.post('/send-email', (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).send('No image data received.');
  
  latestImage = image; // Overwrite memory with the newest screenshot
  res.status(200).send('Image updated on server.');
});

// Route 2: Viewing route. Anyone visiting your url can see the live image stream.
app.get('/', (req, res) => {
  if (!latestImage) {
    return res.send('<h1>No screenshot captured yet. Please run your loop script!</h1>');
  }
  
  // Return an automatic-refreshing plain HTML frame to view the live snapshot
  res.send(`
    <html>
      <head>
        <title>Shiny Potato Live Viewer</title>
        <meta http-equiv="refresh" content="5">
      </head>
      <body style="background:#222; text-align:center; color:white; font-family:sans-serif; margin-top:50px;">
        <h2>Shiny Potato Live View (Auto-Refreshes every 5s)</h2>
        <img src="${latestImage}" style="max-width:90%; border:4px solid #ff4500; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.5);" />
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
