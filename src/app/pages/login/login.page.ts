import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonContent, IonItem, IonLabel, IonInput, IonButton,
    FormsModule
  ]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigateByUrl('/tabs/tab1');
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: (error as any).message,
        duration: 2000
      });
      toast.present();
    }
  }

    goToSignup() {
      this.router.navigateByUrl('/signup');
    }
}
