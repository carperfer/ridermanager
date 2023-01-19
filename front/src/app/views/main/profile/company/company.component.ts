import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/users';
import { UsersService } from '../../../../services/users/users.service';

@Component({
  selector: 'profile-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  companies: Company[];
  company: Company;
  editMode: boolean;
  constructor(private usersService: UsersService) {
    this.editMode = false;
  }

  ngOnInit() {
    this.companies = this.usersService.getActiveUser().companies;
    this.company = this.usersService.getActiveCompany();
  }

  public enableEdit() {
    this.editMode = !this.editMode;
  }

  save() {
    // this.usersService.editCompany();
    // this.editMode = !this.editMode;
  }

}
