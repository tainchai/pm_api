const express = require('express');
const line = require('@line/bot-sdk'); // ใช้ SDK จาก LINE
const app = express();
const port = process.env.PORT || 3000;

// ใส่ Channel Secret และ Channel Access Token ที่ได้จาก LINE Developers Console
const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};

// สร้าง client จาก SDK
const client = new line.Client(config);

// การตั้งค่า middleware เพื่อรับข้อมูลจาก webhook
app.post('/webhook', line.middleware(config), (req, res) => {
  const events = req.body.events;

  Promise.all(events.map(handleEvent))  // Handle ทุก event
    .then(() => res.sendStatus(200))  // ตอบกลับสถานะ HTTP 200
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);  // ถ้าเกิด error ให้ตอบกลับสถานะ 500
    });
});

// ฟังก์ชัน handleEvent สำหรับจัดการข้อความต่างๆ ที่ได้รับ
function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const userMessage = event.message.text; // รับข้อความจากผู้ใช้

    // สร้างข้อความตอบกลับ
    const replyMessage = `คุณพูดว่า: ${userMessage}`;

    // ส่งข้อความตอบกลับไปยัง LINE
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyMessage
    });
  }
  return Promise.resolve();
}

// เริ่มต้น server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
