# SecuriMed: Health Connect Mobile App

**Group Members:** Clarisse Bianca Bucu, Lance Raphael Bassig, Luis Patrick Dupalco

This mobile application is designed to synchronize health data from Android's **Health Connect** into a **GUN.js** decentralized database. It is part of the SecuriMed project, which explores decentralized solutions for healthcare data sharing and monitoring.

## ⚠️ Branch Information

The actively maintained and working branch is `new-ui`.  
The `main` branch is currently broken due to outdated dependencies and requires a React Native version upgrade.

---

### Instruction for running in a virtual device (Tested using Pixel_3a_API_34_extension_level_7_x86_64 with Android Version 14)
1. Download and install [Android Studio](https://developer.android.com/studio)
2. From the Virtual Device Manager, install a phone virtual device preferably the latest recommended version.
3. Run the installed virtual device.
4. Clone this repository
5. Run the following commands in the command line:
```
npm install
npm run android
``` 

### Instruction for running in a physical android device (Tested using Redmi Note 12 with Android Version 14)
6. In the Developer Options of the phone, turn on USB debugging  and Install via USB. Connect the phone to the laptop using a USB cable.
7.  Follow the instruction [here](https://reactnative.dev/docs/signed-apk-android) to set up options before building the application.
8. Run the following commands in the command line:
```
npx react-native build-android --mode=release
npm run android --mode="release"
``` 
9. See that the application is now installed on the phone.
