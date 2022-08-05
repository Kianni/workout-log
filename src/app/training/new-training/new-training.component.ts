import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  availableExercises: Exercise[];
  selected;
  selectTrainingControl = new FormControl('', Validators.required);
  exerciseSubscription: Subscription;
  isLoading = true;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.isLoading = false;
      this.availableExercises = exercises;
    });
    this.trainingService.fetchExercises();

  }

  onStartTraining(ex: any) {
    // console.log(ex);
    this.trainingService.startExercise(ex);
  }
  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
