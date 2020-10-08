import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FamilyID } from 'src/app/models/FamilyID';
import { FamilyIdService } from 'src/app/services/family-id.service';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-family-id',
  templateUrl: './edit-family-id.component.html',
  styleUrls: ['./edit-family-id.component.scss'],
})
export class EditFamilyIdComponent implements OnInit {
  headerTitle = 'Edit Family ID Page';
  headerIcon = 'far fa-lg fa-edit';

  allFamilyIDs$: Observable<FamilyID[]>;
  matchingFamilyID: string;
  matchingFamilyIdArray: FamilyID[];
  isMatchingFamilyID: boolean = false;
  beforeEditFamilyID: string;

  editFamilyIdForm: FormGroup;
  familyID: Observable<FamilyID>;
  id: string;

  constructor(
    private familyIdService: FamilyIdService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.editFamilyIdForm = this.fb.group({
      id: '',
      familyID: ['', Validators.required],
      householdFullName: ['', Validators.required],
      isActive: [false, Validators.required],
    });

    this.loadAllFamilyIds();
  }

  loadAllFamilyIds() {
    console.log(this.id);
    this.familyID = this.familyIdService
      .getFamilyID(this.id)
      .pipe(tap((familyID) => this.editFamilyIdForm.patchValue(familyID)));

    this.allFamilyIDs$ = this.familyIdService.getFamilyIDs();
    this.updateAfterLoad();
  }

  updateAfterLoad() {
    setTimeout(() => {
      this.beforeEditFamilyID = this.editFamilyIdForm.controls.familyID.value;
    }, 2000);
  }

  onSubmit({ value, valid }: { value: FamilyID; valid: boolean }) {
    let familyIdStatus = false;
    let currentFamilyID = value.familyID;
    if (currentFamilyID === this.beforeEditFamilyID) {
      familyIdStatus = true;
    }
    /*
    Get all family ID's and filter for the Family ID that matches the
    Family ID from the form (if it exists)
    */
    const onlyFamilyIDs$ = this.allFamilyIDs$.pipe(
      map((familyIDs) =>
        familyIDs.filter((familyIDs) => familyIDs.familyID === currentFamilyID)
      )
    );

    /*
    Subscribe to onlyFamilyIDs$ and take the value passed
    into the data parameter and store it in "matchingFamilyID".
    Get all family ID's and filter for the
    */
    onlyFamilyIDs$.subscribe((data) => {
      this.matchingFamilyID = data.shift().familyID;
      const tempFamilyID$ = this.allFamilyIDs$.pipe(
        map((familyIDs) =>
          familyIDs.filter(
            (familyIDs) => familyIDs.familyID === this.matchingFamilyID
          )
        )
      );

      /*
      Subscribe to tempFamilyID stream and get any data available.
      Check for data, if data exists this means that there is a matching
      Family ID.
      */
      tempFamilyID$.subscribe((idData) => {
        this.matchingFamilyIdArray = idData;
        if (this.matchingFamilyIdArray.length > 0) {
          return (this.isMatchingFamilyID = true);
        }
      });
    });

    // Wait for Observables to complete before processing OnSubmit
    // **** Need to learn how to do this programatically ****
    setTimeout(() => {
      if (!valid) {
        this.showToastrError('Error', 'Form Invalid!');
      } else if (this.isMatchingFamilyID) {
        this.showToastrError('Error', `Family ID already taken!`);
        this.isMatchingFamilyID = false;
      } else {
        this.familyIdService.updateFamilyID(value);
        this.showToastrSuccess('Success', 'New Family ID Updated!');
        this.router.navigate(['/family-id']);
      }
    }, 1000);
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
}
