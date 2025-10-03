
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Tab1Page } from './tab1.page';

@NgModule({
  declarations: [Tab1Page],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [Tab1Page]
})
export class Tab1PageModule {}
