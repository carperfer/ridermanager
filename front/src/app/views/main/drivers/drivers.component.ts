import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Driver, Invitation, Role } from 'src/app/interfaces/drivers';
import { DriversService } from 'src/app/services/drivers/drivers.service';
import { Table } from 'primeng/table';
import { PrimeNGConfig, ConfirmationService } from 'primeng/api';
import { UsersService } from 'src/app/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { deleteDrivers, deleteDriversSuccess } from 'src/app/store/actions/driver.actions';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/store/reducers';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { getDriverState } from 'src/app/store/selectors/driver.selector';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit, OnDestroy {

    @ViewChild('table') table: Table;
    invitationForm: FormGroup;

    deleteDrivers$: Subscription;
    invitations$: Subscription;
    drivers$: Observable<Driver[]> = this.store.select(getDriverState);;
    selectedDrivers: Driver[];

    event: any;
    statuses: any[];
    roles: Role[];
    selectedRole: number;
    email: string;
    active_id: number;

    displayInvitationForm: boolean;
    displayInvitations: boolean;
    showDeleteBtn: boolean = false;
    showInvitationsBtns: boolean = false;

    invitations: Invitation[];

    constructor(private translate: TranslateService, private driversService: DriversService, private primengConfig: PrimeNGConfig,
        private confirmationService: ConfirmationService, private usersService: UsersService,
        private fb: FormBuilder, private store: Store<AppState>, private _actions$: Actions, private message: ShowMessageService) {
        this.active_id = this.usersService.getActiveUser().id;
        this.roles = [
            { name: "Rider", id: 2 },
            { name: "Admin", id: 1 },
        ];
        this.email = "";
        this.selectedRole = 2;
    }

    ngOnInit(): void {

        this.invitationForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
            selectedRole: [2, [Validators.required]]
        })

        this.showDeleteBtn = this.usersService.checkPermission('manage-users');
        this.showInvitationsBtns = this.usersService.checkPermission('manage-invites');

        this.statuses = [
            { label: this.translate.instant('drivers.status_on'), value: true },
            { label: this.translate.instant('drivers.status_off'), value: false },
        ]
        this.primengConfig.ripple = true;
    }

    ngOnDestroy() {
        if (this.deleteDrivers$) this.deleteDrivers$.unsubscribe();
        if (this.invitations$) this.invitations$.unsubscribe();
    }

    public isActiveUser(id: number): boolean {
        return id === this.active_id;
    }

    public deleteSelectedDriversConfirmation() {
        //Decides wich message to show depending on number of selected drivers
        this.selectedDrivers.length > 1 ?
            this.showDeleteConfirmationMessage('drivers.delete_text_p', 'drivers.delete_title_p') :
            this.showDeleteConfirmationMessage('drivers.delete_text', 'drivers.delete_title');
    }

    private showDeleteConfirmationMessage(translationMessage: string, translationHeader: string) {
        //Asks to confirm the deleting of selected drivers
        this.confirmationService.confirm({
            message: this.translate.instant(translationMessage),
            header: this.translate.instant(translationHeader),
            icon: 'pi pi-exclamation-triangle',
            accept: () => { this.sendDeleteDriversId() }
        });
    }

    private sendDeleteDriversId() {
        //Deletes the selected orders
        let ids: number[] = [];
        this.selectedDrivers.forEach(driver => ids.push(driver.id));
        this.store.dispatch(deleteDrivers({ ids: ids }));

        this.deleteDrivers$ = this._actions$.pipe(ofType(deleteDriversSuccess)).subscribe(() => {
            ids.length > 1 ?
                this.message.showMessage('success', 'drivers.invitation_delete_title', 'drivers.drivers_delete_body') :
                this.message.showMessage('success', 'drivers.invitation_delete_title', 'drivers.driver_delete_body');
        });

        this.selectedDrivers = [];
    }

    public showInvitationForm(): void {
        this.displayInvitationForm = true;
    }

    public showInvitations() {
        this.invitations$ = this.driversService.getInvitations().subscribe({
            next: invitations => {
                this.invitations = invitations.reverse();
                this.displayInvitations = true;
            }
        });
    }

    public sendInvitation() {
        if (this.showInvitationsBtns) {
            this.driversService.sendInvite(this.invitationForm.value.email, this.invitationForm.value.selectedRole).then(() => {
                this.message.showMessage('success', 'drivers.invitation_delete_title', 'drivers.invitation_send_body');
                this.displayInvitationForm = false;
            });
            this.invitationForm.reset();
        }
    }

    public closeSendInvitation() {
        this.displayInvitationForm = false;
        this.email = "";
        this.selectedRole = 2;
    }

}
