import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import * as fromApp from "../app.reducer"


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private snackbar: MatSnackBar,
        private uiservice: UIService,
        private store: Store<{ ui: fromApp.State }>
    ) { }


    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training'])
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigate(['/login'])
            }
        });
    }

    registerUser(authData: AuthData) {
        // this.uiservice.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
            .catch(error => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
                this.uiservice.showSnackbar(error.message, null, 3000);
            });

    }

    login(authData: AuthData) {
        // this.uiservice.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
            .catch(error => {
                // this.uiservice.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
                this.uiservice.showSnackbar(error.message, null, 3000);
            });
    }

    logout() {
        this.afAuth.auth.signOut();

    }

    isAuth() {
        return this.isAuthenticated;
    }
}