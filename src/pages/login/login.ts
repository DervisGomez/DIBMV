import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { Angular2TokenService} from 'angular2-token';
import { ROOT } from '../../config/routes';
import { TabsPage } from '../tabs/tabs';



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
      email: ['', Validators.compose([
          Validators.required,
          Validators.email,
      ])],
      password: ['', Validators.required]
    });    

    //this.currentTab = this.navParams.get("data");

    this.events.subscribe("userLogin", (user) => {
      this.user = user;
      console.log("events in login", this.user);
      //this.navCtrl.setRoot(this.currentTab);
    });      
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage a:');
  }

  removeSpaces(email){
    let strParse = new String(email.value);
    let campo = strParse.trim();
    email.value = campo;
    console.log(campo)
  }  

  login(){
    if (this.form.controls.email.errors||this.form.value.email=="") {
      this.messages("Correo invalido");
      return
    }
    if (this.form.controls.password.errors||this.form.value.password=="") {
      this.messages("Contraseña invalida");
      return
    }
    this.navCtrl.setRoot(TabsPage);
    //let loading = this.loading.create({ content: 'Cargando...' });
    //loading.present();

  }

  messages(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present()
  }

}
