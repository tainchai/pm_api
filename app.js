const express = require('express');
const line = require('@line/bot-sdk'); // ใช้ SDK จาก LINE
const app = express();
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken: 'hfgkDnqMq34cYKn10WvUuVCLDT1w2S+PwKHf5F9x98eqIII3Iix12hOOOuu583hHfp3KyJfz/HHiAQjDOpJsdyz5svWAgulcsPCCGsZwA4iXnVein1xpk9vd7iGy8yURJwBA8r3d+RRONR3mHrhdpgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'f2845436bf74e036f4cd91f951e82a32'
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
