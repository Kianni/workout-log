import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject, Subscription } from "rxjs";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { UIService } from "../shared/ui.service";
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
import { FormControlOptions } from "@angular/forms";



@Injectable()
export class TrainingService {
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    selectionMade = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>) { }

    fetchAvailableExercises() {

        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(
            this.db
                .collection('availableExercises')
                .snapshotChanges()
                .pipe(
                    map(docArray => {
                        // throw (new Error());
                        return docArray.map(doc => {
                            const data: any = doc.payload.doc.data();
                            return {
                                id: doc.payload.doc.id,
                                ...data
                            };
                        });
                    })
                ).subscribe(
                    (exercises: Exercise[]) => {
                        // this.uiService.loadingStateChanged.next(false);
                        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                        this.exercisesChanged.next([...this.availableExercises]);
                    }, error => {
                        // this.uiService.loadingStateChanged.next(false);
                        this.store.dispatch(new UI.StopLoading());
                        this.uiService.showSnackbar('Fetching exercise failed, please try again later!', null, 3000);
                        this.exercisesChanged.next(null);
                    }
                )
        )

    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        })
        this.store.dispatch(new Training.StopTraining());
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            })
        )

    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}