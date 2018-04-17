// import { Http,Headers, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import * as _ from 'lodash';
// //import * as requires from 'requires'
// import jwt from 'jsonwebtoken';

// //this require is used only for testing jsonwebtoken
// //declare var require:any;
// // var jwt = require('jsonwebtoken')
// import {JwtHelper, tokenNotExpired} from 'angular2-jwt'; 
//  var SITES_URL:string ="https://np.ll.mit.edu/sites.json";
// let jwtHelper: JwtHelper = new JwtHelper();
// export let FakeBackendProvider = {
//     // use fake backend in place of Http service for backend-less development
   
//     provide: Http,
//     useFactory: (backend, options) => {
//         // configure fake backend
//         backend.connections.subscribe((connection: MockConnection) => {
//             let testUser = { username: 'test2', password: 'test2', firstName: 'Test', lastName: 'User' };
        
//             // wrap in timeout to simulate server api call
//             setTimeout(() => {
                
//                 // fake authenticate api end point
//                 if (connection.request.url.endsWith('/sessions/create') && connection.request.method === RequestMethod.Post) {
//                     // get parameters from post request
//                     let params = JSON.parse(connection.request.getBody());
                    
//                     // check user credentials and return fake jwt token if valid
//                     if (params.username === testUser.username && params.password === testUser.password) {
//                         connection.mockRespond(new Response(
//                              //new ResponseOptions({ status: 200, body: { id_token: 'fake-jwt-token.token'  ,username:testUser.username}})
                           
//                            new ResponseOptions({ status: 200, body: { id_token: jwt.sign(_.omit(testUser.username, 'password'), "My secret",{expiresIn:"60s"}),username:testUser.username} })
                          
//                         ));
//                     } else {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200 })
//                         ));
//                     }
//                 }
 
//                 // fake users api end point
//                 if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
//                     // check for fake auth token in header and return test users if valid, this security is implemented server side
//                     // in a real application
//                     if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 200, body: [testUser] })
//                         ));
//                     } else {
//                         // return 401 not authorised if token is null or invalid
//                         connection.mockRespond(new Response(
//                             new ResponseOptions({ status: 401 })
//                         ));
//                     }
//                 }
//                 // fake users api end point
//                 if (connection.request.url.endsWith('/sites.json') && connection.request.method === RequestMethod.Get) {
//                     // check for fake auth token in header and return test users if valid, this security is implemented server side
//                     // in a real application
//                     let strSites={"sites":[{name:'Dari',type:'npf',language:'Dari',rtl:true,purpose:'Production',url:'https://np.ll.mit.edu/npfClassroomDari',
//                     showOnIOS:true,appVersion:'1.2.0',modelVersion:'',vocabUpdateDate:'',hasModel:true,notes:''},
//                     {name:'Egyptian',type:'npf',language:'Egyptian',rtl:true,purpose:'Production',url:'https://np.ll.mit.edu/npfClassroomEgyptian',
//                     showOnIOS:true,appVersion:'1.2.0',modelVersion:'',vocabUpdateDate:'',hasModel:true,notes:''},
//                     {"name":"Tagalog","type":"npf","language":"Tagalog","rtl":false,"purpose":"Production","url":"https://np.ll.mit.edu/npfClassroomTagalog",
//                     "showOnIOS":true,"appVersion":"1.2.0","modelVersion":"","vocabUpdateDate":"","hasModel":true,"notes":""},
//                     {"name":"English","type":"npf","language":"English","rtl":false,"purpose":"Production","url":"https://np.ll.mit.edu/npfClassroomEnglish",
//                     "showOnIOS":true,"appVersion":"1.2.0","modelVersion":"","vocabUpdateDate":"","hasModel":true,"notes":""},
//                     ]}
//                     connection.mockRespond(new Response(
//                        new ResponseOptions({ status: 200 ,body: [strSites] })
//                     ));
//                 } 
//             }, 500);
 
//         });
        
//         return new Http(backend, options);
//     },
//     deps: [MockBackend, BaseRequestOptions]

    
// };
