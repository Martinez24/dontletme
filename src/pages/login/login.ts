import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { TabsPage } from "../../pages/tabs/tabs";

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { AdminLoginPage } from "../../pages/admin-login/admin-login";
import { AdminHomePage } from "../../pages/admin-home/admin-home";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  pageLogin="admin-login";
  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              public usuarioProv: UsuarioProvider,
              private fb: Facebook,
              private googlePlus: GooglePlus,
              private platform: Platform) {
  }

  signInGoogle()  {
    this.googlePlus.login({
    'webClientId': '853477386824-kt4bl5ccfs8hgfm255i3384fhb6e50jq.apps.googleusercontent.com',
    'offline': true
  }).then( res => {
    firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( user => {
            console.log(JSON.stringify(user));
            this.usuarioProv.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'google'
            );
            this.navCtrl.setRoot(TabsPage);
          })
          .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
        }).catch(err => console.error("Error: ", err));
    }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
       this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
        .then(user => {

          console.log(res);
          this.usuarioProv.cargarUsuario(
            user.displayName,
            user.email,
            user.photoURL,
            user.uid,
            'facebook'
          );
          this.navCtrl.setRoot(TabsPage);

        }).catch(e => console.log('Error de autenticación' + JSON.stringify(e)));
      })
    }else{
      //Escritorio
      this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {

        console.log(res);
        let user = res.user;

        this.usuarioProv.cargarUsuario(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          'facebook'
        );
        this.navCtrl.setRoot(TabsPage);
      });
    }
  }
  goLogin() {
    this.navCtrl.push(AdminLoginPage);
    }

}
