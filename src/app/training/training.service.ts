import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subject, Subscription } from "rxjs";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { UIService } from "../shared/ui.service";


@Injectable()
export class TrainingService {
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    selectionMade = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) { }

    fetchExercises() {
        // return [...this.availableExercises];
        // return this.availableExercises.slice();
        this.uiService.loadingStateChanged.next(true);
        this.fbSubs.push(
            this.db
                .collection('availableExercises')
                .snapshotChanges()
                .pipe(
                    map(docArray => {
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
                        this.uiService.loadingStateChanged.next(false);
                        this.availableExercises = exercises;
                        this.exercisesChanged.next([...this.availableExercises]);
                    }
                )
        )

    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() });
        const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.runningExercise = selectedExercise;
        // console.log(this.runningExercise)
        this.selectionMade.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        })
        this.runningExercise = null;
        this.selectionMade.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.selectionMade.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
                // this.finishedExercises = exercises;
                this.finishedExercisesChanged.next(exercises);
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