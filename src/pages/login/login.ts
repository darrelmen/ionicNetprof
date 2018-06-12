import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { NavController, ActionSheetController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
//import {LanguageService} from '../../providers/language-service/language-service'
import { CommonUtils } from '../../utils/common-utils'
import { Storage } from '@ionic/storage';
import { MenuItemsPage} from '../../pages/menuitems/menuitems';
import { Sites} from '../../model/sites'
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
//import { EmailComposer } from '@ionic-native/email-composer';



@Component({
  templateUrl: 'login.html',
})


export class LoginPage implements OnInit {
  authType: string = 'login';
  // to get the '#usr' tag in the login html
  @ViewChild('user') user;
  sites: any;
  url: string
  selected_site: any = 'site'
  // signform: any;
  constructor(public auth: AuthService,
    // public language: LanguageService,
    public nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public renderer: Renderer,
    public utils: CommonUtils,
    public db: Storage,
    public platform: Platform
   // public emailComposer: EmailComposer
  ) {
    this.platform.ready().then(() => { this.db })
    this.theme=localStorage.getItem("theme")  
    
  }
  theme:string

  //logform:any
  public logform = new FormGroup({
    'username': new FormControl('', Validators.required), //| Validators.pattern('[a-zA-Z0-9]')),
    // 'url': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
    'site': new FormControl('', Validators.required)
  });
  // this.logform = new FormGroup({
  //   'username': new FormControl('', Validators.pattern('[a-zA-Z0-9]+')),
  //   // 'url': new FormControl('', Validators.required),
  //   'password': new FormControl('', Validators.required),
  //   'selectedSite': new FormControl(this.selected_site, Validators.required)

  // });
  status = "student"

  public signform = new FormGroup({
    'username': new FormControl('', Validators.minLength(4)),
    'email': new FormControl('', Validators.email),
    'pass': new FormControl('', Validators.minLength(4)),
    'status': new FormControl('', Validators.required)
  });

  // initialization load on startup
  ngOnInit() {
    //this.platform.ready().then(()=>{
    // this.auth.getSitesNative() 
    // } )

    this.platform.ready().then(() => {
      this.db.ready().then(() => {

        //preselected site
        this.db.get('latestSiteName')
          .then((val) => {
            this.selected_site = val
            //this.logform.value.selectedSite=this.selected_site
            console.log('selected Site: ', this.selected_site)

          })

        this.db.get('sites')
          .then((val) => {
            if (val == null || val == "") {
            
              this.auth.getSites()
                //.subscribe(result => {
                 //for deployment
                 .then(result => {
                  console.log(" sites upload ")
                  // for mock
                  // this.sites=result[0].sites
                  this.sites = result.sites
                  this.sites = this.sites.sort(function (a, b) {
                    return a.language.localeCompare(b.language)
                  })
                  this.db.set('sites', JSON.stringify(this.sites))

                });

              //this.httpNative.enableSSLPinning(true) 

            } else {
             
              this.sites = JSON.parse(val)
              this.sites = this.sites.sort(function (a, b) {
                return a.language.localeCompare(b.language)
              })
            }
          })
      })
    })
  }

  //fires after ngOnInit, can put any code in here
  ngAfterViewInit() {

  }

  showForgotUserPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Get Username',
      message: "Enter your Email address to get your Username.",
      inputs: [
        {
          name: 'Email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Send Username',
          handler: data => {
            console.log('to send email Saved clicked');
           // this.auth.forgotUserName(data).subscribe((isValid:any) => {
               //for deployment
               this.auth.forgotUserName(data).then((isValid:any) => {
           
              if (isValid.valid) {
                this.utils.presentToast('Please check your email for your Username.', 2000)
              } else {
                this.utils.presentToast('Please enter a valid email address.', 2000)

              }
            })
          }
        }, {
          text: 'Cancel',
          handler: data => {
            console.log('cancel clicked');
          }
        }

      ]
    });
    prompt.present();
  }

  showForgotPassPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Reset Password',
      message: "Enter your Username and Email to reset your password.",
      inputs: [
        {
          name: 'Username',
          placeholder: this.logform.value.username,
          value: this.logform.value.username
        },
        {
          name: 'Email',
          placeholder: 'Email'
        },
      ],

      buttons: [

        {
          text: 'Send Reset Password',
          handler: data => {
            //this.auth.forgotPassword(data).subscribe((isValid:any) => {
            //for deployment 
            this.auth.forgotPassword(data).then((isValid:any) => {
           
              if (isValid.token == "PASSWORD_EMAIL_SENT") {
                this.utils.presentToast('Please check your email to reset Password.', 2000)
              } else {
                this.utils.presentToast('Please enter valid username/email address.', 2000)
              }       
            })
          }
        }, {
          text: 'Cancel',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }
  
  // currently not used
  statusActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select your Status',
      buttons: [
        {
          text: 'Student',
          handler: () => {
            console.log('student clicked');
          }
        },
        {
          text: 'Teacher',
          handler: () => {
            console.log('teacher clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
 
  login() {
    this.auth.loginMD5(this.logform.value)

      // this.auth.loginObs(this.logform.value)
      // .subscribe(result => {
      // for deployment  
      .then(result => {
        if (result === true) {

          this.url = this.logform.value.site.language
          //let siteName=this.url.split("https://np.ll.mit.edu/npfClassroom",2)
          this.db.get(this.logform.value.site.language)
            .then((val) => {
              // this.auth.authenticated(true)
              if (val == null) {
                this.getOnlineContents()
              } else {
                //this.language.writeLocal('loginValues',this.logform.value);
                this.platform.ready().then(() => {
                  this.db.set("rtl", this.logform.value.site.rtl)
                  //this.db.set('url', this.logform.value.site.url)
                  this.db.set("url", "https://netprof.ll.mit.edu/netprof")
                  this.db.set('username', this.logform.value.username);
                  this.db.set("latestSite", this.logform.value.site)
                  this.db.set("latestSiteName", this.logform.value.site.language)
                  console.log("rtl " + this.logform.value.site.rtl)
                  localStorage.setItem("cc",this.logform.value.site.countrycode)
                })

                this.nav.push(MenuItemsPage)
              }
            })
        } else {
          // login failed
          this.utils.showInvalidUserPassword();
          console.log('failed login' + result)
        }
      }
        , (err) => {
          // user connection is down
          console.log('failed error=0 still allow to access')
          if (err.status == 0) {

            this.url = this.logform.value.site.language
            //let siteName=this.url.split("https://np.ll.mit.edu/npfClassroom",2)
            this.db.get(this.logform.value.site.language)
              .then((val) => {
                // this.auth.authenticated(true)
                if (val == null) {
                  this.getOnlineContents()
                } else {
                  //this.language.writeLocal('loginValues',this.logform.value);
                  this.platform.ready().then(() => {
                    this.db.set("rtl", this.logform.value.site.rtl)
                   // this.db.set('url', this.logform.value.site.url)
                   this.db.set("url", "https://netprof.ll.mit.edu/netprof")
                    this.db.set('username', this.logform.value.username);
                    this.db.set("latestSite", this.logform.value.site)
                    this.db.set("latestSiteName", this.logform.value.site.language)
                    localStorage.setItem("cc",this.logform.value.site.countrycode)
                  })
                  this.nav.push(MenuItemsPage)
                }

              })
          } else {
            this.utils.showInvalidUserPassword(err);
          }
        })
  };




  getOnlineContents() {
    let loading = this.loadingCtrl.create({
      content: 'Loading items for the first time... Please wait...'
    });
    // var siteUrl :any
    loading.present();
    // this.url = this.logform.value.url
    //   let siteName=this.url.split("https://np.ll.mit.edu/",2)
   //this.auth.load(this.logform.value.site).subscribe(
   //for deployment 
   this.auth.load(this.logform.value.site).then(

      // using proxy  
      //this.language.load(siteName[1]).subscribe(
      () => {
        //this.utils.presentLoadingDefault()
        //this.storage.set("offlineData",res.content)
        //store in local variable cache like a cookie or session
        // let url = this.logform.value.url
        // let siteName=url.split("https://np.ll.mit.edu/npfClassroom",2)
        this.platform.ready().then(() => {
          //this.db.set(this.logform.value.site.name, JSON.stringify(res.content))
          this.db.set("latestSite", this.logform.value.site)
          this.db.set("latestSiteName", this.logform.value.site.language)
          //this.db.set('url', this.logform.value.site.url).then(() => console.log("set Url"))
          this.db.set("url", "https://netprof.ll.mit.edu/netprof")
          this.db.set('username', this.logform.value.username);
          this.db.set("rtl", this.logform.value.site.rtl)
          localStorage.setItem("cc",this.logform.value.site.countrycode)
        })
        //this.language.writeLocal('loginValues',this.logform.value);
        // navigate to the next page with parameters

        //this.nav.push(MenuPage, {
        //   'logVals': this.logform.value,'contents':res.content})
        loading.dismiss();
        this.nav.push(MenuItemsPage)

      },
      (err) => {
        console.log("login err " + err);
      }
    );

  }


  signup() { 
    // this.auth.signup(this.signform.value).subscribe(
    //   (success) => {
    //    this.utils.showAlert(this.signform.value.username, "Welcome ", "You have successfully created a NetProf account")
    //     // this.user.vaue = ''
    //     this.logform.value.username=this.signform.value.username
    //     this.logform.value.password=this.signform.value.pass
    //     this.authType = 'login';
    //   },
    //   (err) => 
    //   this.utils.showAlert(this.signform.value.username, "Invalid username/email. Please try again.")

    // );
  }


  // not in use for creating an email
  // sendEmail(data) {

  //   this.emailComposer.isAvailable().then((available: boolean) => {
  //     if (available) {
  //       //Now we know we can send

  //       let email = {
  //         to: data.Email,
  //         subject: 'Test Sent outs',
  //         body: 'How are you? Nice greetings from DLIFLC.',
  //         isHtml: true
  //       };

  //       // Send a text message using default options
  //       this.emailComposer.open(email);
  //     }
  //   });
  // }

}
