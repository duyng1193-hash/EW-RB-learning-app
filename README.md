# 🌊 Elliott Wave Tutor

Ứng dụng học Elliott Wave theo phương pháp **Robert Balan**, có AI giáo viên dạy bằng tiếng Việt.

---

## 🚀 Deploy lên Vercel (miễn phí, 5 phút)

### Bước 1 — Tạo tài khoản
- [vercel.com](https://vercel.com) — đăng ký miễn phí bằng GitHub
- [console.anthropic.com](https://console.anthropic.com) — lấy API key Anthropic

### Bước 2 — Upload code lên GitHub
1. Tạo repo mới trên [github.com](https://github.com)
2. Upload toàn bộ thư mục này lên repo

### Bước 3 — Deploy trên Vercel
1. Vào [vercel.com/new](https://vercel.com/new)
2. Chọn repo GitHub vừa tạo → click **Deploy**
3. Sau khi deploy xong, vào **Settings → Environment Variables**
4. Thêm biến:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxx` (API key của bạn)
5. Vào **Deployments** → click **Redeploy**

✅ Xong! Bạn sẽ có link dạng `https://elliott-wave-tutor.vercel.app`

---

## 💻 Chạy local (để test)

```bash
npm install
cp .env.example .env.local
# Điền API key vào .env.local
npm run dev
# Mở http://localhost:3000
```

---

## 🔒 Bảo mật

API key được giữ **hoàn toàn ở server** (`pages/api/chat.js`).  
Người dùng chỉ giao tiếp với `/api/chat` — không bao giờ thấy key.

---

## 📚 Nội dung

Dựa trên cuốn sách **"Elliott Wave Principle Applied to the Foreign Exchange Markets"** của Robert Balan.  
10 chương học từ cơ bản đến nâng cao, có quiz và ví dụ thực tế từ thị trường Forex.
