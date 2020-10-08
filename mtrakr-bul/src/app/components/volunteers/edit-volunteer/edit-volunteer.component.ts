import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

import { Volunteer } from '../../../models/Volunteer';
import { VolunteersService } from '../../../services/volunteers.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FamilyID } from 'src/app/models/FamilyID';
import { FamilyIdService } from 'src/app/services/family-id.service';

@Component({
  selector: 'app-edit-volunteer',
  templateUrl: './edit-volunteer.component.html',
  styleUrls: ['./edit-volunteer.component.scss'],
})
export class EditVolunteerComponent implements OnInit {
  headerTitle = 'Edit Volunteer Page';
  headerIcon = 'fas fa-lg fa-user-edit';

  showModal: boolean = false;
  modalErrorText: string;

  // showDatesUnAvailable: boolean = false;
  // unAvailableDates: string[] = [];

  eventTimesStatus: boolean = false;

  saturdayChecked: boolean = false;
  sundayEarlyChecked: boolean = false;
  sundayLateChecked: boolean = false;
  weekdayChecked: boolean = false;

  eventTypesAdded: boolean = false;
  eventCheckboxChecked: boolean = true;

  volunteerEditForm: FormGroup;

  volunteer: Observable<Volunteer>;
  id: string;

  allFamilyIDs$: Observable<FamilyID[]>;

  constructor(
    private volunteersService: VolunteersService,
    private familyIdService: FamilyIdService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.volunteerEditForm = this.fb.group({
      id: '',
      eventTypesAvailable: this.fb.array([]),
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      familyID: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
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

    this.loadVolunteer();
    this.setEventCheckboxStatus();
  }

  loadVolunteer() {
    this.volunteer = this.volunteersService
      .getVolunteer(this.id)
      .pipe(tap((volunteer) => this.volunteerEditForm.patchValue(volunteer)));

    // Get All Family ID's
    this.allFamilyIDs$ = this.familyIdService.getFamilyIDs();
  }

  get f() {
    return this.volunteerEditForm.controls;
  }

  // Wait for data to load to set checkbox status
  setEventCheckboxStatus() {
    setTimeout(() => {
      this.saturdayChecked = this.f.isSaturday.value;
      this.sundayEarlyChecked = this.f.isSundayEarly.value;
      this.sundayLateChecked = this.f.isSundayLate.value;
      this.weekdayChecked = this.f.isWeekday.value;
    }, 2000);
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

  updateEventTypeList(e) {
    e.preventDefault();
    this.eventTypesAdded = true;

    const tempFormArray = <FormArray>(
      this.volunteerEditForm.controls.eventTypesAvailable
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

  // unAvailableDatesToggle() {
  //   this.volunteer.subscribe(
  //     (res) => (this.unAvailableDates = res.dateUnAvailable)
  //   );
  //   this.showDatesUnAvailable = !this.showDatesUnAvailable;
  // }

  onSubmit({ value, valid }: { value: Volunteer; valid: boolean }) {
    if (!valid || !this.eventCheckboxChecked) {
      // Show error message
      this.modalToggle();
      this.showModalErrorText('Form is Invalid!');
      console.log(value);
    } else {
      // Save Volunteer to DB
      this.volunteersService.updateVolunteer(value);
      this.router.navigate(['/volunteers']);
      console.log('Add Volunteer Success!');
    }
  }
}
