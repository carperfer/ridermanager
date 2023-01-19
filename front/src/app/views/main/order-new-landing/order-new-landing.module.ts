import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TabMenuModule } from "primeng/tabmenu";
import { OrderNewLandingRoutingModule } from "./order-new-landing-routing.module";
import { OrderNewLandingComponent } from "./order-new-landing.component";

@NgModule({
    declarations: [OrderNewLandingComponent],
    imports: [
        CommonModule,
        OrderNewLandingRoutingModule,
        TabMenuModule
    ],
})
export class OrderNewLandingModule { }
