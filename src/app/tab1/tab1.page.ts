import { Component, OnInit } from '@angular/core';
import { ItemService } from '../Services/item.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonIcon, IonText, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonIcon,
    IonText,
    IonRefresher,
    IonRefresherContent
  ],
})
export class Tab1Page implements OnInit {

  items: any[] = [];
  userLocation: { lat: number, lng: number } | null = null;

  constructor(private itemService: ItemService) {}

  async ngOnInit() {
    // Step 1: Get user location
    this.userLocation = await this.itemService.getCurrentLocation();

    // Step 2: Fetch all items
    this.itemService.getAllItems().subscribe((data: any[]) => {
      // Step 3: Add distance to each item
      this.items = data.map(item => {
        // Use item.location.lat/lng if available
        const lat = item.location?.lat;
        const lng = item.location?.lng;
        let distance = null;
        if (lat != null && lng != null && this.userLocation) {
          distance = this.itemService.calculateDistance(
            this.userLocation.lat,
            this.userLocation.lng,
            lat,
            lng
          );
        }
        return { ...item, distance: distance ? distance.toFixed(2) : 'N/A' };
      });

      // Step 4: Sort by nearest first (if distance is available)
      this.items.sort((a, b) => {
        if (a.distance === 'N/A') return 1;
        if (b.distance === 'N/A') return -1;
        return a.distance - b.distance;
      });
    });
  }
}
