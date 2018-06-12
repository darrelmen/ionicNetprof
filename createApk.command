#! /bin/bash
cp /Users/darreljohnmendoza/ionicsProj/ionicNetprof/app-release-unsigned.apk .

echo

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore netprof-release-key.jks app-release-unsigned.apk netprof-alias

cp app-release-unsigned.apk /Users/darreljohnmendoza/ionicsProj/androidLoad/netprof-lite.apk

