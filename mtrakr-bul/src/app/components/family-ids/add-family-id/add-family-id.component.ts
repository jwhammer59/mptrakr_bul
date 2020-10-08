import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FamilyID } from 'src/app/models/FamilyID';
import { FamilyIdService } from 'src/app/services/family-id.service';

import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-family-id',
  templateUrl: './add-family-id.component.html',
  styleUrls: ['./add-family-id.component.scss'],
})
export class AddFamilyIdComponent implements OnInit {
  headerTitle = 'Add Family ID Page';
  headerIcon = 'fas fa-users-cog';

  familyIdForm: FormGroup;

  allFamilyIDs$: Observable<FamilyID[]>;
  currentFamilyID: string;
  matchingFamilyIdArray: FamilyID[];
  familyIdArray = [];

  constructor(
    private familyIdService: FamilyIdService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.familyIdForm = this.fb.group({
      familyID: ['', Validators.required],
      householdFullName: ['', Validators.required],
      isActive: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    // Get All Family ID Objects
    this.allFamilyIDs$ = this.familyIdService.getFamilyIDs();
    this.allFamilyIDs$.subscribe((famData) => {
      this.matchingFamilyIdArray = famData;
      this.processFamilyID(this.matchingFamilyIdArray);
    });
  }

  get f() {
    return this.familyIdForm.controls;
  }

  // Create new array of only Family ID's
  processFamilyID(data: FamilyID[]) {
    this.familyIdArray = [];
    data.map((el) => {
      let familyIdMatch = 'familyID';
      familyIdMatch = el.familyID;
      this.familyIdArray.push(familyIdMatch);
    });
  }

  showToastrSuccess(title: string, val: string) {
    this.toastr.success(`${val}`, `${title}`, {
      timeOut: 2000,
      positionClass: 'toast-top-left',
    });
  }

  showToastrError(title: string, val: string) {
    this.toastr.error(`${val}`, `${title}`, {
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
    });
  }

  onSubmit({ value, valid }: { value: FamilyID; valid: boolean }) {
    this.currentFamilyID = value.familyID;

    if (!valid) {
      this.currentFamilyID = '';
      this.showToastrError('Error', 'Form Invalid!');
    } else if (this.familyIdArray.includes(this.currentFamilyID)) {
      const tempFamilyID = this.currentFamilyID;
      this.currentFamilyID = '';
      this.showToastrError('Error', `Family ID ${tempFamilyID} already taken!`);
    } else {
      this.familyIdService.addFamilyID(value);
      this.currentFamilyID = '';
      this.showToastrSuccess('Success', 'New Family ID Added!');
      this.router.navigate(['/family-id']);
    }
  }
}
