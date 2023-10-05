# discipleship-app-template
Christian discipleship app template in React Native

## Features

- Template for multi-screen content and Scripture application
- Supports Android, iOS, and sort-of web
- Content and themes dynamically loaded from JSON files
- Scripture references automatically retrieved from the internet
- Automatically generated software library attribution page
- Easy content updates

## How to adapt this template to your own app

1. Fork this repo! https://github.com/tjcouch1/discipleship-app-template
2. Find and Replace all of the following strings with your desired information:
    - Discipleship App Template -> app name
    - discipleship-app-template -> repository name
    - <repo_url> -> repository url (ex: https://github.com/tjcouch1/discipleship-app-template)
    - <content_creator> -> content creator's name
    - <contact_email> -> preferred email address for contact about the app
3. Revise the following files to fit your application's needs:
    - `package.json`
    - `README.md`
    - `app.json`
4. Customize the icons, content data, and theme data in the `assets` folder:
    - `adaptive-icon.png` - Icon used in Android
    - `favicon.png` - Icon used in web
    - `icon.png` - Icon used in iOS
    - `splash.png` - Loading splash screen image
    - `data/screens.json` - Content for the app
    - `data/colors.json` - Theme colors for the app
    - `fonts` - contains fonts used in the app. Must also update in `App.tsx` and `src/components/contents/Text.tsx`
    - `images` - contains images used in the app. Must also update in `src/services/ImageService.ts`
5. Configure [EAS](https://docs.expo.dev/eas/) to prepare for [publishing](#publishing)
    - Install EAS CLI: `npm install --global eas-cli`
    - Login to EAS with your [Expo account](https://expo.dev/): `eas login`
    - Link EAS to this project: `eas update:configure`

## Development Environment Setup

1. Install Node
2. Run `git clone <repo_url>.git` or download the repository otherwise
3. Navigate to the `discipleship-app-template` folder created by `git clone`
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