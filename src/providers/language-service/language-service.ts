import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LanguageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class LanguageService {
   SCORE_SERVLET:string="/scoreServlet?nestedChapters";
 // contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  contentHeader: Headers = new Headers({"Content-Type": "application/json",
         "Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "X-Requested-With"
,"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"});
  constructor(public http: Http) {
     
  }
  
  load(query) {
      console.log ("query url" + query.url)
      return this.http.get( query.url + this.SCORE_SERVLET,{ headers: this.contentHeader })
       
       // using proxy
       //return this.http.get("/" + query + this.SCORE_SERVLET,{ headers: this.contentHeader })
                    .map((res) => res.json())
    }


   

    writeLocal(key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
        
    }

    readLocal<T>(key: string): T {

        
        let value: string = localStorage.getItem(key);

        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value);
        }

        return null;
    }
   
   removeLocal<T>(key: string) {
        localStorage.removeItem(key);

    }
}

