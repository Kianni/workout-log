import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { TrainingComponent } from "./training.component";
import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingComponent } from "./past-training/past-training.component";
import { StopTraningComponent } from "./current-training/stop-training.component";

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        StopTraningComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        AngularFirestoreModule,
    ],
    entryComponents: [StopTraningComponent]
})
export class TrainingModule { }