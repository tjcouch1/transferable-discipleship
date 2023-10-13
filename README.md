# transferable-discipleship
Simple, Accessible, and Transferable Christian discipleship app in React Native

## Features

- Multi-screen content and Scripture application
- Supports Android, iOS, and sort-of web
- Content and themes dynamically loaded from JSON files
- Scripture references automatically retrieved from the internet
- Automatically generated software library attribution page
- Easy content updates

## Development Environment Setup

1. Install Node
2. Run `git clone https://github.com/tjcouch1/transferable-discipleship.git` or download the repository otherwise
3. Navigate to the `transferable-discipleship` folder created by `git clone`
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

TODO

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

https://docs.expo.dev/eas-update/getting-started/#publish-an-update