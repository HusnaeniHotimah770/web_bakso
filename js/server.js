const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const twilio = require('twilio'); // Import Twilio SDK

const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID'; // Ganti dengan SID akun Twilio Anda
const authToken = 'YOUR_TWILIO_AUTH_TOKEN'; // Ganti dengan Token akun Twilio Anda
const fromWhatsApp = 'whatsapp:+14155238886'; // Nomor WhatsApp Twilio Anda, ganti dengan nomor yang Anda terima
const client = twilio(accountSid, authToken);

// Middleware untuk parsing body
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint untuk form reservasi
app.post('/reservasi', async (req, res) => {
  const { nama, jumlahOrang, waktu } = req.body;

  // Format pesan untuk dikirim via WhatsApp
  const pesan = `*Reservasi Meja Baru*\n\nNama: ${nama}\nJumlah Orang: ${jumlahOrang}\nWaktu: ${waktu}`;

  // Mengirim pesan ke WhatsApp menggunakan Twilio API
  const nomorWhatsAppTujuan = 'whatsapp:+6289671227131'; // Ganti dengan nomor WhatsApp tujuan

  try {
    // Mengirim pesan menggunakan Twilio API
    await client.messages.create({
      body: pesan,
      from: fromWhatsApp,
      to: nomorWhatsAppTujuan
    });

    res.send('Reservasi berhasil, Anda akan menerima konfirmasi di WhatsApp!');
  } catch (error) {
    console.error('Error mengirim pesan WhatsApp:', error);
    res.status(500).send('Terjadi kesalahan, coba lagi nanti.');
  }
});

// Halaman utama untuk form reservasi
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Reservasi Meja di Restoran</h1>
        <form action="/reservasi" method="POST">
          <label for="nama">Nama:</label>
          <input type="text" id="nama" name="nama" required><br><br>

          <label for="jumlahOrang">Jumlah Orang:</label>
          <input type="number" id="jumlahOrang" name="jumlahOrang" required><br><br>

          <label for="waktu">Waktu Reservasi:</label>
          <input type="datetime-local" id="waktu" name="waktu" required><br><br>

          <input type="submit" value="Reservasi">
        </form>
      </body>
    </html>
  `);
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
