import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// Models
import { Volunteer } from 'src/app/models/Volunteer';
import { FamilyID } from 'src/app/models/FamilyID';

// Services
import { VolunteersService } from 'src/app/services/volunteers.service';
import { FamilyIdService } from 'src/app/services/family-id.service';
import { ToastrService } from 'ngx-toastr';

// RXJS
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-volunteer',
  templateUrl: './add-volunteer.component.html',
  styleUrls: ['./add-volunteer.component.scss'],
})
export class AddVolunteerComponent implements OnInit {
  headerTitle = 'Add Volunteer Page';
  headerIcon = 'fas fa-lg fa-user-plus';

  showModal: boolean = false;
  modalErrorText: string;

  eventTimesStatus: boolean = false;

  saturdayChecked: boolean = false;
  sundayEarlyChecked: boolean = false;
  sundayLateChecked: boolean = false;
  weekdayChecked: boolean = false;

  eventTypesAdded: boolean = false;
  eventCheckboxChecked: boolean = false;

  volunteerForm: FormGroup;

  allFamilyIDs$: Observable<FamilyID[]>;

  constructor(
    private volunteersService: VolunteersService,
    private familyIdService: FamilyIdService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.volunteerForm = this.fb.group({
      dateUnAvailable: this.fb.array([]),
      eventTypesAvailable: this.fb.array([]),
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      familyID: ['', Validators.required],
      isAdmin: [false, Validators.required],
      isAvailable: [false, Validators.required],
      isCantor: [false, Validators.required],
      isEMoHC: [false, Validators.required],
      isGifts: [false, Validators.required],
      isGiftsChild: [false, Validators.required],
      isLector: [false, Validators.required],
      isRosary: [false, Validators.required],
      isServer: [false, Validators.required],
      isTech: [false, Validators.required],
      isUsher: [false, Validators.required],
      isOther: [false, Validators.required],
      isMassCoord: [false, Validators.required],
      isSaturday: false,
      isSundayEarly: false,
      isSundayLate: false,
      isWeekday: false,
    });
  }

  ngOnInit(): void {
    this.allFamilyIDs$ = this.familyIdService.getFamilyIDs();
  }

  get f() {
    return this.volunteerForm.controls;
  }

  handleEventTimeCheckbox(time: string) {
    if (time === 'Saturday') {
      this.saturdayChecked = !this.saturdayChecked;
    } else if (time === 'Sunday-Early') {
      this.sundayEarlyChecked = !this.sundayEarlyChecked;
    } else if (time === 'Sunday-Late') {
      this.sundayLateChecked = !this.sundayLateChecked;
    } else {
      this.weekdayChecked = !this.weekdayChecked;
    }
    this.setEventStatus();
  }

  setEventStatus() {
    this.eventCheckboxChecked = false;
    if (
      this.saturdayChecked === true ||
      this.sundayEarlyChecked === true ||
      this.sundayLateChecked === true ||
      this.weekdayChecked === true
    ) {
      this.eventCheckboxChecked = true;
    } else {
      this.eventCheckboxChecked = false;
    }
  }

  setEventTypeList(e) {
    e.preventDefault();
    this.eventTypesAdded = true;

    const tempFormArray = <FormArray>(
      this.volunteerForm.controls.eventTypesAvailable
    );

    if (this.saturdayChecked === true) {
      tempFormArray.push(new FormControl('Saturday'));
    }

    if (this.sundayEarlyChecked === true) {
      tempFormArray.push(new FormControl('Sunday-Early'));
    }

    if (this.sundayLateChecked === true) {
      tempFormArray.push(new FormControl('Sunday-Late'));
    }

    if (this.weekdayChecked === true) {
      tempFormArray.push(new FormControl('Weekday'));
    }
  }

  getEmailErrorMessage() {
    return this.f.email.hasError('required')
      ? 'You must enter a value'
      : this.f.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getPhoneErrorMessage() {
    return this.f.phone.hasError('required')
      ? 'You must enter a value.'
      : this.f.phone.hasError('minLength')
      ? 'Number must be 10 digits.'
      : '';
  }

  modalToggle() {
    this.showModal = !this.showModal;
  }

  showModalErrorText(err: string) {
    this.modalErrorText = err;
  }

  onSubmit({ value, valid }: { value: Volunteer; valid: boolean }) {
    if (!valid) {
      // Show error message
      this.modalToggle();
      this.showModalErrorText('Form is Invalid!');
      console.log(value);
    } else {
      // Save Volunteer to DB
      this.volunteersService.addVolunteer(value);
      this.showToastrSuccess('Success', 'New Volunteer Added!');
      this.router.navigate(['/volunteers']);
    }
  }

  // Methods for Showing Toast Messages
  showToastrSuccess(title: string, val: string) {
    this.toastr.success(`${val}`, `${title}`, {
      timeOut: 2000,
      positionClass: 'toast-top-left',
    });
  }
}
