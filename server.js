const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Enable CORS so your frontend website is allowed to talk to this server
app.use(cors());

// Allow large image uploads (default is 1MB, screenshots need more)
app.use(express.json({ limit: '50mb' }));

app.post('/send-email', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image data received' });
  }

  try {
    // Set up the Gmail sender connection
    // (We use environment variables process.env for security)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Your Gmail App Password, NOT your regular password
      }
    });

    // Configure the email message
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER, // Sends to yourself by default
      subject: 'New Screen Scan Snapshot',
      text: 'Attached is the screenshot captured by your screen scan code.',
      attachments: [
        {
          filename: 'screenshot.png',
          path: image // Nodemailer automatically converts the Base64 Data URL to a real file
        }
      ]
    };

    // Send it!
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Start the server on whatever port Render gives us
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
