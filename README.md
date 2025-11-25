# Re3 - Reduce Reuse Recycle 🌱♻️

A Next.js-powered web application that uses AI to help you make sustainable choices. Scan product barcodes with your device camera to get instant sustainability insights, recycling instructions, and eco-friendly alternatives.

![Re3 App](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

- 📸 **Camera Capture** - Live camera feed with barcode scanning overlay
- 📊 **Barcode Scanning** - Auto-detect UPC, EAN, QR codes, and more
- 🤖 **AI Analysis** - GPT-4 Vision powered sustainability analysis
- ♻️ **Recycling Instructions** - Step-by-step guidance on proper disposal
- 🌍 **Environmental Impact** - Carbon footprint and material composition
- 💡 **Reuse Suggestions** - Creative ideas to give products a second life
- 🛒 **Eco Alternatives** - Discover sustainable product alternatives
- 📝 **Scan History** - Save and review past scans
- ⚙️ **Settings** - Manage API keys and preferences

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- A device with a camera (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd re3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   # OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Important: Camera Permissions

- **Local Development**: Works on `localhost` without HTTPS
- **Production**: Requires HTTPS for camera access
- **Testing on Mobile**: Use ngrok or similar to create HTTPS tunnel

## 🔑 Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key and add it to your `.env.local` file
6. Add billing information (OpenAI requires payment on file)

### Cost Estimates

- **GPT-4o with Vision**: ~$0.01-0.03 per image analysis
- **Budget Option**: Use GPT-4o-mini (~$0.001 per analysis)

To use a different model, set `OPENAI_MODEL` in `.env.local`:
```bash
OPENAI_MODEL=gpt-4o-mini
```

## 📁 Project Structure

```
re3/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # OpenAI API integration
│   │   └── check-key/route.ts    # API key validation
│   ├── history/page.tsx          # Scan history page
│   ├── settings/page.tsx         # Settings page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main scanner page
│   └── globals.css               # Global styles
├── components/
│   ├── BarcodeScanner.tsx        # Barcode scanning logic
│   ├── CameraView.tsx            # Camera interface
│   ├── Header.tsx                # App header
│   ├── Navigation.tsx            # Bottom navigation
│   └── ProductCard.tsx           # Results display
├── lib/
│   ├── api-client.ts             # API client functions
│   ├── barcode-scanner.ts        # Barcode utilities
│   └── storage.ts                # Local storage helpers
├── types/
│   └── index.ts                  # TypeScript interfaces
└── public/                       # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Camera**: react-webcam
- **Barcode**: @zxing/browser
- **AI**: OpenAI GPT-4o Vision
- **Icons**: Lucide React
- **Storage**: LocalStorage API

## 🎨 Design Theme

- **Primary**: Sea Green (#20B2AA)
- **Secondary**: Dark Sea Green (#2E8B57)
- **Accent**: Gold (#FFD700)
- **Background**: Light gradient (#e0f7f4 to #ffffff)

## 📱 Usage Guide

### Scanning a Product

1. Click **"Start Scanning"** on the home page
2. Point your camera at a product barcode
3. The app will auto-detect and scan the barcode
4. Or click the capture button to take a photo manually
5. Wait for AI analysis (5-10 seconds)
6. Review sustainability insights

### Saving to History

1. After analysis, click **"Save to History"**
2. Access saved scans from the History tab
3. View details by clicking on any saved scan
4. Delete individual scans or clear all history

### Settings

- Check API key status
- View storage usage
- Clear all data
- Learn about the app

## 🔒 Security & Privacy

- ✅ All data stored **locally** on your device
- ✅ API key required only on **server-side** (.env.local)
- ✅ No data sent to third parties (except OpenAI for analysis)
- ✅ Images compressed before sending to API
- ⚠️ Never commit `.env.local` to version control

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy!

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean

**Important**: Remember to add `OPENAI_API_KEY` to environment variables!

## 🧪 Testing

### Manual Testing Checklist

- [ ] Camera opens and displays feed
- [ ] Can capture photos
- [ ] Barcode detection works
- [ ] API analysis completes successfully
- [ ] Results display properly
- [ ] Can save to history
- [ ] History page shows saved scans
- [ ] Settings page loads correctly
- [ ] Navigation works between pages
- [ ] Responsive on mobile devices

### Test with Real Products

Try scanning:
- ✅ Plastic bottles (UPC/EAN barcodes)
- ✅ Food packaging
- ✅ Electronic devices
- ✅ Household items

## 🐛 Troubleshooting

### Camera Not Working

- **Check permissions**: Allow camera access in browser settings
- **HTTPS required**: Use localhost for dev or HTTPS for production
- **Browser compatibility**: Use Chrome, Safari, or Edge (latest versions)

### API Errors

- **401 Unauthorized**: Check your API key in `.env.local`
- **429 Rate Limit**: Too many requests - wait and try again
- **413 Payload Too Large**: Image too big - app auto-compresses
- **500 Server Error**: Check API key and OpenAI account status

### Barcode Not Detecting

- **Lighting**: Ensure good lighting conditions
- **Distance**: Hold device 6-12 inches from barcode
- **Focus**: Wait for camera to focus before scanning
- **Manual capture**: Use capture button if auto-scan fails

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🌟 Acknowledgments

- OpenAI for GPT-4 Vision API
- ZXing for barcode scanning
- Next.js team for the amazing framework
- All contributors to open-source libraries used

## 📧 Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: support@re3app.com

---

**Made with 💚 for a sustainable future**

*Help reduce waste, one scan at a time!* 🌍♻️
