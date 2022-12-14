import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject, Subscription } from "rxjs";
import { Exercise } from "./exercise.model";
import { map, take } from 'rxjs/operators';
import { UIService } from "../shared/ui.service";
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';



@Injectable()
export class TrainingService {
    private availableExercises: Exercise[] = [];
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
                        this.store.dispatch(new UI.StopLoading());
                        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                    }, error => {
                        this.store.dispatch(new UI.StopLoading());
                        this.uiService.showSnackbar('Fetching exercise failed, please try again later!', null, 3000);
                    }
                )
        )

    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            })
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
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