import { Injectable } from '@angular/core';
//import {   RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Platform, normalizeURL } from 'ionic-angular';
import {
    HttpHeaders, HttpClient, HttpParams,
    HttpResponse
} from '@angular/common/http';
//import { RequestOptions , RequestOptionsArgs} from '@angular/common';
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
import { Sites } from '../../model/sites'
import { set as setCookie, get as getCookie } from 'es-cookie';

//import {sign} from 'jsonwebtoken';


@Injectable()
export class AuthService {
    LOGIN_URL: string = "http://10.102.12.199:3001/sessions/create";   //10.0.2.2 same as localhost, used when running emulator 10.102.12.199 --my actual ip
    SIGNUP_URL: string = "/scoreServlet";
    SITES_URL: string = "https://netprof.ll.mit.edu/netprof/scoreServlet?projects" // "https://np.ll.mit.edu/sites.json";
    NET_URL: string = "https://netprof.ll.mit.edu/netprof"
    SCORE_SERVLET: string = "/scoreServlet?nestedChapters";
    RECORD_SERVLET: string = "/scoreServlet";
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

    public jwtHelper: JwtHelper = new JwtHelper();
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

        let header = new HttpHeaders({
            "Content-Type": "application/json",
            "userid": credentials.username, "pass": credentials.password, "projid": credentials.site.id.toString()
        });
        //let testURL = "https://np.ll.mit.edu/npfClassroomPashto1/scoreServlet?hasUser=" + cred.hasUser + "&p=" + hash
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            //  url = "/npfClassroom" + this.SITE_NAME + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash
            url = "/scoreServlet?hasUser=" + credentials.username + "&p=" + credentials.password

        } else {
            // url = credentials.site.url + "/scoreServlet?hasUser=" + credentials.username + "&p=" + hash
            url = this.NET_URL + "/scoreServlet?hasUser=" + credentials.username + "&p=" + credentials.password
        }
        // for testing only web only
        // return this.http.get(url, { headers: header, observe: 'response', withCredentials: true })
        //     .map((res: any) => {
        //         // login successful if there's a jwt token in the response (.id_token is defined in the auth service API - this.LOGIN_URL)
        //         console.log("COOK0 " + window.document.cookie)
        //         // var setCook =getCookie('JSESSIONID')
        //         // console.log( "cook " + setCook)

        //         console.log("session " + res.headers.get("cookie"))
        //         this.user = credentials.username
        //         //         localStorage.setItem("ck", this.httpNative.getCookieString(url))

        //         localStorage.setItem('username', this.user);
        //         localStorage.setItem('userid', res.body.userid);
        //         localStorage.setItem('siteid', credentials.site.id.toString());
        //         this.USER_ID = res.userid
        //         this.SITE_ID = credentials.site.id.toString()
        //         console.log("user id " + res.body.userid)
        //         console.log("pass " + res.body.passwordCorrect)
        //         // let token = res.json().id_token
        //         //  console.log("res " + token)
        //         if (res.body.passwordCorrect === "TRUE") {
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

        // for deployment
        this.httpNative.setDataSerializer('json');
        this.httpNative.acceptAllCerts(true)

        return this.httpNative.get(url, {},
            { "Content-Type": "application/json", "userid": credentials.username, "pass": credentials.password, "projid": credentials.site.id.toString() })
            .then((data) => {
                //return string JSON 
                let res = JSON.parse(data.data)
                this.user = credentials.username
                localStorage.setItem('username', this.user);
                localStorage.setItem('userid', res.userid);
                this.USER_ID = res.userid
                this.SITE_ID = credentials.site.id.toString()
                this.PAS_ID = credentials.password
                console.log("user id " + res.userid)
                console.log("pass " + res.passwordCorrect)
                console.log("cookie  " + this.httpNative.getCookieString(url))
                localStorage.setItem("siteid", credentials.site.id.toString())

                localStorage.setItem("ck", this.httpNative.getCookieString(url))
                // let token = res.json().id_token
                //  console.log("res " + token)
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
        let hashPass = CryptoJS.MD5(data.pass).toString(CryptoJS.enc.Hex);
        let hashEmail = CryptoJS.MD5(data.email.toLowerCase()).toString(CryptoJS.enc.Hex);
        let signUrl: any
        let contentHeader = new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded", "user": data.username, "passwordH": hashPass, "emailH": hashEmail,
            "device": this.device.uuid, "deviceType": this.device.platform, "request": "addUser", "reqid": "1"
        });
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            signUrl = "/scoreServlet"
        } else {
            signUrl = this.NET_URL + "/scoreServlet"
        }
        //for testing
        // return this.http.post(signUrl, {}, { headers: contentHeader })
        //     .map(res => {
        //         //res.json()
        //         res
        //     });

        //for deployment
        this.httpNative.setDataSerializer('json');
        this.httpNative.acceptAllCerts(true)
        return this.httpNative.post(signUrl, {}, { "Content-Type": "application/json" })
            .then((data) => {
                //return string JSON 
                return JSON.parse(data.data)
            })
            .catch(error => {
                console.log("Items upload error " + error);
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
        localStorage.setItem('id_token', token);
        this.user = this.jwtHelper.decodeToken(token).username;
    }


    getSites() {
        // return new Promise((resolve, reject) => {
        this.checkPlatform()
        console.log("sites " + this.SITES_URL)
        // if (this.platform.is("core") || this.platform.is("mobileweb")) {  //|| this.platform.is("android") -- for emulator and livereload
        //for testing   
        // return this.http.get(this.SITES_URL, { headers: this.contentHeader, withCredentials: true })
        //     .map((res: Sites) => res)
        //} else {

        // for deployemnt
        this.httpNative.setDataSerializer('json');
        this.httpNative.acceptAllCerts(true)

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
        this.httpNative.acceptAllCerts(true)
        this.httpNative.setDataSerializer('json');
        return this.httpNative.get(this.NET_URL + this.FORGOT_USER + data.Email.toLowerCase(), {}, { "Content-Type": "application/json" })
            .then((data) => {
                //return string JSON 
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
        this.httpNative.acceptAllCerts(true)
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
        // let header = new HttpHeaders({  "Content-Type": "application/json","projid":query.id.toString()})
        // return this.http.get(url, { headers: header,withCredentials:true})
        //    .map((res) => {
        //         console.log("query name " + query.name)
        //          this.parseItemsFromDB(query.name, res)
        //     })


        // for deployment
        console.log("lang " + query.language + "   new id " + query.id + " current id " + this.SITE_ID + " pass " + this.PAS_ID + " user " + this.USER_ID)
        this.httpNative.setDataSerializer('json');
        this.httpNative.acceptAllCerts(true)
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
        }>
        topic?: Array<{
            type: any
            name: any
            count: number
            subtopic?: Array<{
                type: any
                name: any
                count: number
            }>
        }>
    }> = []


    parseItemsFromDB(siteName, content) {
        this.items = []
        this.lessonMenu = []
        if (content.content[0].children.length == 0) {
            // 1 level heirarchy 

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
                    tmpItem.s = "0"
                    tmpItem.h = []
                    tmpItem.scores = []
                    tmpItem.isRecord = false
                    tmpItem.isScored = false
                    tmpItem.isAddPlaylist = false
                    this.items.push(tmpItem)
                    count++
                }
                this.lessonMenu.push({ type: lesson, name: lessonId, count: count, sublesson: [], topic: [] })
            }
        } else {
            // 2 level hierarchy 
            let lessIdx = 0
            for (let children of content.content) {
                let lesson = children.type
                let lessonId = children.name
                let lessonTotal = 0
                this.lessonMenu.push({ type: lesson, name: lessonId, count: lessonTotal, sublesson: [], topic: [] })
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
                        tmpItem.searchTopic = item.id + " " + lesson + " " + lessonId + " " + sublesson + " " + sublessonId + " " + item.fl + " "
                            + item.en + " " + item.ct + " " + item.tl
                        // tmpItem.searchTopic= lesson +" " + sublesson + " " + item.ct + " " + item.fl + " " + item.en
                        //for scores and history, needs to add manually otherwise it will not show up later although it is already initialized. 
                        // make sense you dont need to add what you dont need
                        tmpItem.s = "0"
                        tmpItem.h = []
                        tmpItem.scores = []
                        tmpItem.isRecord = false
                        tmpItem.isScored = false
                        tmpItem.isAddPlaylist = false
                        this.items.push(tmpItem)
                        count++
                    }
                    this.lessonMenu[lessIdx].sublesson.push({ type: sublesson, name: sublessonId, count: count })
                    lessonTotal++

                }
                this.lessonMenu[lessIdx].count = lessonTotal
                lessIdx++
            }
        }

        this.items = this.items.sort(function (a, b) {
            return a.fl.localeCompare(b.fl)
        })

        this.lessonMenu = this.lessonMenu.sort(function (a, b) {
            return parseFloat(a.name) - parseFloat(b.name);
        })
        this.db.set(siteName, this.items)
        this.db.set(siteName + "menu", this.lessonMenu)
        console.log(" populate items " + this.items.length)
        console.log(" populate items me " + siteName + "menu")
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
            //   return this.http.get(scoreUrl, { headers: this.contentHeader })
            //       .map((res) => res)
        } else {
            scoreUrl = this.NET_URL + "/scoreServlet?request=chapterHistory&user=" + userid + "&" + lesson
            console.log("scoreUrl " + scoreUrl)
            let head = new HttpHeaders({
                "Content-Type": "application/json", "projid": this.SITE_ID
            })
            //for testng
            // return this.http.get(scoreUrl, {headers: head})
            // .map((res) => res)

            //for deployment
            this.httpNative.setDataSerializer('json');
            this.httpNative.acceptAllCerts(true)
            return this.httpNative.get(scoreUrl, {}, { "Content-Type": "application/json", "projid": this.SITE_ID })
                .then((data) => {
                    //return string JSON 
                    return JSON.parse(data.data)
                })
                .catch(error => {
                    console.log("Score upload error " + error);
                });

            //https://np.ll.mit.edu/npfClassroomCM/scoreServlet?request=chapterHistory&user=171&Unit=2&Lesson=8
        }
    }


    postRecording(recordFile: string, ex_id: string, filesize: string, filename) {
        this.USER_ID = localStorage.getItem('userid')
        var recordUrl
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
            //for testing Chinese
            recordUrl = "/scoreServlet"
        } else {
            recordUrl = this.NET_URL + "/scoreServlet"
        }
        console.log("filePath to upload " + recordFile)
        console.log("servlet url " + recordUrl)
        let cookie = localStorage.getItem('ck')
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: filename,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", "user": this.USER_ID, "deviceType": this.device.platform, "device": this.device.uuid
                , "exercise": ex_id, "request": "decode", "reqid": "1", "projid": this.SITE_ID, "cookie": cookie
            },
            mimeType: "audio/x-wav",

        }
        let ft: FileTransferObject = this.transfer.create();

        return ft.upload(recordFile, encodeURI(recordUrl), options, true)
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

        //     this.httpNative.acceptAllCerts(true)
        //     this.httpNative.setDataSerializer('urlencoded');
        //     let recPath= recordFile.substring(0,recordFile.length-filename.length)
        //     console.log(filename + " rec " + recPath + " e " + ex_id+ " s  " + this.SITE_ID + " u " + this.USER_ID) 
        //    return this.file.resolveLocalFilesystemUrl(recordFile).then(fe => {
        //     console.log(" fe " + fe.nativeURL) 

        //         return this.httpNative.uploadFile(recordUrl, {},{"Content-Type": "application/x-www-form-urlencoded",
        //         "user": this.USER_ID, "deviceType": this.device.platform,
        //         "device": this.device.uuid
        //        , "exercise": ex_id.toString(), "request": "decode", "reqid": "1", "projid": this.SITE_ID
        //        },fe.toURL() , "wav")
        //         .then((data) => {
        //             //return string JSON 
        //             console.log("data " + data.data)
        //             return JSON.parse(data.data)
        //         })
        //         .catch(error => {
        //             console.log("Audio upload error " + error);
        //         });
        //     })
    }

}

