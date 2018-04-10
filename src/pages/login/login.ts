import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Angular2TokenService} from 'angular2-token';
import { routes } from '../../config/routes';
import { ROOT } from '../../config/routes';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: FormGroup;
  currentTab: any;
  user: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fb: FormBuilder,
    public loading: LoadingController,
    public userProvider: UserProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    public menuCtrl: MenuController,
    public events: Events,
    private _tokenService: Angular2TokenService
  ){
    this._tokenService.init({apiBase: ROOT});
    console.log(ROOT)
    this.menuCtrl.enable(false); 
    
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    

    this.currentTab = this.navParams.get("data");

    this.events.subscribe("userLogin", (user) => {
      this.user = user;
      console.log("events in login", this.user);
      this.navCtrl.setRoot(this.currentTab);
    });      
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage a:', this.currentTab);
  }

  goToSignIn(){
    this.navCtrl.push("RegisterUserPage");
  }  

  removeSpaces(email){
    let strParse = new String(email.value);
    let campo = strParse.trim();
    email.value = campo;
    console.log(campo);
  }  

  login(){
    let loading = this.loading.create({ content: 'Cargando...' });
    loading.present();

    //this.errors=[];
    //this.loading=true;
    //this.userService.user = this.user;
    this._tokenService.signIn({
      email:    this.form.value.email,
      password: this.form.value.password
    }).subscribe(
      data => {
        console.log(data);
        //this.loading=false;
        var token, uid, client;
        token = data['headers'].get('access-token');
        client = data['headers'].get('client');
        uid = data['headers'].get('uid');
        data = JSON.parse(data['_body']);
        this.user = data['data'];
        console.log(this.user)
        let header={
          token:token,
          client:client,
          uid:uid
        }
        //data = JSON.parse(data['_body'])
        console.log(header);
        this.storage.set('headers', header);
        this.storage.set('user', JSON.stringify(this.user));
        //this.storage.set('access-token', token);
        //this.storage.set('client', client);
        //this.storage.set('uid', uid);
        //this.refresh();
        loading.dismiss();
        this.events.publish("userLogin", this.user);
        this.menuCtrl.enable(true);
        this.navCtrl.setRoot(this.currentTab);
      },
      error =>    {
        //this.loading=false;
        //this.errorHttp = true; this.loading=false; console.log(error._body);
        if (error && '_body' in error){
          loading.dismiss();
          error = JSON.parse(error._body);
          error.errors.forEach(element => {
            //this.errors.push(element);
          });
          let toast = this.toastCtrl.create({
            message: "He ocurrido un error, por favor intente luego",
            duration: 3000,
            position: 'top'
          });
          toast.present()
        }
      }
    );

    /*this.userProvider.login({
      email: this.form.value.email,
      clave: this.form.value.password
    }).subscribe((data) => {
      
      loading.dismiss();
      console.log("login", data)
      console.log("login", data['headers'].get('access-token'), data['headers'].get('client'), data['headers'].get('uid'))

      let user = data.body.data;
      let headers = {
        'access-token': data['headers'].get('access-token'),
        'uid': data['headers'].get('uid'),
        'client': data['headers'].get('client')
      }

      this.storage.set("user", JSON.stringify(user)).then((dataUserSave) => {
        // let userJson = JSON.parse(user);
        console.log("headers", headers)

        this.storage.set("headers", headers);
        this.events.publish("userLogin", user);
        this.menuCtrl.enable(true);
        this.navCtrl.setRoot(this.currentTab);
      });      

    },
    err => {
      let toast = this.toastCtrl.create({
        message: "He ocurrido un error, por favor intente luego",
        duration: 3000,
        position: 'top'
      });
      toast.present()

      loading.dismiss();
    });*/
  }

}
