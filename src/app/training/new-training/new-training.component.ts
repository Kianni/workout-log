import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  availableExercises: Exercise[] = [];
  selected;
  selectTrainingControl = new FormControl('', Validators.required)

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.availableExercises = this.trainingService.getExercises();
  }

  onStartTraining(ex: any) {
    // console.log(ex);
    this.trainingService.startExercise(ex);
  }

}
