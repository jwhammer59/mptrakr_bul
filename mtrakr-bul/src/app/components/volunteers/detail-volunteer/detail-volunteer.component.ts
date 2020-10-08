import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Volunteer } from '../../../models/Volunteer';
import { VolunteersService } from '../../../services/volunteers.service';

@Component({
  selector: 'app-detail-volunteer',
  templateUrl: './detail-volunteer.component.html',
  styleUrls: ['./detail-volunteer.component.scss'],
})
export class DetailVolunteerComponent implements OnInit {
  headerTitle = 'Volunteer Detail Page';
  headerIcon = 'fas fa-lg fa-user-cog';
  tabChoice: number = 1;
  showDeleteModal: boolean = false;
  showUnavailableModal: boolean = false;
  showUnAvailableDateModal: boolean = false;
  invalidDate: boolean = false;
  errorMessage: string;

  unAvailableDates: string[] = [];
  addDateForm: FormGroup;

  id: string;
  volunteer: Volunteer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: 0,
    familyID: '',
    isAdmin: false,
    isAvailable: false,
    isCantor: false,
    isEMoHC: false,
    isGifts: false,
    isGiftsChild: false,
    isLector: false,
    isMassCoord: false,
    isOther: false,
    isRosary: false,
    isServer: false,
    isTech: false,
    isUsher: false,
    isSaturday: false,
    isSundayEarly: false,
    isSundayLate: false,
    isWeekday: false,
  };

  constructor(
    private volunteersService: VolunteersService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.volunteersService.getVolunteer(this.id).subscribe((volunteer) => {
      this.volunteer = volunteer;
    });

    this.addDateForm = this.fb.group({
      id: this.id,
      dateUnAvailable: ['', Validators.required],
    });
  }

  showModalToggle(val: string) {
    if (val === 'deleteVolunteerModal') {
      this.showDeleteModal = !this.showDeleteModal;
    }

    if (val === 'addDateModal') {
      this.showUnavailableModal = !this.showUnavailableModal;
    }

    if (val === 'deleteUnAvailableDateModal') {
      this.showUnAvailableDateModal = !this.showUnAvailableDateModal;
    }
  }

  onDeleteVolunteerClicked() {
    this.showModalToggle('deleteVolunteerModal');
  }

  onAddDateClicked() {
    this.showModalToggle('addDateModal');
  }

  onDeleteDateClicked(date: string, id: string) {
    this.volunteersService.deleteVolUnAvailableDate(date, id);
    this.router.navigate(['/volunteers']);
  }

  // Sets active class on Tab HTML
  // Gets Un-Available Dates from DB
  tabSelect(tab: number) {
    if (tab === 3) {
      this.unAvailableDates = this.volunteer.dateUnAvailable;
      this.tabChoice = tab;
    } else {
      this.tabChoice = tab;
    }
  }

  modalDeleteVolunteerResponse(res: boolean) {
    if (res) {
      this.showModalToggle('deleteVolunteerModal');
      this.volunteersService.deleteVolunteer(this.volunteer);
      this.router.navigate(['/volunteers']);
    } else {
      this.showModalToggle('deleteVolunteerModal');
    }
  }

  modalDateUnAvailableResponse() {
    this.showModalToggle('addDateModal');
  }

  onSubmit({ value, valid }: { value: Volunteer; valid: boolean }) {
    if (!valid) {
      // Handle Error
      this.invalidDate = true;
      this.errorMessage = 'Please enter a valid date!';
    } else {
      // Handle Success
      if (this.unAvailableDates.includes(value.dateUnAvailable)) {
        this.invalidDate = true;
        this.errorMessage = 'Date already exists.';
      } else {
        this.showModalToggle('dateModal');
        this.volunteersService.updateVolUnAvailableDate(value);
        this.router.navigate(['/volunteers']);
      }
    }
  }
}
