# SideGames Golf - Frontend

A React TypeScript application for managing golf side games and events.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=SideGames Golf
VITE_APP_VERSION=1.0.0
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build:prod
```

### Testing
```bash
npm run test
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants
└── config/             # Configuration files
```

## 🛠️ Key Features

- **TypeScript**: Full type safety
- **React 18**: Latest React features
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend as a Service
- **React Router**: Client-side routing
- **Error Boundaries**: Production error handling
- **Lazy Loading**: Code splitting for performance

## 🔧 Development

### Code Quality
- ESLint for linting
- TypeScript for type checking
- Prettier for formatting (recommended)

### Testing
- Vitest for unit testing
- React Testing Library for component testing
- Coverage reporting

### Performance
- Code splitting with React.lazy
- Bundle analysis with rollup-plugin-visualizer
- Optimized builds for production

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect your repository
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`

### Manual Deployment
1. Run `npm run build:prod`
2. Upload `dist` folder to your hosting provider

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- Error boundaries to prevent crashes

## 📊 Monitoring

- Error tracking (recommend Sentry)
- Performance monitoring
- User analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
