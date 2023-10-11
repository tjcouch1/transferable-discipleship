# transferable-discipleship
Simple, Accessible, and Transferable Christian discipleship app in React Native

## Features

- Multi-screen content and Scripture application
- Supports Android, iOS, and sort-of web
- Content and themes dynamically loaded from JSON files
- Scripture references automatically retrieved from the internet
- Automatically generated software library attribution page
- Easy content updates

## Things left to adapt this from the template

4. Customize the icons, content data, and theme data in the `assets` folder:
    - `adaptive-icon.png` - Icon used in Android
    - `favicon.png` - Icon used in web
    - `icon.png` - Icon used in iOS
    - `splash.png` - Loading splash screen image

## Development Environment Setup

1. Install Node
2. Run `git clone https://github.com/tjcouch1/transferable-discipleship.git` or download the repository otherwise
3. Navigate to the `transferable-discipleship` folder created by `git clone`
4. Run `npm install`

### Build license 

Run `npm run licenses` to build the software library licenses file (displayed in the app for attribution purposes).

## To run

Run on your preferred platform:

- `npm start` - runs in the web browser, and allows you to use the expo app to test the app on android and ios
- `npm run android`
- `npm run ios`
   - Note: you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac

## Publishing

You can build, publish, and update this app using [EAS](https://docs.expo.dev/eas/) with the following instructions.

### Pre-build setup

There are a few things you need to do before building and publishing the app.

#### Update Scripture cache

TODO

#### Update software license attribution

TODO

## Building and publishing preview builds

### Create an Android Preview `.apk` to install on your device

`npm run build:android-preview`

### Create an iOS Preview build to install on your device

https://docs.expo.dev/build/internal-distribution/#configure-app-signing

#### Register devices to use the iOS Preview build

https://docs.expo.dev/build/internal-distribution/#setting-up-internal-distribution

#### Publishing updates to preview builds

`eas update --branch preview --message "Update message"`

### Building and publishing releases

https://docs.expo.dev/distribution/introduction/

#### Publishing updates to releases

https://docs.expo.dev/eas-update/getting-started/#publish-an-update