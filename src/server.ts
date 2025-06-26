import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const APP_ID = process.env.APP_ID!;
const APP_SECRET = process.env.APP_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const fbLoginUrl = `https://www.facebook.com/v23.0/dialog/oauth?` +
    `client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=public_profile,email` +
    `&response_type=code`;

  res.send(`<a href="${fbLoginUrl}">Login with Facebook (admin/dev/tester)</a>`);
});

// @ts-ignore
app.get('/auth/facebook/callback', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    // Đổi code lấy access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v23.0/oauth/access_token', {
      params: {
        client_id: APP_ID,
        client_secret: APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Kiểm tra token có scope mong muốn không
    const debugResponse = await axios.get('https://graph.facebook.com/debug_token', {
      params: {
        input_token: accessToken,
        access_token: `${APP_ID}|${APP_SECRET}`, // App Access Token dùng để kiểm tra
      },
    });

    const scopes = debugResponse.data.data.scopes as string[];

    if (!scopes.includes('groups_access_member_info')) {
      return res.send(`Access token không có quyền groups_access_member_info. Scopes hiện có: ${scopes.join(', ')}`);
    }

    // Gọi API /me/groups
    const groupsResponse = await axios.get('https://graph.facebook.com/v23.0/me/groups', {
      params: { access_token: accessToken },
    });

    res.send(`
      <h2>Access Token lấy được với groups_access_member_info</h2>
      <pre>${accessToken}</pre>
      <h2>Danh sách Groups của bạn</h2>
      <pre>${JSON.stringify(groupsResponse.data, null, 2)}</pre>
    `);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Lỗi khi lấy token hoặc gọi API');
  }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
