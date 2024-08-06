# discipleship-app-template

Christian discipleship app template in React Native

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
     - Regarding the `Home/About` and `Home/About/Credits` screens specifically, we request that you only add to or restructure and somehow include all the content in these screens in order to credit those whose technologies went into making this template possible and to comply with licensing needs. Otherwise, you're free to modify the content as you desire!
     - To edit with type support, you can put the contents of `data/screens.json` in `src/services/ScreenService.ts` in place of `require('../../assets/data/screens.json')`. We [plan to add JSON schemas](https://github.com/tjcouch1/discipleship%2Dapp%2Dtemplate/issues/25) at some point.
   - `data/colors.json` - Theme colors for the app
   - `fonts` - contains fonts used in the app. Must also update in `App.tsx` and `src/components/contents/Text.tsx`
     - To ensure including the license information for each font works properly, make sure each font family has the font family name at the start of each file name, and make sure each font family has its license in the same directory with the name `<font_family>.LICENSE`
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

## To run locally

Run on your preferred platform on the same network:

- `npm start` - runs in the web browser and allows you to use the Expo Go app to test the app on Android and iOS

## Publishing

You can build, publish, and update this app using [EAS](https://docs.expo.dev/eas/) with the following instructions.

### Publishing Environment Setup

#### Apple Environment Variables

You need to tell Expo about your [Apple credentials](https://docs.expo.dev/submit/ios/#2-start-the-submission) in some way. One way is by setting the following environment variables:

- `EXPO_APPLE_ID` (or set it in [`eas.json`](https://docs.expo.dev/eas/json/#appleid))
- [`EXPO_APPLE_APP_SPECIFIC_PASSWORD`](https://github.com/expo/fyi/blob/main/apple-app-specific-password.md)

### Pre-build setup

There are a few things you need to do before building and publishing the app every time you build and publish.

#### Update Scripture cache

1. [Start the application locally](#to-run-locally) in dev mode and open in the web browser.
2. Wait a bit to make sure Scripture calls have succeeded
   - If there are console errors about not retrieving all Scriptures, it may be a rate limit issue with the server. Please refresh and wait a few times to see if the Scriptures finish caching
3. Copy the local storage value `scriptureCache` and paste it into `./assets/data/scripture.json`.
4. Reload the page and make sure there are no caching messages like "Did not find \_\_\_ in cache. Caching".

#### Update software license attribution

`npm run licenses`

## Building and publishing preview builds

### Create an Android Preview `.apk` to install on your device

`npm run build:preview-android`

### Create an iOS Preview build to install on your device

Before building, you must register devices on which to use the preview build.

#### Register devices to use the iOS Preview build

https://docs.expo.dev/build/internal-distribution/#setting-up-internal-distribution

`eas device:create`

#### Build the iOS Preview

`npm run build:preview-ios`

#### Publishing updates to preview builds

`eas update --branch preview --message "Update message"`

### Building and publishing releases

https://docs.expo.dev/distribution/introduction/

Build first. Then run the following commands to publish the latest build on Expo's servers:

- [`eas submit --platform ios`](https://docs.expo.dev/submit/ios/)
- [`eas submit --platform android`](https://docs.expo.dev/submit/android/)

Note: looks like you can maybe provide `--profile production` to make sure it selects the production build, but it's unclear. Needs testing.

#### Publishing updates to releases

`eas update --branch production --message "vX.Y.Z-update-N Update message"`
