import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { ItemService } from '../Services/item.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class Tab2Page {
  itemForm: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['Other', Validators.required],
    });
  }

  async onSubmit() {
    if (this.itemForm.invalid) {
      this.showToast('Please fill out all required fields.');
      return;
    }

    if (!this.authService.getCurrentUser()) {
      this.showToast('Please log in to list an item.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Listing item...',
    });
    await loading.present();

    let location = null;
    try {
      location = await this.itemService.getCurrentLocation();
    } catch (geoErr) {
      console.warn('Geolocation error:', geoErr);
      this.showToast('Could not get your location. Listing item without location.');
      // Continue with location as null
    }

    try {
      const newItem = {
        title: this.itemForm.value.title,
        description: this.itemForm.value.description,
        category: this.itemForm.value.category,
        location: location, // will be null if not available
        userId: this.authService.getCurrentUser()!.uid,
        createdAt: new Date().toISOString(),
      };

      await this.itemService.addItem(newItem);
      this.itemForm.reset({ category: 'Other' });
      this.showToast('Item listed successfully!');
    } catch (err) {
      console.error(err);
      this.showToast('Error listing item. Please try again.');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
