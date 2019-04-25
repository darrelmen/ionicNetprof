import { Injectable } from '@angular/core';
//import {   RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Platform, } from 'ionic-angular';
import {
    HttpHeaders, HttpClient, HttpHandler,HttpRequest
} from '@angular/common/http';
//import { RequestOptions , RequestOptionsArgs} from '@angular/common';
//import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
//import { TimeoutError } from 'rxjs';
//import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/shareReplay';
import CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device'

import { HTTP } from '@ionic-native/http'
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

//import {AuthInterceptor} from '../auth-interceptor/auth-interceptor';

import { Item } from '../../model/item'
//import { Contents } from '../../model/contents'
//import { Child } from '../../model/child'
import { Sites } from '../../model/Sites'
//import {sign} from 'jsonwebtoken';
import { CookieService } from 'ngx-cookie-service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Binary } from '@angular/compiler';
//import fsa from 'fs-extra'

@Injectable()
export class AuthService {
    LOGIN_URL: string = "http://10.102.12.199:3001/sessions/create";   //10.0.2.2 same as localhost, used when running emulator 10.102.12.199 --my actual ip
    SIGNUP_URL: string = "/scoreServlet";
    SITES_URL: string = "https://netprof.ll.mit.edu/netprof/scoreServlet?projects" // "https://netprof.ll.mit.edu/netprof/scoreServlet?projects" // "https://np.ll.mit.edu/sites.json";
    NET_URL: string = "https://netprof.ll.mit.edu/netprof" // "https://netprof.ll.mit.edu/netprof"
 //   SITES_URL: string = "https://10.10.3.215/netprof/scoreServlet?projects" // "https://netprof.ll.mit.edu/netprof/scoreServlet?projects" // "https://np.ll.mit.edu/sites.json";
  //  NET_URL: string = "https://10.10.3.215/netprof" // "https://netprof.ll.mit.edu/netprof"

    SCORE_SERVLET: string = "/scoreServlet?nestedChapters";
    RECORD_SERVLET: string = "/scoreServlet";
    RECORD_SERVLET2: string = "/scoreServlet/h2";
   
    FORGOT_PASS: string = "/scoreServlet?resetPassword="
    FORGOT_USER: string = "/scoreServlet?forgotUsername="
    SITE_ID: string
    SITE_NAME: string
    USER_ID: string
    PAS_ID: string
    contentHeader: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With"
        , "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS,Set-Cookie"
    });
    //SITES_URL:string ="/sites.json";
    //contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    // public jwtHelper: JwtHelper = new JwtHelper();
    tokenD: any
    user: string;
    error: string;
    isOff = 0
    items: Array<Item> = []


    constructor(
        public http: HttpClient,
        public httpNative: HTTP,
        public platform: Platform,
        public db: Storage,
        public device: Device,
        public transfer: FileTransfer,
        public file: File,
        public cookie:CookieService
   //     public authIntercept:AuthInterceptor
    ) {

        let token = localStorage.getItem('id_token');
        // let token: string;
        // this.db.ready().then(() => {
        //     this.db.get('id_token').then(val => {
        //         token = val
        //         this.tokenD=val    })
        //         console.log("tokeadfasn" + token)
        //     tokenNotExpired(null, token)
        // });

        // if (token) {
        //     this.user = this.jwtHelper.decodeToken(token).username;
        // }
    }


    public authenticated() {
        // condition for checking for mock connection
        //return true
        //console.log("getToken " )
        //if (isOffline || this.isOff == 1) {
        //   this.isOff = 1
        //     return true
        // } else {
        // this.db.get('id_token').then(token => {
        //     console.log(tokenNotExpired(null, token)); // Returns true/false
        // });
        //    return tokenNotExpired('id_token');
        // this.db.get('id_token').then((token) => {
        //     return tokenNotExpired('token', token)});
        //    });

        //  }
    }


    //using observable - has lazy processing 
    loginMD5(credentials) {
        let hash: string = CryptoJS.MD5(credentials.password).toString(CryptoJS.enc.Hex);
        //credentials.password=hash;
        //var cred = { hasUser: credentials.username, p: hash }
        //this.LANG_URL = credentials.site.url
        //if (credentials.site.name == "Mandarin") {
        //    this.SITE_NAME = "CM"
        //} else {
        this.SITE_NAME = credentials.site.name
        //}
        let url: string
        if (credentials.username.length < 5) credentials.username = credentials.username + "_"  //hash password should be uppercase

        console.log(" proj id " + credentials.site.id.toString())
        // let header = new HttpHeaders().set(
        //     "Content-Type", "application/x-www-form-urlencoded").set
        //     ("userid", credentials.username.toString()).set("pass", credentials.password.toString()).set("projid", credentials.site.id.toString()
        //     );
            let header = new HttpHeaders({
                "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With"
                , "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS,Set-Cookie","userid": credentials.username.toString(),
                "pass": credentials.password.toString(),"projid":credentials.site.id.toString()
            });
        //let testURL = "https://np.ll.mit.edu/npfClassroomPashto1/scoreServlet?hasUser=" + cred.hasUser + "&p=" + hash
        if (this.platform.is("core")) {
            //  url = "/npfClassroom" + this.SITE_NAME + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash
            url = "/scoreServlet?hasUser=" + credentials.username + "&p=" + credentials.password

        } else {
            // url = credentials.site.url + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash
            url = this.NET_URL + "/scoreServlet?hasUser=" + credentials.username + "&p=" + credentials.password
        }
        console.log(" url " + url)
       
        //         var data = null;

        //         var xhr = new XMLHttpRequest();


        //         xhr.onreadystatechange = function() {
        //             if (xhr.readyState === 4) {
        //               xhr.response;
        //               var xxhr = new XMLHttpRequest();
        //                   xxhr.withCredentials = true;
        //                   xxhr.onreadystatechange = function() {
        //                   if (xxhr.readyState === 4) {
        //                     xxhr.response;
        //                   } 
        //                 }
        //                   xxhr.open("GET", "/scoreServlet?nestedChapters");
        //                    xxhr.setRequestHeader("projid", "101");
        //                    xxhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        //                    xxhr.setRequestHeader('Access-Control-Allow-Origin','https://netprof.ll.mit.edu/netprof');
        //         xxhr.setRequestHeader('Access-Control-Allow-Methods',' GET, POST');
        //        xxhr.setRequestHeader('Access-Control-Allow-Credentials',' true');
        //        xxhr.setRequestHeader('Access-Control-Expose-Headers','true');

        //                   xxhr.send("");
        //             }
        //           }

        //         xhr.open("GET", "/scoreServlet?hasUser=demo&p=demo",);
        //         xhr.withCredentials = true;
        //         xhr.setRequestHeader("userid", "demo_");
        //         xhr.setRequestHeader("pass", "demo");
        //         xhr.setRequestHeader("projid", "101");
        //         xhr.setRequestHeader("cache-control", "no-cache");

        //         xhr.setRequestHeader('Access-Control-Allow-Origin','https://netprof.ll.mit.edu/netprof');
        //         xhr.setRequestHeader('Access-Control-Expose-Headers','true');

        //         xhr.setRequestHeader('Access-Control-Allow-Methods',' GET, POST');
        //         xhr.setRequestHeader('Access-Control-Allow-Credentials',' true');
        //         xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        //  xhr.send("");
        // return true
        // for testing only web only
       // let next:HttpHandler

        // update: {
        //     headers?: HttpHeaders;
        //     reportProgress?: boolean;
        //     params?: HttpParams;
        //     responseType?: "arraybuffer" | "blob" | "json" | "text";
        //     withCredentials?: boolean;
        //     body?: any;
        //     method?: string;
        //     url?: string;
        //     setHeaders?: {
        //         ...;
        //     };
        //     setParams?: {
        
    //         const req = new HttpRequest("GET",url,{header,responseType: 'text',withCredentials:true});
    // // this.http.request
    // this.authIntercept.intercept(req,next).subscribe((res)=>{
    //     res
    // })  
    // return this.http.get(url, { headers: header, observe: 'response', responseType: 'text', withCredentials: true })
        
    //     .map((res: any) => {
    //             // login successful if there's a jwt token in the response (.id_token is defined in the auth service API - this.LOGIN_URL)
    //             console.log("COOK0 " + window.document.cookie)
    //             // var setCook =getCookie('JSESSIONID')
    //             // console.log( "cook " + setCook)
    //              console.log("session " +JSON.parse(res.body).session)
    //             this.user = credentials.username
    //             //         localStorage.setItem("ck", this.httpNative.getCookieString(url))
    //             localStorage.setItem('username', this.user);
    //             localStorage.setItem('userid', JSON.parse(res.body).userid);
    //             localStorage.setItem('siteid', credentials.site.id.toString());
    //             localStorage.setItem('session',JSON.parse(res.body).session)
    //             this.cookie.set("JSESSIONID",JSON.parse(res.body).session)
    //             this.USER_ID = res.userid
    //             this.SITE_ID = credentials.site.id.toString()
    //             console.log("user id " + JSON.parse(res.body).userid)
    //             console.log("pass " + JSON.parse(res.body).passwordCorrect)
    //             // let token = res.json().id_token
    //             //  console.log("res " + token)
    //             if (JSON.parse(res.body).passwordCorrect === "TRUE") {
    //                 //    console.log("res " + token)
    //                 //     this.authSuccess(token);
    //                 // return true to indicate successful login
    //                 //this.getContents(credentials)
    //                 return true
    //             } else {
    //                 // return false to indicate failed login
    //                 return false;
    //             }
    //         })

        // for deployment
        this.httpNative.setDataSerializer('json');
<<<<<<< HEAD
        this.httpNative.setSSLCertMode("nocheck")
        //this.httpNative.setSSLCertMode("pinned")
=======
        // this.httpNative.acceptAllCerts(true)
        this.httpNative.setSSLCertMode("nocheck")
>>>>>>> 14d3402ce7d771115064f1c36d5db2d3254f5d59
        return this.httpNative.get(url, {},
            { "Content-Type": "application/json", "userid": credentials.username, "pass": credentials.password, "projid": credentials.site.id.toString() })
            .then((data) => {
                //return string JSON 
                let res = JSON.parse(data.data)
                this.user = credentials.username
                localStorage.setItem('username', this.user);
                localStorage.setItem('userid', res.userid);
                localStorage.setItem('pass', credentials.password);

                this.USER_ID = res.userid
                this.SITE_ID = credentials.site.id.toString()
                this.PAS_ID = credentials.password
                // console.log("user id " + res.userid)
                // console.log("pass " + res.passwordCorrect)
                // console.log("cookie  " + this.httpNative.getCookieString(url))
                localStorage.setItem("siteid", credentials.site.id.toString())

                localStorage.setItem("session", this.httpNative.getCookieString(url))
                // let token = res.json().id_token
                console.log("res check")
                if (res.passwordCorrect === "TRUE") {
                    //    console.log("res " + token)
                    //     this.authSuccess(token);
                    // return true to indicate successful login
                    //this.getContents(credentials)
                    return true
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch(error => {

                console.log("login error " + error);
                console.log(error.error); // error message as string
                console.log(error.headers);

            });

    }



    signup(data) {
        // let hashPass = CryptoJS.MD5(data.pass).toString(CryptoJS.enc.Hex);
        let hashEmail = CryptoJS.MD5(data.email.toLowerCase()).toString(CryptoJS.enc.Hex);
        let signUrl: any
        console.log("rest " + data.username.toString())
        console.log("rest " + data.lastname.toString())
        console.log("rest " + data.affiliation.toString())
        console.log("rest " + data.email.toLowerCase())
        console.log("rest plat " + hashEmail.toString())
        console.log("rest plat " + this.device.platform)
        console.log("rest ui " + this.device.uuid)
        if (this.platform.is("core")) {
            signUrl = "/scoreServlet"
        } else {
            signUrl = this.NET_URL + "/scoreServlet"
        }
        //for testing
        console.log("rest " + signUrl)

        //         //for deployment
        this.httpNative.setDataSerializer('urlencoded');
        this.httpNative.setSSLCertMode("nocheck")
        return this.httpNative.post(signUrl, {},
            {
                "Content-Type": "application/x-www-form-urlencoded",
                "user": data.username,
                "email": data.email.toLowerCase(), "emailH": hashEmail, "device": this.device.uuid,
                "deviceType": this.device.platform, "first": data.firstname.toString(), "last": data.lastname,
                "affiliation": data.affiliation, "request": "addUser", "reqid": "1"
            })
            // return this.httpNative.post("https://netprof.ll.mit.edu/netprof/scoreServlet",{}, {"Content-Type":"application/x-www-form-urlencoded",
            //     "user": "dmTest1", "email":"darreljohn.mendoza@dliflc.edu" ,"emailH": "darreljohn.mendoza@dliflc.edu", "device":"23423",
            //    "deviceType":"android","first": "darrel", "last": "mendoza","affiliation":"DLIFLC", "request": "addUser", "reqid": "1"

            //     })
            .then((data) => {
                //return string JSON 
                console.log("result " + data.data)
                return JSON.parse(data.data)
            })
            .catch(error => {
                console.log("Signup error " + error);
                console.log(error.error); // error message as string
                console.log(error.headers);
            });

    }

    logout() {
        console.log('logout success')
        // this.db.ready().then(() => {
        //     this.db.remove('id_token')
        //         .then(str => console.log('token : ', str))
        //         .catch(err => console.error('Token error: ', err));
        // });
        localStorage.removeItem('id_token');

        this.user = null;
    }

    authSuccess(token) {
        this.error = null;

        // this.db.ready().then(() => {

        //     this.db.set('id_token', token)
        //         .then(() => this.db.get('id_token'))
        //         .then(str => console.log('token : ', str))
        //         .catch(err => console.error('Token error: ', err));
        //     this.user = this.jwtHelper.decodeToken(token).username;
        // });
        //   localStorage.setItem('id_token', token);
        //   this.user = this.jwtHelper.decodeToken(token).username;
    }


    getSites() {


        // return new Promise((resolve, reject) => {
        // this.checkPlatform()
        let siteUrl
         if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
         siteUrl="/scoreServlet?projects"
        } else {
            siteUrl=this.SITES_URL
        }
        
        // return this.http.get(siteUrl, { headers: this.contentHeader, withCredentials: true })
        //   .map((res) => res)
        
        // for deployemnt
        this.httpNative.setDataSerializer('json');
        //this.httpNative.acceptAllCerts(true)
        this.httpNative.setSSLCertMode("nocheck")
        return this.httpNative.get(this.SITES_URL, {}, { "Content-Type": "application/json" })
            .then((data) => {
                //return string JSON 
                //  console.log("Site upload " + data.data);

                return JSON.parse(data.data)

            })
            .catch(error => {

                console.log("Site upload error " + error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);

            });

    }

    forgotUserName(data) {

        // if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
        //for testing
        //    return this.http.get(this.FORGOT_USER + data.Email, { headers: this.contentHeader })
        //        .map((res) => res)
        // } else {
        //for deployment
        //this.httpNative.acceptAllCerts(true)
        this.httpNative.setSSLCertMode("nocheck")
        this.httpNative.setDataSerializer('json');
        return this.httpNative.get(this.NET_URL + this.FORGOT_USER + data.Email.toLowerCase(), {}, { "Content-Type": "application/json" })
            .then((data) => {
                //return string JSON 
                console.log("return forgot  " + data.data);
                return JSON.parse(data.data)
            })
            .catch(error => {
                console.log("Items upload error " + error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
            });

        // }
    }

    forgotPassword(data) {

        //if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
        //for testing  
        // return this.http.get(this.FORGOT_PASS + data.Username + "&email=" + data.Email, { headers: this.contentHeader })
        //        .map((res) => res)
        // } else {
        //for deployment
        //this.httpNative.acceptAllCerts(true)
        this.httpNative.setSSLCertMode("nocheck")
        this.httpNative.setDataSerializer('json');
        return this.httpNative.get(this.NET_URL + this.FORGOT_PASS + data.Username + "&email=" + data.Email.toLowerCase(), {}, { "Content-Type": "application/json" })
            .then((data) => {
                //return string JSON 
                return JSON.parse(data.data)
            })
            .catch(error => {
                console.log("Items upload error " + error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
            });

        //  }
    }

    checkPlatform() {
        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
            this.SITES_URL = "/scoreServlet?projects"; //'/sites.json';

            // this.SITES_URL = 'https://cors-anywhere.herokuapp.com/https://np.ll.mit.edu/sites.json';
            console.log("cors " + this.SITES_URL)
        }

    }


    load(query) {

        //for testing
        let url: string
        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
            url = this.SCORE_SERVLET
        } else {
            url = this.NET_URL + this.SCORE_SERVLET
        }
        //for testing
        let header = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded", "userid": "demo_", "pass": "domino22", "projid": query.id.toString() })
       
        // return this.http.get(url, { headers: header, withCredentials: true })
        //     .map((res) => {
        //         console.log("query name " + query.name)
        //         this.parseItemsFromDB(query.language, res)
        //     })


        // for deployment
        let localSiteId = localStorage.getItem("siteid")

        console.log("url " + url + " lang " + query.language + "   new id " + query.id + " current id " + this.SITE_ID + "localsite " + localSiteId +  " user " + this.USER_ID)
        this.httpNative.setDataSerializer('json');
        //  this.httpNative.acceptAllCerts(true)
        this.httpNative.setSSLCertMode("nocheck")
        if (query.id == this.SITE_ID) {
            return this.httpNative.get(url, {}, { "Content-Type": "application/json", "projid": query.id.toString() })
                .then((data) => {
                    //return string JSON 
                    this.parseItemsFromDB(query.language, JSON.parse(data.data))
                    return this.items
                })
                .catch(error => {
                    console.log("Items upload error " + error);
                });
        } else {
            // when selecting a different language wwithout logout
            let username = localStorage.getItem("username")
            return this.httpNative.get(this.NET_URL + "/scoreServlet?hasUser=" + username + "&p=" + this.PAS_ID, {},
                { "Content-Type": "application/json", "userid": username, "pass": this.PAS_ID.toString(), "projid": query.id.toString() })
                .then((dat) => {
                    localStorage.setItem("siteid", query.id.toString())
                    localStorage.setItem("playOption",'1')
                    //store cookie
                    localStorage.setItem("ck", this.httpNative.getCookieString(this.NET_URL + "/scoreServlet?hasUser=" + username + "&p=" + this.PAS_ID))
                    let res = JSON.parse(dat.data)
                    if (res.passwordCorrect === "TRUE") {

                        return this.httpNative.get(url, {}, { "Content-Type": "application/json", "projid": query.id.toString() })
                            .then((data) => {
                                //return string JSON 
                                this.parseItemsFromDB(query.language, JSON.parse(data.data))
                                return this.items
                            })
                            .catch(error => {
                                console.log("Items upload error " + error);
                            });
                    }
                })
        }
    }


    lessonMenu: Array<{
        type: string
        name: string
        count: number
        sublesson?: Array<{
            type: any
            name: any
            count: number
            sub2lesson?: Array<{
                type: any
                name: any
                count: number
            }>
        }>
    }> = []
    topic: Array<{
        name: string
        count?: number
        subtopic?: Array<{
            name: string
            count?: number
        }>
    }> = []
    subtopic?: Array<{
        name: string
        count?: number
    }> = []
    grammar?: Array<{
        name: string
        count?: number
    }> = []
    dialect?: Array<{
        name: string
        count?: number
    }> = []

    parseItemsFromDB(siteName, content: any) {
        this.items = []
        this.lessonMenu = []
        this.grammar = []
        this.topic = []
        this.subtopic = []
        this.dialect = []
        if (content==null || content.content[0].children == undefined  || content.content[0].children.length==0) {
            // 1 level hierarchy 

            for (let items of content.content) {
                let lesson: string
                let lessonId: string
                lesson = items.type
                lessonId = items.name
                let count = 0
                for (let item of items.items) {
                    let tmpItem: Item = item
                    tmpItem.lesson = lesson
                    tmpItem.lessonId = lessonId
                    //let ct= this.parseWords(siteName,item.ct)
                    // let fl= this.parseWords(siteName,item.fl)
                    tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + item.fl + " " + item.en + " " + item.ct + " " + item.tl
                    //for scores and history, needs to add manually otherwise it will not show up later although it is already initialized. 
                    // make sense you dont need to add what you dont need
                    tmpItem.timeRecord=""
                    tmpItem.s = "0"
                    tmpItem.h = []
                    tmpItem.scores = []
                    tmpItem.isRecord = false
                    tmpItem.isScored = false
                    tmpItem.isAddPlaylist = false
                    // for topics, subtopics , dialects and grammar menus
                    if (item.Topic != undefined) {
                        tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + item.fl + " "
                            + item.en + " " + item.ct + " " + item.tl + " " + item.Topic + " " + item.subtopic + item.Grammar + " " + item.Dialect

                        let strTopic: string = item.Topic
                        let strSubTopic = ""

                        // check whether there is a subtopic
                        if (item.subtopic != undefined) {
                            strSubTopic = item.subtopic

                            // let indxTopic = this.topic.indexOf({ name: strTopic })
                            let indxTopic = this.topic.findIndex(x => x.name.trim() == strTopic.trim())

                            let indxSubTopic = -1
                            if (indxTopic > -1) {
                                // indxSubTopic = this.topic[indxTopic].subtopic.indexOf({ name: strSubTopic })
                                indxSubTopic = this.topic[indxTopic].subtopic.findIndex(x => x.name.trim() == strSubTopic.trim())
                            }
                            this.subtopic = []
                            if (indxTopic === -1 && indxSubTopic === -1) {
                                this.subtopic.push({ name: strSubTopic, count: 1 })
                                this.topic.push({ name: strTopic, count: 1, subtopic: this.subtopic })
                            } else if (indxTopic > -1 && indxSubTopic === -1) {
                                this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                this.topic[indxTopic].subtopic.push({ name: strSubTopic, count: 1 })
                            } else {
                                this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                this.topic[indxTopic].subtopic[indxSubTopic].count = this.topic[indxTopic].subtopic[indxSubTopic].count + 1
                            }
                        } else {
                            let indxTopic = this.topic.findIndex(x => x.name.trim() == strTopic.trim())
                            if (indxTopic === -1) {
                                this.topic.push({ name: strTopic, count: 1 })
                            } else if (indxTopic > -1) {
                                this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                            } else {
                                this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                            }
                        }
                    }
                    if (item.Grammar != undefined) {
                        let strGrammar: string = item.Grammar
                        let indxGrammar = this.grammar.findIndex(x => x.name.trim() == strGrammar.trim())
                        if (indxGrammar == -1) {
                            this.grammar.push({ name: strGrammar, count: 1 })
                        } else {
                            this.grammar[indxGrammar].count = this.grammar[indxGrammar].count + 1
                        }
                    }
                    if (item.Dialect != undefined) {
                        let strDialect: string = item.Dialect
                        let indxDialect = this.dialect.findIndex(x => x.name.trim() == strDialect.trim())
                        if (indxDialect == -1) {
                            this.dialect.push({ name: strDialect, count: 1 })
                        } else {
                            this.dialect[indxDialect].count = this.dialect[indxDialect].count + 1
                        }
                        tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + item.fl + " "
                            + item.en + " " + item.ct + " " + item.tl + " " + item.Topic + " " + item.subtopic + item.Grammar + " " + item.Dialect

                    }
                    this.items.push(tmpItem)
                    count++
                }
                this.lessonMenu.push({ type: lesson, name: lessonId, count: count, sublesson: [] })

            }


            // var items = content.content.reduce((items, content) => {
            //     content.items.forEach(item => {
            //         items[item.topic] = items[item.topic] || 0;
            //         items[item.topic]++;
            //     });
            //     return items;
            //   }, {});

        } else {
            // 2 level hierarchy 
            let lessIdx = 0
            for (let children of content.content) {
                let lesson = children.type
                let lessonId = children.name
                let lessonTotal = 0
                this.lessonMenu.push({ type: lesson, name: lessonId, count: lessonTotal, sublesson: [] })
                //sublessons
                for (let items of children.children) {
                    let sublesson = items.type
                    let sublessonId = items.name
                    let count = 0
                    for (let item of items.items) {
                        let tmpItem: Item = item
                        tmpItem.lesson = lesson
                        tmpItem.sublesson = sublesson
                        tmpItem.lessonId = lessonId
                        tmpItem.sublessonId = sublessonId
                        tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + sublesson + " " + sublessonId + " " + item.fl + " "
                            + item.en + " " + item.ct + " " + item.tl
                        //let ct= this.parseWords(siteName,item.ct)
                        //let fl= this.parseWords(siteName,item.fl)
                        // tmpItem.searchTopic= lesson +" " + sublesson + " " + item.ct + " " + item.fl + " " + item.en
                        //for scores and history, needs to add manually otherwise it will not show up later although it is already initialized. 
                        // make sense you dont need to add what you dont need
                        tmpItem.timeRecord=""
                        tmpItem.s = "0"
                        tmpItem.h = []
                        tmpItem.scores = []
                        tmpItem.isRecord = false
                        tmpItem.isScored = false
                        tmpItem.isAddPlaylist = false

                        // for topics, subtopics, dialects and grammar menus
                        if (item.Topic != undefined) {
                            tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + sublesson + " " + sublessonId + " " + item.fl + " "
                                + item.en + " " + item.ct + " " + item.tl + " " + item.Topic + " " + item.subtopic + " " + item.Grammar + " " + item.Dialect

                            let strTopic: string = item.Topic
                            let strSubTopic = ""

                            // check whether there is a subtopic
                            if (item.subtopic != undefined) {
                                strSubTopic = item.subtopic

                                // let indxTopic = this.topic.indexOf({ name: strTopic })
                                let indxTopic = this.topic.findIndex(x => x.name.trim() == strTopic.trim())

                                let indxSubTopic = -1
                                if (indxTopic > -1) {
                                    // indxSubTopic = this.topic[indxTopic].subtopic.indexOf({ name: strSubTopic })
                                    indxSubTopic = this.topic[indxTopic].subtopic.findIndex(x => x.name.trim() == strSubTopic.trim())
                                }
                                this.subtopic = []
                                if (indxTopic === -1 && indxSubTopic === -1) {
                                    this.subtopic.push({ name: strSubTopic, count: 1 })
                                    this.topic.push({ name: strTopic, count: 1, subtopic: this.subtopic })
                                } else if (indxTopic > -1 && indxSubTopic === -1) {
                                    this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                    this.topic[indxTopic].subtopic.push({ name: strSubTopic, count: 1 })
                                } else {
                                    this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                    this.topic[indxTopic].subtopic[indxSubTopic].count = this.topic[indxTopic].subtopic[indxSubTopic].count + 1
                                }
                            } else {
                                let indxTopic = this.topic.findIndex(x => x.name.trim() == strTopic.trim())
                                if (indxTopic === -1) {
                                    this.topic.push({ name: strTopic, count: 1 })
                                } else if (indxTopic > -1) {
                                    this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                } else {
                                    this.topic[indxTopic].count = this.topic[indxTopic].count + 1
                                }
                            }
                        }
                        if (item.Grammar != undefined) {
                            let strGrammar: string = item.Grammar
                            let indxGrammar = this.grammar.findIndex(x => x.name.trim() == strGrammar.trim())
                            if (indxGrammar == -1) {
                                this.grammar.push({ name: strGrammar, count: 1 })
                            } else {
                                this.grammar[indxGrammar].count = this.grammar[indxGrammar].count + 1
                            }
                        }

                        if (item.Dialect != undefined) {
                            let strDialect: string = item.Dialect
                            let indxDialect = this.dialect.findIndex(x => x.name.trim() == strDialect.trim())
                            if (indxDialect == -1) {
                                this.dialect.push({ name: strDialect, count: 1 })
                            } else {
                                this.dialect[indxDialect].count = this.dialect[indxDialect].count + 1
                            }
                            tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + sublesson + " " + sublessonId + " " + item.fl + " "
                                + item.en + " " + item.ct + " " + item.tl + " " + item.Topic + " " + item.subtopic + item.Grammar + " " + item.Dialect

                        }
                        this.items.push(tmpItem)
                        count++
                    }

                    this.lessonMenu[lessIdx].sublesson.push({ type: sublesson, name: sublessonId, count: count })
                    lessonTotal++

                }
                this.lessonMenu[lessIdx].sublesson = this.lessonMenu[lessIdx].sublesson.sort(function (a, b) {
                    return parseFloat(a.name) - parseFloat(b.name);
                })

                this.lessonMenu[lessIdx].count = lessonTotal
                lessIdx++
            }
        }

       

        this.lessonMenu = this.lessonMenu.sort(function (a, b) {
            return parseFloat(a.name) - parseFloat(b.name);
        })
        this.db.set(siteName, this.items)
        this.db.set(siteName + "menu", this.lessonMenu)
        this.db.set(siteName + "topic", this.topic)
        this.db.set(siteName + "grammar", this.grammar)
        this.db.set(siteName + "dialect", this.dialect)
        console.log("load success")
    }


    //not used currently
    parseWords(siteName, words: string) {
        var wordList = "";
        if (siteName == "Mandarin" || siteName == "Korean") {
            words.split('').forEach((word) => {
                wordList = wordList + word + "  "
            })
            //  console.log(" ct " + wordList)
            // } else if (site == "MSA" || site == "Egyptian" || site == "Levantine" || site == "Pashto1" || site == "Pashto2" || site == "Pashto3"
            //   || site == "Dari" || site == "Farsi" || site == "Urdu" || site == "Iraqi" || site == "Sudanese") {
            //   wordsRightOrder = this.randomizeAnswers(item.ct.split(','))
        } else if (siteName == "Japanese") {
            words.split('').forEach((word) => {
                wordList = wordList + word + "  "
            })
        } else {
            wordList = words
            console.log(" flct " + wordList)
        }
        return wordList
    }


    getScores(lesson) {
        //let userid = localStorage.getItem("userid")
        var scoreUrl;
        // let testURL = url + "scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson 
        let userid = localStorage.getItem('userid');
        this.SITE_ID = localStorage.getItem("siteid")
        console.log("url " + this.NET_URL + " userid " + userid + " lesson " + lesson + " site_id " + this.SITE_ID)
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            scoreUrl = "/scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson
        } else {
            scoreUrl = this.NET_URL + "/scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson
            console.log("scoreUrl " + scoreUrl)
            let head = new HttpHeaders({
                "Content-Type": "application/json", "projid": this.SITE_ID
            })
        }
        //for testng
            // return this.http.get(scoreUrl, {headers: head})
            // .map((res:JSON) => res)

            //for deployment
            this.httpNative.setDataSerializer('json');
            // this.httpNative.acceptAllCerts(true)
            this.httpNative.setSSLCertMode("nocheck")
            return this.httpNative.get(scoreUrl, {}, { "Content-Type": "application/json", "projid": this.SITE_ID })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Score upload error " + error);
                    return null
                });

            //https://np.ll.mit.edu/npfClassroomCM/scoreServlet?request=chapterHistory&user=171&Unit=2&Lesson=8
        
    }


    postRecording(recordFile, ex_id: string, filename, newText?: string) {
        this.USER_ID = localStorage.getItem('userid')
        this.SITE_ID= localStorage.getItem("siteid")
       
        var recordUrl

        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            //for languages in Hydra 2 MSA,Levantine,Korean, Russian
            if(this.SITE_ID=='85' || this.SITE_ID=='88' || this.SITE_ID=='89' || this.SITE_ID=='90') {
                recordUrl = this.RECORD_SERVLET2
            } else {
                recordUrl = this.RECORD_SERVLET
            }
         } else {
            if(this.SITE_ID=='85' || this.SITE_ID=='88' || this.SITE_ID=='89' || this.SITE_ID=='90') {
                recordUrl = this.NET_URL + this.RECORD_SERVLET2
            } else {
                recordUrl = this.NET_URL + this.RECORD_SERVLET
            }
        }
        // console.log("filePath to upload " + recordFile)
        // console.log("servlet url " + recordUrl)
//         console.log(ex_id  + " " + recordFile +" "+ filename)
//        recordFile="/Users/darreljohnmendoza/desktop/743856_rec1.wav"
//        filename='743856_rec1.wav'
//         let headers:HttpHeaders = new HttpHeaders( {
//             "user": this.USER_ID, "deviceType": this.device.platform, "device": this.device.uuid,"mimeType": "audio/wav"
//                , "exercise": ex_id, "request": "decode", "reqid": "1","projid": this.SITE_ID
//         })
//        // let cookie = localStorage.getItem('ck')
//        headers.delete("Content-Type")
//        let fsr=new FileReader()
//         var formData = new FormData();
//         formData.append("file",recordFile,filename);
//         console.log(formData  + " " + recordFile +" "+ filename)

//        let fs = require('fs');
// // return fs.readFile(recordFile, (err, data) => {
//     // Data is a Buffer object 
//  //       data
//  //let audioBlob = new Blob(recordFile)

//         return this.http.post(recordUrl,fsr.readAsDataURL(recordFile),{headers:headers,reportProgress:true})
   


        // use ft.upload
        
        let cookie =localStorage.getItem("session")
        console.log("get Cookie " + cookie)
        console.log("url  " + recordUrl)
        console.log('site id '  + this.SITE_ID)
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: filename,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", "user": this.USER_ID, "deviceType": this.device.platform, "device": this.device.uuid
                , "exercise": ex_id, "request": "decode", "reqid": "1", "cookie": cookie, "projid": this.SITE_ID
            },

            // for new items         
            //     headers: {
            //        "Content-Type": "application/x-www-form-urlencoded", "user": this.USER_ID, "deviceType": this.device.platform, "device": this.device.uuid
            //        , "exercise": ex_id, "request": "align", "reqid": "1", "projid": this.SITE_ID, "Cookie": cookie,"language":"tagalog","full":"full","exerciseText":btoa(newText)
            //    },
            mimeType: "audio/x-wav",

        }
        let ft: FileTransferObject = this.transfer.create();

        return ft.upload(encodeURI(recordFile), encodeURI(recordUrl), options, true)
            //return this.httpNative.post(recordUrl, recordFile,{headers: this.contentHeader})
            .then((data) => {
                console.log("status " + data.response);
                return JSON.parse(data.response)
            })
            .catch(error => {
                console.log("Record Score Error " + error);
                return null
            });




        //for deployment  --- not in place
        // let headers=  {
        //         fileKey: 'file',
        //        headers: {
        //         "content-type": "application/x-www-form-urlencoded", "user": this.USER_ID.toString(), "deviceType": this.device.platform.toString(),
        //          "device": this.device.uuid.toString()
        //         , "exercise": ex_id.toString(), "request": "decode", "reqid": "1", "projid": this.SITE_ID.toString()
        //         },
        //         mimeType: "audio/x-wav"
        //     }
        //    return this.platform.ready().then(()=>{
        //     this.httpNative.setSSLCertMode("pinned")

        //    //this.httpNative.setDataSerializer('urlencoded');
        //     // let recPath= recordFile.substring(0,recordFile.length-filename.length)
        //     //    console.log("fe " + filename + " rec " + recPath + " e " + ex_id+ " s  " + this.SITE_ID + " u " + this.USER_ID) 
        //     //  return this.file.resolveLocalFilesystemUrl(recordFile).then(fe => {
        //     //   console.log(" fe  nat " + fe.nativeURL) 
        //     //   console.log(" fe to " + fe.toURL()) 
        //     return this.httpNative.uploadFile(recordUrl, "", {"Content-type": "application/x-www-form-urlencoded",
        //          mimeType: "audio/wav",
        //         "user": this.USER_ID, "deviceType": this.device.platform,
        //         "device": this.device.uuid
        //         , "exercise": ex_id.toString(), "request": "decode", "reqid": "1", "projid": this.SITE_ID
        //     }, recordFile, "wav")
        //         .then((data) => {
        //             //return string JSON 
        //             console.log("data " + data.data)
        //             return JSON.parse(data.data)
        //         })
        //         .catch(error => {
        //             console.log("Audio upload error " + error);
        //         })    


        // var xReq = new XMLHttpRequest();
        // xReq.open("GET", "https://netprof.ll.mit.edu/netprof/scoreServlet?hasUser=demo&p=demo", true);
        // xReq.setRequestHeader("userid","demo_")
        // xReq.setRequestHeader("pass","demo")
        // xReq.setRequestHeader("projid","101")
        // xReq.send()
        //     // console.log("response x " + xReq.response)
        //    var oReq = new XMLHttpRequest();

        // // //    oReq.withCredentials = true;
        // // //     oReq.addEventListener("readystatechange", function () {
        // // //         if (this.readyState === 4) {
        // // //             console.log(this.responseText);
        // // //         }
        // // //     });
        //     oReq.open("POST", recordUrl, true);
        //     oReq.withCredentials = true;

        //     oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        //     oReq.setRequestHeader("user", this.USER_ID)
        //     oReq.setRequestHeader("deviceType", this.device.platform)
        //     oReq.setRequestHeader("exercise", ex_id)
        //     oReq.setRequestHeader("device", this.device.uuid)
        //     oReq.setRequestHeader("reqid", "1")
        //     oReq.setRequestHeader("request", "decode")
        //     oReq.setRequestHeader("projid", this.SITE_ID)
        //     oReq.onload = function (oEvent) {
        //         // all done!
        //     };
        //     // Pass the blob in to XHR's send method
        //     oReq.send(recordFile);
        //     console.log("response " + oReq.response)
        //     return oReq.response
    }

}

