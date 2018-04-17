import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
// to fix error in not loading http native if using it
//import { HTTP } from '@ionic-native/http';
// HTTP.getPluginRef = () => "cordova.plugin.http";

platformBrowserDynamic().bootstrapModule(AppModule);
