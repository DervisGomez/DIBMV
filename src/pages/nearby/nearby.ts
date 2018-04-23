import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps';
import { icons, sucursales } from '../../config/marks/icons'
/**
 * Generated class for the NearbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var google;
 let infowindow: any;

@IonicPage()
@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  lat: any=0;
  lng: any=0;
  checked: boolean = true;
  filter={
    show:false,
    icon:"funnel"
  }

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public toastCtrl: ToastController,
  	public platform: Platform,
  	public geo: Geolocation) {

  	platform.ready().then(() => {
    
	  });
  }

  ionViewDidLoad() {  	//this.loadMap();
  	this.miPosition();
    console.log('ionViewDidLoad NearbyPage');
    
  }

  showFilter(){
    console.log("checked", this.checked)
    this.filter.show=!this.filter.show;
    if (this.filter.show) {
      this.filter.icon="close"
    }else{
      this.filter.icon="funnel"
    }
  }

  miPosition(){
    this.geo.getCurrentPosition().then( pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.initMap(18);
        //this.initMap(pos);            
      }).catch( err => {
        this.initMap(18);
        this.message("GPS no activado")
      });
  }

initMap(ps) {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: ps,
      center: {lat: this.lat, lng: this.lng}
    });

    this.directionsDisplay.setMap(this.map);
    this.createMarkerUser();
   /*  this.createmarkers(); */
    infowindow = new google.maps.InfoWindow();
    var prueba=this;
    this.map.addListener('click', e => {
      var coor=e.latLng+"";
      coor=coor.substring(1, coor.length-1)
      var lat=coor.split(", ",2)
      console.log("coordenadas: "+e.latLng);
      console.log("coordenadas: "+coor);
      console.log(+lat[0]);
      console.log(+lat[1]);
      prueba.lat=+lat[0];
      prueba.lng=+lat[1];
      this.createMarker();
    });
  } 

  public newMap(){
    console.log("hola")
  } 
  createMarker() {
    if(this.lat==0&&this.lng==0){
      //this.message("No se pudo establecer la ubicacion");
    }else{

      var place = {lat: this.lat, lng: this.lng};
      var marker = new google.maps.Marker({
        map: this.map,
        position: place,
        icon: icons.emerald.icon,  
       
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("hola mundo");
        infowindow.open(this.map, this);
      });
    
    }
	  
	}
  createMarkerUser() {
    if(this.lat==0&&this.lng==0){
      //this.message("No se pudo establecer la ubicacion");
    }else{

      var place = {lat: this.lat, lng: this.lng};
      var marker = new google.maps.Marker({
        map: this.map,
        position: place,
        icon: icons.kenny.icon, 
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("hola mundo");
        infowindow.open(this.map, this);
      });
    
    }
	  
	}

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  createmarkers(){
    console.log("inicia marcas")
    sucursales.forEach( (sucursal) => {
      var marker = new google.maps.Marker({
        position: sucursal.position,
        icon: icons[sucursal.type].icon,
        map: this.map
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(sucursal.description);
        infowindow.open(this.map, this);
      });
    });
 
  }

  message(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present()
  }

  loadMap(){
  let mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: 43.0741904, // default location
        lng: -89.3809802 // default location
      },
      zoom: 18,
      tilt: 30
    }
  };
  this.message("ok2: ");
  this.map = GoogleMaps.create('map', mapOptions);
  this.message("ok3: ");
  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY)
  .then(() => {
    // Now you can use all methods safely.
    this.getPosition();
    this.message("bien");
  })
  .catch(error =>{
  	this.message(error);
    console.log(error);
  });
  this.message("ok4: ");

}

 getPosition(): void{
    this.map.getMyLocation()
    .then(response => {
      this.map.moveCamera({
        target: response.latLng
      });
      this.map.addMarker({
        title: 'My Position',
        icon: 'blue',
        animation: 'DROP',
        position: response.latLng
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }

}
