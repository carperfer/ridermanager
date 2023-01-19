import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsRoutingModule } from './views-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './main/menu/menu.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    ViewsRoutingModule,
    TranslateModule,
    ButtonModule,
    SidebarModule,
    AvatarModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule
  ],
  providers: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewsModule { }
