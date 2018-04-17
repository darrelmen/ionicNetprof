# ionicNetprof
Ionic version of Netprof

How to install netprof-lite ionic app

If you don’t have these installed yet
Download and install the latest Android Studio
Download and install the java sdk
Download and install the latest Xcode

Any editor will work but I prefer to use 
Visual Studio Code-it has and integrated debugging tools
https://code.visualstudio.com/download
Use Mac download

Open a terminal
Please make sure latest Node 6 LTS and NPM 3+ are installed.
Then, install the CLI globally (you may need sudo):


npm install -g ionic@3.9.2

Check Ionic Docs https://ionicframework.com/docs/

Create your working directory

Download or checkout netprof-lite /ionic apps

Git checkout net prof-lite

Go to the net prof-lite Directory.

The first time will take several minutes to install all the plugins and dependencies

  npm install

  ionic cordova build android

  ionic cordova build ios 

If you get an error run this again.

  ionic cordova plugin add cordova-plugin-file-transfer@1.6.3

  ionic cordova build android

We need this for the recording to be posted properly to the server.

  cp resources/*.java platforms/android/app/src/main/java/org/apache/cordova/media/.

If you want to check the codes, you can open the downloaded code from your editor.

All of the codes are on src directory.


Running on Android Emulator/Android Device

Open Android studio

Find your project then go to platforms/android

Create an AVD (Android Virtual Device) emulator

Tools/AVD Manager

Click on LogCat - to view the logs

Click on Run then select your emulator


Running on Xcode/Ios Device

Open xCode

Find your project then go to platforms/ios/netProF-lite.xcodeproj

Click on the project

General/Signing/Team - select any provisioning you have.

Run


Note :

In order to run on browser we need to do minor changes to following files . 

Auth-service.js

Login.ts ,Chapterover.ts,

Menu items.ts Record.ts 

This is needed because the Native-advance-http does not run on a browser and we need it to bypass CORs for iOS - we can fix this later when we have the correct certs and not use the native but the angular http.
