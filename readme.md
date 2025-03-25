# 🖼️ HTML to Image/PDF Renderer API

A lightweight and secure Node.js API built with Express and Puppeteer. It converts raw HTML into PNG, JPEG, or PDF formats using headless Chromium. Supports both base64 and binary output, API token authentication, rate limiting, and configurable settings via `.env`.

---

## 🚀 Features

- 🔐 API token authentication
- ⚙️ Configurable output: PNG, JPEG, PDF
- 🖼️ Output options: base64 string or binary
- 📏 Viewport control (custom or default from `.env`)
- 🧱 Rate limiting to prevent abuse
- 🧠 Input validation via [Zod](https://github.com/colinhacks/zod)
- ♻️ Puppeteer browser reuse (browser pool)
- ✅ Modular codebase for maintainability

---

## 🛠️ Installation

### Via Docker

You can run the API instantly using the public Docker image:

```bash
docker run -d \
  -p 3000:3000 \
  -e API_TOKEN=mysecrettoken \
  -e DEFAULT_VIEWPORT_WIDTH=1024 \
  -e DEFAULT_VIEWPORT_HEIGHT=768 \
  -e PUPPETEER_NO_SANDBOX=true \
  standahorvath/html2imageserver
```

### Or you can do a nanual Installation

```bash
git clone https://github.com/standahorvath/Html2ImageServer.git
cd Html2ImageServer
npm install
```


Now access the API on `http://localhost:3000/render?apiToken=mysecrettoken`

---

## 📄 Environment Variables

Create a `.env` file in the root of your project:

```env
API_TOKEN=mysecrettoken
PORT=3000

# Optional viewport defaults
DEFAULT_VIEWPORT_WIDTH=800
DEFAULT_VIEWPORT_HEIGHT=600

# Optional Puppeteer options
PUPPETEER_NO_SANDBOX=true

# Optional rate limit settings
RATE_LIMIT_WINDOW=60       # seconds
RATE_LIMIT_MAX=10          # requests per IP per window
```


---

## ▶️ Run the API

```bash
node server.js
```

Or with nodemon for development:

```bash
npx nodemon server.js
```

---

## 📤 API Usage

### Endpoint

```
POST /render?apiToken=your_token
```

### Request Body

```json
{
  "html": "<h1>Hello World</h1>",
  "width": 1024,              // Optional
  "height": 768,              // Optional
  "outputFormat": "binary",   // "base64" or "binary"
  "outputType": "png"         // "png", "jpeg", or "pdf"
}
```

### Example with cURL

```bash
curl -X POST "http://localhost:3000/render?apiToken=mysecrettoken" \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Hello World!</h1>","outputFormat":"binary","outputType":"jpeg"}' \
  --output output.jpg
```

---

## 📂 Project Structure

```
.
├── server.js               # Entry point
├── .env                    # Configuration
├── src/
│   ├── app.js              # Express app setup
│   ├── routes/
│   │   └── render.js       # Main API route
│   ├── services/
│   │   └── puppeteerService.js
│   └── utils/
│       ├── getRateLimiter.js
│       └── validateInput.js
```


---

## ⚠️ Notes

- If you're running inside Docker or Linux environments, and you face issues, enable:
  ```env
  PUPPETEER_NO_SANDBOX=true
  ```

- Do **not expose this API publicly** without proper rate limiting and authentication.

---

## 📜 License

MIT License

---

## 💬 Credits

Created by **Standa Horváth**  
_"From pixels to servers, I've got it covered."_

