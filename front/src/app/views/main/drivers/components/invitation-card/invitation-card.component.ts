import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Invitation } from 'src/app/interfaces/drivers';
import { DriversService } from 'src/app/services/drivers/drivers.service';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';


@Component({
  selector: 'app-invitation-card',
  templateUrl: './invitation-card.component.html',
  styleUrls: ['./invitation-card.component.scss']
})
export class InvitationCardComponent implements OnInit {

  role: string;
  role_style: string;
  displayConfirmation: boolean = false;

  @Input() invitation: Invitation
  @Output() reloadTable: EventEmitter<void>
  constructor(private driversService: DriversService, private message: ShowMessageService) {
    this.reloadTable = new EventEmitter;
  }

  ngOnInit(): void {
    if (this.invitation.role_id == 1) {
      this.role = "Admin"
      this.role_style = "success"
    } else if (this.invitation.role_id == 2) {
      this.role = "Rider"
      this.role_style = "info"
    }
  }

  public deleteInvite() {
    this.driversService.deleteInvite(this.invitation.id).then(() => {
      this.message.showMessage('success', 'drivers.invitation_delete_title', 'drivers.invitation_delete_body')
      this.reloadTable.emit();
    })
  }

}
