I'll create the README.md file in your project directory with the comprehensive content I generated:

```markdown:README.md
# 🍒 Pandiary - Personal Wellness & Mood Tracking App

A comprehensive React Native wellness application that helps users track their daily mood, sleep patterns, energy levels, and mental health metrics. Built with modern React Native architecture and featuring a beautiful, intuitive interface.

## ✨ Features

### 🏠 **Home Dashboard**
- **Weekly Calendar View** - Interactive horizontal calendar with day selection
- **Mood Tracking** - Log daily moods with customizable tags
- **Health Metrics** - Track sleep quality, energy levels, stress, and more
- **Streak Counter** - Monitor your wellness journey consistency
- **Quick Actions** - Fast access to daily logging and past entries

### 📊 **Wellness Analytics**
- **Entry Summary** - Comprehensive overview of your wellness data
- **Statistics Dashboard** - Track patterns in mood, energy, and sleep
- **Progress Visualization** - See your wellness journey over time
- **Data Export** - Access your wellness data for personal insights

### 🧠 **Mental Health Tools**
- **CBT Exercises** - Cognitive Behavioral Therapy tools and resources
- **Thought Log** - Record and analyze automatic thoughts
- **Emotion Tracking** - Monitor emotional patterns and triggers
- **Wellness Insights** - AI-powered wellness recommendations

### �� **Personal Profile**
- **User Information** - Store personal health and wellness details
- **Customizable Settings** - Tailor the app to your preferences
- **Health Goals** - Set and track wellness objectives

## 🛠️ Tech Stack

- **Frontend**: React Native 0.79.5
- **Navigation**: React Navigation 7
- **UI Components**: React Native Paper
- **Database**: Expo SQLite
- **State Management**: React Hooks
- **Icons**: Material Community Icons
- **Fonts**: Circular Std (Custom)
- **Build Tool**: Expo SDK 53

## �� Platform Support

- **Android**: ✅ Fully Supported
- **iOS**: ✅ Fully Supported (Tablet support included)
- **Web**: ✅ Basic Support

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **EAS CLI** (`npm install -g eas-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-feelings-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup

The app automatically sets up SQLite database tables on first launch:
- **entries** - Daily wellness logs
- **user_info** - Personal profile data
- **thought_logs** - Mental health tracking

### 5. Development

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## 🏗️ Building for Production

### Android APK

```bash
# Build preview APK
eas build --platform android --profile preview

# Build production APK
eas build --platform android --profile production
```

### iOS

```bash
# Build for iOS
eas build --platform ios --profile production
```

## 📁 Project Structure

```
my-feelings-app/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── LoadingScreen.tsx
│   │   ├── MessageDialog.tsx
│   │   ├── MoodSelector.tsx
│   │   ├── TagSelector.tsx
│   │   ├── WeeklyCalendar.tsx
│   │   ├── SelectedDayInfo.tsx
│   │   ├── InfoCard.tsx
│   │   └── InfoCardRow.tsx
│   ├── db/                 # Database operations
│   │   └── database.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useMoodEntry.ts
│   │   └── useWeeklyCalendar.ts
│   └── screens/            # App screens
│       ├── HomeScreen.tsx
│       ├── NewEntryScreen.tsx
│       ├── EntryDetailScreen.tsx
│       ├── SummaryScreen.tsx
│       ├── CBTExercisesScreen.tsx
│       ├── UserInfoScreen.tsx
│       ├── ThoughtLogScreen.tsx
│       └── thought-log/    # Thought log related screens
├── assets/                 # Images, fonts, and static files
│   ├── fonts/             # Custom fonts (Circular Std)
│   └── images/            # App icons and splash screens
├── App.tsx                # Main app component
├── app.config.js          # Expo configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## �� Design System

### Color Palette
- **Primary**: Warm coral/peach (#FEAE96)
- **Secondary**: Soft pink (#FE979C)
- **Tertiary**: Deep navy blue (#013237)
- **Background**: Warm cream (#F6E8DF)
- **Surface**: Pure white (#FFFFFF)

### Typography
- **Font Family**: Circular Std
- **Variants**: Book (400), Medium (500), Bold (700)

### Components
- **Cards**: Rounded corners (16px), subtle shadows
- **Buttons**: Consistent border radius, themed colors
- **Inputs**: Outlined style with focus states

## ⚙️ Configuration

### Expo Configuration (`app.config.js`)

```javascript
export default {
  expo: {
    name: "Pandiary",
    slug: "pandiary",
    version: "1.0.0",
    orientation: "portrait",
    newArchEnabled: true,
    // ... other config
  }
};
```

### Database Schema

The app uses SQLite with the following main tables:

```sql
-- Daily wellness entries
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sleep_time TEXT,
  sleep_quality TEXT,
  moods TEXT,
  energy_level TEXT,
  stress_level TEXT,
  body_feel TEXT,
  appetite TEXT,
  focus TEXT,
  motivation TEXT,
  anxiety TEXT,
  others TEXT,
  ai_report TEXT,
  timestamp TEXT
);

-- User profile information
CREATE TABLE user_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  age INTEGER,
  weight INTEGER,
  height INTEGER,
  conditions TEXT,
  medications TEXT,
  hobbies TEXT,
  goals TEXT,
  occupation TEXT,
  physical_activity TEXT,
  additional_info TEXT
);

-- Mental health thought logs
CREATE TABLE thought_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  situation TEXT,
  emotions TEXT,
  automatic_thoughts TEXT,
  evidence_for TEXT,
  evidence_against TEXT,
  alternative_thought TEXT,
  outcome TEXT,
  timestamp TEXT
);
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- **Native Module Conflicts**: Ensure compatible versions of navigation libraries
- **Missing Dependencies**: Run `npm install` after adding new packages
- **Metro Cache**: Clear cache with `npx expo start --clear`

#### Runtime Errors
- **Database Issues**: Check SQLite permissions and table creation
- **Navigation Errors**: Verify React Navigation setup and dependencies
- **Font Loading**: Ensure custom fonts are properly linked

### Development Tips

1. **Use Expo Go** for rapid development and testing
2. **Enable Hermes** for better JavaScript performance
3. **Test on Physical Devices** for accurate performance metrics
4. **Monitor Metro Bundler** for dependency resolution issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- **React Native Community** for the excellent framework
- **Expo Team** for the amazing development tools
- **React Navigation** for robust navigation solutions
- **React Native Paper** for beautiful Material Design components

## 📞 Support

For support and questions:
- **Issues**: Create an issue in the GitHub repository
- **Documentation**: Check the inline code comments
- **Community**: Join React Native community forums

---

**Built with ❤️ using React Native and Expo**
```