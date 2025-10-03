import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Geolocation } from '@capacitor/geolocation';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private firestore: Firestore, private auth: Auth, private ngZone: NgZone) { }

    // ✅ Fetch all items from Firestore
    getAllItems(): Observable<any[]> {
        const itemsRef = collection(this.firestore, 'items');
        return collectionData(itemsRef, { idField: 'id' }) as Observable<any[]>;
    }

    // ✅ Add new item to Firestore
    async addItem(item: any) {
        const itemsRef = collection(this.firestore, 'items');
        return await addDoc(itemsRef, item);
    }

    // ✅ Get user’s current location
    async getCurrentLocation() {
        const coords = await Geolocation.getCurrentPosition();
        return {
            lat: coords.coords.latitude,
            lng: coords.coords.longitude
        };
    }

    // ✅ Helper: Calculate distance between two lat/lng points (in km)
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    private deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    // ✅ New: Fetch nearby items (within given radius)
    async getNearbyItems(maxDistanceKm: number = 5): Promise<Observable<any[]>> {
        const userLocation = await this.getCurrentLocation();
        const items$ = this.getAllItems();

        return items$.pipe(
            map((items: any[]) => {
                return items.filter(item => {
                    if (item.location && item.location.lat && item.location.lng) {
                        const distance = this.calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            item.location.lat,
                            item.location.lng
                        );
                        // Attach distance to item so we can display it
                        item.distance = distance.toFixed(2);
                        return distance <= maxDistanceKm;
                    }
                    return false;
                });
            })
        );
    }
}
