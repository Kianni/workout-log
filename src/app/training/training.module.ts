import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { TrainingComponent } from "./training.component";
import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingComponent } from "./past-training/past-training.component";
import { StopTraningComponent } from "./current-training/stop-training.component";
import { TrainingRoutingModule } from "./training-routing.module";

import { StoreModule } from "@ngrx/store";
import { trainingReducer } from "./training.reducer";

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        StopTraningComponent
    ],
    imports: [
        SharedModule,
        TrainingRoutingModule,
        StoreModule.forFeature('training', trainingReducer)
    ],
    entryComponents: [StopTraningComponent]
})
export class TrainingModule { }