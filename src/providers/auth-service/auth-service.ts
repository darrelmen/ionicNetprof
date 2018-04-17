import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Platform } from 'ionic-angular';

import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { TimeoutError } from 'rxjs';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/shareReplay';
import CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device'

import { HTTP } from '@ionic-native/http'
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { Item } from '../../model/item'
//import { Contents } from '../../model/contents'
//import { Child } from '../../model/child'


//import {sign} from 'jsonwebtoken';


@Injectable()
export class AuthService {
    LOGIN_URL: string = "http://10.102.12.199:3001/sessions/create";   //10.0.2.2 same as localhost, used when running emulator 10.102.12.199 --my actual ip
    SIGNUP_URL: string = "/scoreServlet";
    SITES_URL: string = "https://np.ll.mit.edu/sites.json";
    SCORE_SERVLET: string = "/scoreServlet?nestedChapters";
    RECORD_SERVLET: string = "/scoreServlet";
    FORGOT_PASS: string = "https://np.ll.mit.edu/npfClassroomCM/scoreServlet?resetPassword="
    FORGOT_USER: string = "https://np.ll.mit.edu/npfClassroomCM/scoreServlet?forgotUsername="

    SITE_NAME: string
    LANG_URL: any
    USER_ID: string
    contentHeader: Headers = new Headers({
        "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "X-Requested-With"
        , "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS,Set-Cookie"
    });
    //SITES_URL:string ="/sites.json";
    //contentHeader: Headers = new Headers({"Content-Type": "application/json"});

    public jwtHelper: JwtHelper = new JwtHelper();
    tokenD: any
    user: string;
    error: string;
    isOff = 0
    items: Array<Item> = []
    lesson: Array<{
        type: string
        name: string
        count: number
    }> = []
    sublesson: Array<{
        type: string
        name: string
        count: number
        lesson?: {
            type: any
            name: any
        }
    }> = []

    constructor(
        public http: Http,
        public httpNative: HTTP,
        public platform: Platform,
        public db: Storage,
        public device: Device,
        public transfer: FileTransfer,
        public file: File
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

        if (token) {
            this.user = this.jwtHelper.decodeToken(token).username;
        }
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
        return tokenNotExpired('id_token');
        // this.db.get('id_token').then((token) => {
        //     return tokenNotExpired('token', token)});
        //    });

        //  }
    }

    //using observable - has lazy processing 
    loginMD5(credentials) {
        let hash = CryptoJS.MD5(credentials.password).toString(CryptoJS.enc.Hex);
        //credentials.password=hash;
        //var cred = { hasUser: credentials.username, p: hash }
        this.LANG_URL = credentials.site.url
        if (credentials.site.name == "Mandarin") {
            this.SITE_NAME = "CM"
        } else {
            this.SITE_NAME = credentials.site.name
        }
        let url = this.LANG_URL
        //let testURL = "https://np.ll.mit.edu/npfClassroomPashto1/scoreServlet?hasUser=" + cred.hasUser + "&p=" + hash
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            url = "/npfClassroom" + this.SITE_NAME + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash
            // for testing only
            // return this.http.get(url, { headers: this.contentHeader, withCredentials: true })
            //     .map((res) => {
            //         // login successful if there's a jwt token in the response (.id_token is defined in the auth service API - this.LOGIN_URL)
            //         this.user = credentials.username
            //         localStorage.setItem('username', this.user);
            //         localStorage.setItem('userid', res.json().userid);
            //         this.USER_ID = res.json().userid
            //         console.log("user id " + res.json().userid)
            //         console.log("pass " + res.json().passwordCorrect)
            //         // let token = res.json().id_token
            //         //  console.log("res " + token)
            //         if (res.json().passwordCorrect === true) {
            //             //    console.log("res " + token)
            //             //     this.authSuccess(token);
            //             // return true to indicate successful login
            //             //this.getContents(credentials)
            //             return true
            //         } else {
            //             // return false to indicate failed login
            //             return false;
            //         }
            //     })

        } else {
            url = credentials.site.url + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash

            // for deployment
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(url, {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    let res = JSON.parse(data.data)

                    this.user = credentials.username
                    localStorage.setItem('username', this.user);
                    localStorage.setItem('userid', res.userid);
                    this.USER_ID = res.userid
                    console.log("user id " + res.userid)
                    console.log("pass " + res.passwordCorrect)
                    // let token = res.json().id_token
                    //  console.log("res " + token)
                    if (res.passwordCorrect === true) {
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

                    console.log("Site upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);

                });
        }
    }
    //using observable - has lazy processing 
    loginObs(credentials) {
        return this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
            .map((res) => {
                // login successful if there's a jwt token in the response (.id_token is defined in the auth service API - this.LOGIN_URL)
                let token = res.json().id_token
                if (token) {
                    this.authSuccess(token);
                    // return true to indicate successful login
                    //this.getContents(credentials)
                    console.log(" login true")

                    return true
                } else {
                    // return false to indicate failed login
                    console.log(" login false")
                    return false;
                }
            }).shareReplay()
        // .catch(this.handleError);
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }


    //using promise  old style
    login(credentials) {
        console.log(credentials);
        return new Promise((resolve, reject) => {
            this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
                .map(res => res.json())
                .subscribe(
                    data => {
                        console.log(data)
                        this.authSuccess(data.id_token);
                        console.log('data.id_token' + data.id_token)
                        resolve(data)
                    },
                    err => {
                        this.error = err;
                        reject(err)
                    }
                );
        });
    }


    signup(data) {
        let hashPass = CryptoJS.MD5(data.pass).toString(CryptoJS.enc.Hex);
        let hashEmail = CryptoJS.MD5(data.email.toLowerCase()).toString(CryptoJS.enc.Hex);
        let signUrl: any
        let contentHeader: Headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded", "user": data.username, "passwordH": hashPass, "emailH": hashEmail,
            "device": this.device.uuid, "deviceType": this.device.platform, "request": "addUser", "reqid": "1"
        });
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            signUrl = "/npfClassroomCM/scoreServlet"
            return this.http.post(signUrl, {}, { headers: contentHeader })
                .map(res => {
                    res.json()
                });
        } else {
            signUrl = this.LANG_URL + "/scoreServlet"
            //for deployment
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.post(signUrl, {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Items upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);
                });
        }
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
        localStorage.setItem('id_token', token);
        this.user = this.jwtHelper.decodeToken(token).username;
    }


    getSites() {
        // return new Promise((resolve, reject) => {
        this.checkPlatform()
        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
          //  return this.http.get(this.SITES_URL, { headers: this.contentHeader })
          //      .map((res) => res.json())
        } else {
            // for deployemnt
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)

            return this.httpNative.get(this.SITES_URL, {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    console.log("Site upload " + data.data);

                    return JSON.parse(data.data)

                })
                .catch(error => {

                    console.log("Site upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);

                });
        }
    }

    forgotUserName(data) {

        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
          //for testing
          //  return this.http.get(this.FORGOT_USER + data.Email, { headers: this.contentHeader })
          //      .map((res) => res.json())
        } else {
            //for deployment
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(this.FORGOT_USER + data.Email.toLowerCase(), {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Items upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);
                });

        }
    }

    forgotPassword(data) {

        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
        //for testing  
        //return this.http.get(this.FORGOT_PASS + data.Username + "&email=" + data.Email, { headers: this.contentHeader })
         //       .map((res) => res.json())
        } else {
            //for deployment
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(this.FORGOT_PASS + data.Username + "&email=" + data.Email.toLowerCase(), {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Items upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);
                });

        }
    }

    checkPlatform() {
        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
            this.SITES_URL = '/sites.json';

            // this.SITES_URL = 'https://cors-anywhere.herokuapp.com/https://np.ll.mit.edu/sites.json';
            console.log("cors " + this.SITES_URL)
        }

    }


    getScores(lesson) {

        //let userid = localStorage.getItem("userid")
        var scoreUrl;
        // let testURL = url + "scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson 
        let userid = localStorage.getItem('userid');
        console.log("url " + this.LANG_URL + " userid " + userid + " lesson " + lesson)
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            scoreUrl = "/npfClassroomCM/scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson
            //for testng
           // return this.http.get(scoreUrl, { headers: this.contentHeader })
            //    .map((res) => res.json())
        } else {
            scoreUrl = this.LANG_URL + "/scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson
            console.log("scoreUrl " + scoreUrl)

            //for deployment
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(scoreUrl, {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {

                    console.log("Site upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);

                });

            //https://np.ll.mit.edu/npfClassroomCM/scoreServlet?request=chapterHistory&user=171&Unit=2&Lesson=8
        }
    }

    postRecording(recordFile, ex_id: string, filesize: string, filename) {

        this.USER_ID = localStorage.getItem('userid')
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: filename,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", "user": this.USER_ID, "deviceType": this.device.platform, "device": this.device.uuid
                , "exercise": ex_id, "request": "decode", "reqid": "1"
            },
            mimeType: "audio/x-wav"
        }

        // //recordFile = normalizeURL("/Users/darreljohnmendoza/Desktop/1453_rec.wav")
        // //return this.http.post("https://np.ll.mit.edu/npfClassroomEnglish/scoreServlet", recordFile, { headers: contentHeaders })
        var recordUrl
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            //for testing Chinese
            recordUrl = "/npfClassroomCM/scoreServlet"
        } else {
            recordUrl = this.LANG_URL + "/scoreServlet"
        }
        console.log("filePath " + recordFile)
        console.log("servlet url " + recordUrl)

        let ft: FileTransferObject = this.transfer.create();
        return ft.upload(recordFile, encodeURI(recordUrl), options, true)
            //return this.httpNative.post(recordUrl, recordFile,{headers: this.contentHeader})
            .then((data) => {
                console.log("status " + data.response);
                console.log("data " + data.responseCode); // data received by server
                return JSON.parse(data.response)
            })
            .catch(error => {
                console.log("Record Score Error " + error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
            });
        //recordFile="file:///storage/emulated/0/Android/data/edu.dliflc.netProFlite/files/CM/bestAudio/1453/regular_1419377749679_by_99.wav"
        // return this.http.post(recordUrl, recordFile, { headers: contentHeaders })
        //     .map((res) =>{

        //         console.log("status " + res.status)
        //         console.log("headers " + res.json().score)
        //           return res.json()})
    }


    load(query) {

        console.log("query url " + query.url)
        //for testing
        if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
            let siteName = query.url.split("https://np.ll.mit.edu/", 2)
            // to accomodate the Mandarin for CM
            console.log("sitename " + siteName[1])
            //for testing
            // return this.http.get("/" + siteName[1] + this.SCORE_SERVLET, { headers: this.contentHeader })
            //     .map((res) => {
            //         console.log("query name " + query.name)
            //         this.parseItemsFromDB(query.name, res.json())
            //     })

        } else {
            // return this.http.get(query.url + this.SCORE_SERVLET, { headers: this.contentHeader })
            //     .map((res) => {
            //         this.db.get("latestSiteName").then((siteName) => {
            //             this.parseItemsFromDB(query.name, res.json())
            //         })
            //     })


            // for deployment
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(query.url + this.SCORE_SERVLET, {}, { "Content-Type": "application/json" })
                .then((data) => {
                    //return string JSON 
                    this.parseItemsFromDB(query.name, JSON.parse(data.data))
                    //   return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Items upload error " + error.status);
                    console.log(error.error); // error message as string
                    console.log(error.headers);
                });
        }
    }



    parseItemsFromDB(siteName, content) {
        this.items = []
        this.lesson = []
        this.sublesson = []
        if (content.content[0].children.length == 0) {
            // 1 level heirarchy 
            console.log("Items upload  " + content);

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
                    tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + item.fl + " " + item.en + " " + item.ct
                    //for scores and history, needs to add manually otherwise it will not show up later although it is already initialized. 
                    // make sense you dont need to add what you dont need
                    tmpItem.s = "0"
                    tmpItem.h = []
                    tmpItem.scores = []
                    this.items.push(tmpItem)
                    count++
                }
                this.lesson.push({ type: lesson, name: lessonId, count: count })
            }
        } else {
            // 2 level hierarchy 
            for (let children of content.content) {
                let lesson = children.type
                let lessonId = children.name
                let lessonTotal = 0

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
                        //let ct= this.parseWords(siteName,item.ct)
                        //let fl= this.parseWords(siteName,item.fl)
                        tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + sublesson + " " + sublessonId + " " + item.fl + " " + item.en + " " + item.ct
                        // tmpItem.searchTopic= lesson +" " + sublesson + " " + item.ct + " " + item.fl + " " + item.en
                        //for scores and history, needs to add manually otherwise it will not show up later although it is already initialized. 
                        // make sense you dont need to add what you dont need
                        tmpItem.s = "0"
                        tmpItem.h = []
                        tmpItem.scores = []

                        this.items.push(tmpItem)
                        count++
                    }
                    this.sublesson.push({ type: sublesson, name: sublessonId, count: count, lesson: { type: lesson, name: lessonId } })
                    lessonTotal++
                }
                this.lesson.push({ type: lesson, name: lessonId, count: lessonTotal })
            }
            this.sublesson = this.sublesson.sort(function (a, b) {
                return parseFloat(a.name) - parseFloat(b.name);
            })
        }

        this.items = this.items.sort(function (a, b) {
            return a.fl.localeCompare(b.fl)
        })

        // this.searchTerm =this.lesson[0].type + " " + this.lesson[0].name
        this.lesson = this.lesson.sort(function (a, b) {
            return parseFloat(a.name) - parseFloat(b.name);
        })
        this.db.set(siteName, this.items)
        this.db.set(siteName + "lesson", this.lesson)
        this.db.set(siteName + "sublesson", this.sublesson)

        console.log(" populate items " + this.items.length)

    }


    //not used currently
    parseWords(siteName,words:string){
    var wordList="";
    if (siteName == "Mandarin" || siteName == "Korean") {
        words.split('').forEach((word) =>{
            wordList = wordList + word + "  "
        })
      //  console.log(" ct " + wordList)
        // } else if (site == "MSA" || site == "Egyptian" || site == "Levantine" || site == "Pashto1" || site == "Pashto2" || site == "Pashto3"
        //   || site == "Dari" || site == "Farsi" || site == "Urdu" || site == "Iraqi" || site == "Sudanese") {
        //   wordsRightOrder = this.randomizeAnswers(item.ct.split(','))
    }else if (siteName == "Japanese"){
        words.split('').forEach((word) =>{
            wordList = wordList + word + "  "
        })
   //     console.log(" fl " + wordList)
    } else {
       
        wordList = words
        console.log(" flct " + wordList)
    }
    return wordList
    }
}

