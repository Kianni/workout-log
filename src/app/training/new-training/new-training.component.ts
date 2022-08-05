import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Observable<any>;
  selected;
  selectTrainingControl = new FormControl('', Validators.required)

  constructor(private trainingService: TrainingService,
    private db: AngularFirestore) { }

  ngOnInit(): void {
    // this.availableExercises = this.trainingService.getExercises();
    this.availableExercises = this.db.collection('availableExercises').valueChanges();
  }

  onStartTraining(ex: any) {
    // console.log(ex);
    this.trainingService.startExercise(ex);
  }

}
