import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { NewPasswordRoutingModule } from "./new-password-routing.module";
import { NewPasswordComponent } from "./new-password.component";


@NgModule({
    declarations: [NewPasswordComponent],
    imports: [
        CommonModule,
        NewPasswordRoutingModule,
        ButtonModule,
        InputTextModule,
        TranslateModule,
        ReactiveFormsModule,
    ]
})
export class NewPasswordModule { }