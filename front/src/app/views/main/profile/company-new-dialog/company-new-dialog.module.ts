import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CompanyNewDialogRoutingModule } from "./company-new-dialog-routing.module";
import { CompanyNewDialogComponent } from "./company-new-dialog.component";


@NgModule({
    declarations: [CompanyNewDialogComponent],
    imports: [
        CommonModule,
        CompanyNewDialogRoutingModule,
        InputTextModule,
        ButtonModule,
        TranslateModule,
        ReactiveFormsModule
    ]
})
export class CompanyNewDialogModule { }