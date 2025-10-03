import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton,
    FormsModule
  ]
})
export class SignupPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async signup() {
    try {
      await this.authService.signup(this.email, this.password);
      const alert = await this.alertCtrl.create({
        header: 'Account Created',
        message: 'Your account has been created successfully!',
        buttons: [
          {
            text: 'Login',
            handler: () => {
              this.router.navigateByUrl('/login');
            }
          }
        ]
      });
      await alert.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: (error as any).message,
        duration: 2000
      });
      toast.present();
    }
  }
}
