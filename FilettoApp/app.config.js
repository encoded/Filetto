import 'dotenv/config';

export default {
  expo: {
    name: 'Filetto',
    slug: 'Filetto',
    scheme: 'filetto', // deep linking scheme (mobile)
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    platforms: ['ios', 'android', 'web'],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.piccolostudio.filetto',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    assetBundlePatterns: ['**/*'],
    extra: {
      eas: {
        projectId: '6633ce80-f0dd-47b3-97d7-0decf27150cf',
      },
      baseUrl: process.env.BASE_URL || '',
    },
  },
};
