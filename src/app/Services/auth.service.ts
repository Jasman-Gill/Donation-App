import { Injectable, NgZone } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private auth: Auth, private ngZone: NgZone) { }

    signup(email: string, password: string) {
        return this.ngZone.run(() => createUserWithEmailAndPassword(this.auth, email, password));
    }

    login(email: string, password: string) {
        return this.ngZone.run(() => signInWithEmailAndPassword(this.auth, email, password));
    }

    logout() {
        return this.ngZone.run(() => signOut(this.auth));
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }
}
