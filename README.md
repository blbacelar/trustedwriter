# TrustedWriter - AI House Sitting Application Generator

TrustedWriter is an AI-powered tool that helps you generate personalized house-sitting applications for TrustedHousesitters listings. Simply paste a listing URL, and get a tailored application based on your profile and preferences.

## Features

- 🤖 AI-powered application generation
- 🏠 Automatic listing information extraction
- ✍️ Customizable profile and rules
- 📝 Rich text editor for application editing
- 💾 Save and manage your settings
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A TrustedHousesitters account
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/brunobacelar/trustedwriter.git
cd trustedwriter
```

2. Install dependencies:

```bash
npm install
```

3. Set up your OpenAI API key:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the home page
2. Paste a TrustedHousesitters listing URL
3. Click "Generate Application"
4. Edit the generated application if needed
5. Copy and use in your application

### Customizing Settings

You can customize your profile and application rules in the Settings page:

1. Go to `/settings`
2. Update your profile description
3. Add/remove application rules
4. Click "Save Settings"

## Project Structure

    src/

├── app/ # Next.js 13+ app directory
│ ├── page.tsx # Home page
│ ├── settings/ # Settings page
│ └── api/ # API routes
├── components/ # React components
├── lib/ # Shared utilities
└── utils/ # Backend utilities
├── gpt.ts # OpenAI integration
├── rules.ts # Profile and rules
└── scrap.ts # Web scraping logic

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
API_KEY=your_openai_api_key
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [OpenAI](https://openai.com/) - AI text generation
- [Puppeteer](https://pptr.dev/) - Web scraping
- [TipTap](https://tiptap.dev/) - Rich text editor

## Scripts

json
{
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
}

```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, open an issue in the repository.

## Disclaimer

This project is not affiliated with TrustedHousesitters. Use responsibly and in accordance with TrustedHousesitters' terms of service.

---

Made with ❤️ by [Bruno Bacelar](https://github.com/brunobacelar)
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
