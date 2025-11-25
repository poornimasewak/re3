# Re3 App - Quick Setup Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn
- OpenAI API key

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and paste it in `.env.local`
5. Add billing information (required for API usage)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the App

1. **Allow camera access** when prompted
2. Click "Start Scanning"
3. Point camera at a product barcode
4. Or click capture button to take a photo
5. Wait for AI analysis (5-10 seconds)
6. View sustainability insights!

## Important Notes

### Camera Access
- **Local Development**: Works on `localhost` without HTTPS
- **Production**: Requires HTTPS for camera access
- **Mobile Testing**: Use tools like ngrok for HTTPS tunnel

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Safari (iOS/macOS)
- ✅ Edge
- ❌ Firefox (limited camera API support)

### API Costs
- Each analysis costs ~$0.01-0.03 with GPT-4o
- Use GPT-4o-mini for lower costs (~$0.001)
- Set usage limits in OpenAI dashboard

## Troubleshooting

### Build Errors
If you see OpenAI API key errors during build, that's expected. The app will work fine at runtime with a valid key in `.env.local`.

### Camera Not Working
1. Check browser permissions
2. Ensure HTTPS (or localhost for dev)
3. Try different browsers

### Barcode Not Detecting
1. Improve lighting
2. Hold device 6-12 inches from barcode
3. Use capture button if auto-scan fails

## Project Structure

```
re3/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions
├── types/            # TypeScript types
└── public/           # Static assets
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Next Steps

1. ✅ Verify camera works
2. ✅ Test barcode scanning
3. ✅ Scan a real product
4. ✅ Check scan history
5. ✅ Explore settings

## Support

For issues or questions:
- Check README.md
- Review documentation
- Open GitHub issue

---

**Ready to make the world more sustainable!** 🌍♻️


