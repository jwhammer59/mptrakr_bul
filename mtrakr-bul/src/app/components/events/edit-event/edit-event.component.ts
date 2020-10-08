import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models
import { Event } from '../../../models/Event';
import { Volunteer } from '../../../models/Volunteer';
import { EventType } from '../../../models/EventType';

// Services
import { EventsService } from 'src/app/services/events.service';
import { VolunteersService } from 'src/app/services/volunteers.service';
import { ToastrService } from 'ngx-toastr';

// RXJS
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  headerTitle = 'Edit Event Page';
  headerIcon = 'far fa-lg fa-edit';

  // Modal Properties
  showModal: boolean = false;
  modalErrorText: string;
  modalHeaderText: string = 'Important Info';
  modalHeaderVolError = 'Volunteer Entry Error';

  // Properties for tracking event status
  eventIsFull: boolean = false;
  prBarCounter: number = 0;
  currentEventType: string;

  // Properties for finding matching family members
  matchingFamilyID: String;
  matchingFamilyArray: Volunteer[];
  familyNameArray = [];

  // Properties for Duplicates
  hasDuplicates: boolean;
  hasDuplicateLector: boolean;
  hasDuplicateEMoHC: boolean;
  hasDuplicateServer: boolean;
  hasDuplicateUsher: boolean;
  hasDuplicateRosary: boolean;
  hasDuplicateTech: boolean;

  // Properties for Event Approval Exceptions
  duplicateVolunteerApproval: boolean = false;
  incompleteEventApproval: boolean = false;
  checkForMatchingFamily: boolean = false;

  // Sets Tab1 Active at Start
  tabChoice: number = 1;

  // Properties to keep track of Tabs that are completed
  tab1Ready: boolean = false;
  tab2Ready: boolean = false;
  tab3Ready: boolean = false;
  tab4Ready: boolean = false;
  tab5Ready: boolean = false;

  // All Observables or Form Select Inputs
  allVolunteers$: Observable<Volunteer[]>;
  onlyCantors$: Observable<any>;
  onlyLectors$: Observable<any>;
  onlyServers$: Observable<any>;
  onlyUshers$: Observable<any>;
  onlyGifts$: Observable<any>;
  onlyGiftsChild$: Observable<any>;
  onlyRosarys$: Observable<any>;
  onlyTechs$: Observable<any>;
  onlyOthers$: Observable<any>;
  onlyEMoHCs$: Observable<any>;
  onlyMassCoords$: Observable<any>;
  selectedVolunteer$: Observable<any>;
  selectedFamilyMembers$: Observable<any>;

  eventEditForm: FormGroup;
  event: Observable<Event>;
  id: string;

  eventTypes: EventType[] = [
    { value: 'Saturday', viewValue: 'Saturday' },
    { value: 'Sunday-Early', viewValue: 'Sunday-Early' },
    { value: 'Sunday-Late', viewValue: 'Sunday-Late' },
    { value: 'Weekday', viewValue: 'Weekday' },
  ];

  constructor(
    private eventsService: EventsService,
    private volunteersService: VolunteersService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.eventEditForm = this.fb.group({
      id: '',
      date: ['', Validators.required],
      type: ['', Validators.required],
      isFull: [false, Validators.required],
      cantor: ['', Validators.required],
      lector1: ['', Validators.required],
      lector2: ['', Validators.required],
      eMoHC1: ['', Validators.required],
      eMoHC2: ['', Validators.required],
      eMoHC3: ['', Validators.required],
      eMoHC4: ['', Validators.required],
      eMoHC5: ['', Validators.required],
      eMoHC6: ['', Validators.required],
      eMoHC7: ['', Validators.required],
      gifts: ['', Validators.required],
      giftsChild: ['', Validators.required],
      rosary1: ['', Validators.required],
      rosary2: ['', Validators.required],
      other: '',
      usher1: ['', Validators.required],
      usher2: ['', Validators.required],
      usher3: ['', Validators.required],
      usher4: ['', Validators.required],
      usher5: ['', Validators.required],
      massCord: ['', Validators.required],
      server1: ['', Validators.required],
      server2: ['', Validators.required],
      server3: ['', Validators.required],
      tech1: ['', Validators.required],
      tech2: ['', Validators.required],
    });

    this.loadEvent();
    this.loadAllVolunteers();
  }

  loadEvent() {
    this.event = this.eventsService
      .getEvent(this.id)
      .pipe(tap((event) => this.eventEditForm.patchValue(event)));

    this.initForm();
  }

  // Get All Volunteers then filter by ministry
  loadAllVolunteers() {
    this.allVolunteers$ = this.volunteersService.getVolunteers();

    this.onlyCantors$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isCantor === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyLectors$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isLector === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyServers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isServer === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyUshers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isUsher === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyGifts$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isGifts === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyGiftsChild$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isGiftsChild === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyRosarys$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isRosary === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyOthers$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isOther === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyTechs$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isTech === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyEMoHCs$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isEMoHC === true && volunteer.isAvailable === true
        )
      )
    );

    this.onlyMassCoords$ = this.allVolunteers$.pipe(
      map((volunteers) =>
        volunteers.filter(
          (volunteer) =>
            volunteer.isMassCoord === true && volunteer.isAvailable === true
        )
      )
    );
  }

  // Get a referece for use in template
  get f() {
    return this.eventEditForm.controls;
  }

  // Initialize form, set inputs and validate
  initForm() {
    setTimeout(() => {
      this.currentEventType = this.eventEditForm.controls.type.value;
      this.setEditFormInputsActive();
      this.tabsReady();
    }, 2000);
  }

  /* When event type is changed, set form
  in preparation of selecting Date
  */
  onEventTypeChanged(e: string) {
    this.currentEventType = e;
    this.resetTabs();
    this.tabChoice = 1;
    this.disableFormInputs();
    this.f.date.enable();
    this.f.date.setValue('');
  }

  setEventDate(e) {
    let selectedDate = new Date(e.target.value).getUTCDay();
    if (this.currentEventType === 'Saturday' && selectedDate === 6) {
      this.showToastrSuccess(
        'Success',
        'The date matches the Event Type - Saturday'
      );
      this.setFormInputsActive();
      return;
    } else if (this.currentEventType === 'Saturday' && selectedDate !== 6) {
      this.showToastrError('Error', 'The date must be a Saturday!');
      return;
    } else if (this.currentEventType === 'Sunday-Early' && selectedDate === 0) {
      this.showToastrSuccess(
        'Success',
        'The date matches the Event Type - Sunday-Early'
      );
      this.setFormInputsActive();
      return;
    } else if (this.currentEventType === 'Sunday-Early' && selectedDate !== 0) {
      this.showToastrError('Error', 'Date must be a Sunday!');
      return;
    } else if (this.currentEventType === 'Sunday-Late' && selectedDate == 0) {
      this.showToastrSuccess(
        'Success',
        'The date matches the Event Type - Sunday-Late'
      );
      this.setFormInputsActive();
      return;
    } else if (this.currentEventType === 'Sunday-Late' && selectedDate !== 0) {
      this.showToastrError('Error', 'The date must be a Sunday!');
      return;
    } else if (
      (this.currentEventType === 'Weekday' && selectedDate === 0) ||
      (this.currentEventType === 'Weekday' && selectedDate === 6)
    ) {
      this.showToastrError('Error', 'The date must be a Weekday!');
      return;
    } else {
      this.showToastrSuccess(
        'Success',
        'The date matches the Event Type - Weekday'
      );
      this.setFormInputsActive();
    }
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

  setFormInputsActive() {
    this.enableFormInputs();
    this.setActiveInputs();
  }

  updateUI(e) {
    this.tabsReady();
    // Update staffing level after input change
    this.checkStaffingLevel(this.currentEventType);
    /* If "Check for Matching Family" checkbox is checked
     return matching FamilyID. */
    if (this.checkForMatchingFamily) {
      const selectedVolunteer$ = this.allVolunteers$.pipe(
        map((volunteers) =>
          volunteers.filter(
            (volunteers) =>
              volunteers.firstName + ' ' + volunteers.lastName === e
          )
        )
      );

      selectedVolunteer$.subscribe((volData) => {
        this.matchingFamilyID = volData.shift().familyID;
        const selectedFamilyMembers$ = this.allVolunteers$.pipe(
          map((volunteers) =>
            volunteers.filter(
              (volunteers) =>
                volunteers.familyID === this.matchingFamilyID.toString()
            )
          )
        );

        selectedFamilyMembers$.subscribe((volData) => {
          this.matchingFamilyArray = volData;
          this.processFamilyID(this.matchingFamilyArray);
        });
      });
    }
  }

  tabsReady() {
    if (
      this.currentEventType === 'Saturday' ||
      this.currentEventType === 'Sunday-Late'
    ) {
      // Check tabs for Saturday
      if (this.f.cantor.value && this.f.lector1.value && this.f.lector2.value) {
        this.tab1Ready = true;
      }

      if (
        this.f.eMoHC1.value &&
        this.f.eMoHC2.value &&
        this.f.eMoHC3.value &&
        this.f.eMoHC4.value &&
        this.f.eMoHC5.value &&
        this.f.eMoHC6.value &&
        this.f.eMoHC7.value
      ) {
        this.tab2Ready = true;
      }

      if (
        this.f.usher1.value &&
        this.f.usher2.value &&
        this.f.usher3.value &&
        this.f.usher4.value &&
        this.f.usher5.value &&
        this.f.massCord.value
      ) {
        this.tab3Ready = true;
      }

      if (
        this.f.server1.value &&
        this.f.server2.value &&
        this.f.server3.value &&
        this.f.gifts.value &&
        this.f.giftsChild.value
      ) {
        this.tab4Ready = true;
      }

      if (
        this.f.rosary1.value &&
        this.f.rosary2.value &&
        this.f.tech1.value &&
        this.f.tech2.value
      ) {
        this.tab5Ready = true;
      }
    } else if (this.currentEventType === 'Sunday-Early') {
      // Set 5 true as it is not used
      // Then check remaining tabs
      this.tab5Ready = true;

      if (this.f.cantor.value && this.f.lector1.value && this.f.lector2.value) {
        this.tab1Ready = true;
      }

      if (this.f.eMoHC1.value && this.f.eMoHC2.value) {
        this.tab2Ready = true;
      }

      if (this.f.usher1.value && this.f.usher2.value) {
        this.tab3Ready = true;
      }

      if (this.f.server1.value && this.f.server2.value) {
        this.tab4Ready = true;
      }
    } else {
      // Set Tab 3 & 5 true as they are not used
      // Then check remaining tabs
      this.tab3Ready = true;
      this.tab5Ready = true;

      if (this.f.lector1.value) {
        this.tab1Ready = true;
      }

      if (this.f.eMoHC1.value) {
        this.tab2Ready = true;
      }

      if (this.f.server1.value) {
        this.tab4Ready = true;
      }
    }
  }

  resetTabs() {
    this.tab1Ready = false;
    this.tab2Ready = false;
    this.tab3Ready = false;
    this.tab4Ready = false;
    this.tab5Ready = false;
  }

  /* Create new array of only family member names
      that match the familyID and display
      them in a SnackBar
  */
  processFamilyID(data: Volunteer[]) {
    data.map((el) => {
      let firstNameMatch = 'firstName';
      let lastNameMatch = 'lastName';
      let fullName = '';
      firstNameMatch = el.firstName;
      lastNameMatch = el.lastName;
      fullName = firstNameMatch + ' ' + lastNameMatch;
      this.familyNameArray.push(fullName);
    });
    // Create a string from array to use in snackBar
    const matchingFamilyResults = this.familyNameArray.join(' , ');
    this.modalToggle('Matching Family Members');
    this.showModalErrorText(
      `All family members include: ${matchingFamilyResults}`
    );
    this.familyNameArray = [];
  }

  // Disable all inputs until Event Type is selected
  disableFormInputs() {
    this.f.date.disable();
    this.f.cantor.disable();
    this.f.lector1.disable();
    this.f.lector2.disable();
    this.f.eMoHC1.disable();
    this.f.eMoHC2.disable();
    this.f.eMoHC3.disable();
    this.f.eMoHC4.disable();
    this.f.eMoHC5.disable();
    this.f.eMoHC6.disable();
    this.f.eMoHC7.disable();
    this.f.gifts.disable();
    this.f.giftsChild.disable();
    this.f.rosary1.disable();
    this.f.rosary2.disable();
    this.f.other.disable();
    this.f.usher1.disable();
    this.f.usher2.disable();
    this.f.usher3.disable();
    this.f.usher4.disable();
    this.f.usher5.disable();
    this.f.massCord.disable();
    this.f.server1.disable();
    this.f.server2.disable();
    this.f.server3.disable();
    this.f.tech1.disable();
    this.f.tech2.disable();
  }

  enableFormInputs() {
    this.f.cantor.enable();
    this.f.lector1.enable();
    this.f.lector2.enable();
    this.f.eMoHC1.enable();
    this.f.eMoHC2.enable();
    this.f.eMoHC3.enable();
    this.f.eMoHC4.enable();
    this.f.eMoHC5.enable();
    this.f.eMoHC6.enable();
    this.f.eMoHC7.enable();
    this.f.gifts.enable();
    this.f.giftsChild.enable();
    this.f.rosary1.enable();
    this.f.rosary2.enable();
    this.f.other.enable();
    this.f.usher1.enable();
    this.f.usher2.enable();
    this.f.usher3.enable();
    this.f.usher4.enable();
    this.f.usher5.enable();
    this.f.massCord.enable();
    this.f.server1.enable();
    this.f.server2.enable();
    this.f.server3.enable();
    this.f.tech1.enable();
    this.f.tech2.enable();
  }

  setEditFormInputsActive() {
    if (this.currentEventType === 'Weekday') {
      // Disable non used volunteers & set value to ''
      this.f.cantor.disable();
      this.f.lector2.disable();
      this.f.eMoHC2.disable();
      this.f.eMoHC3.disable();
      this.f.eMoHC4.disable();
      this.f.eMoHC5.disable();
      this.f.eMoHC6.disable();
      this.f.eMoHC7.disable();
      this.f.gifts.disable();
      this.f.giftsChild.disable();
      this.f.rosary1.disable();
      this.f.rosary2.disable();
      this.f.other.disable();
      this.f.usher1.disable();
      this.f.usher2.disable();
      this.f.usher3.disable();
      this.f.usher4.disable();
      this.f.usher5.disable();
      this.f.massCord.disable();
      this.f.server2.disable();
      this.f.server3.disable();
      this.f.tech1.disable();
      this.f.tech2.disable();
      this.checkStaffingLevel(this.currentEventType);
    } else if (this.currentEventType === 'Sunday-Early') {
      // Disable non used volunteers & set value to ''
      this.f.eMoHC3.disable();
      this.f.eMoHC4.disable();
      this.f.eMoHC5.disable();
      this.f.eMoHC6.disable();
      this.f.eMoHC7.disable();
      this.f.gifts.disable();
      this.f.giftsChild.disable();
      this.f.rosary1.disable();
      this.f.rosary2.disable();
      this.f.other.disable();
      this.f.usher3.disable();
      this.f.usher4.disable();
      this.f.usher5.disable();
      this.f.massCord.disable();
      this.f.server3.disable();
      this.f.tech1.disable();
      this.f.tech2.disable();
      this.checkStaffingLevel(this.currentEventType);
    } else {
      this.checkStaffingLevel(this.currentEventType);
    }
  }

  setActiveInputs() {
    if (this.currentEventType === 'Weekday') {
      // Disable non used volunteers & set value to ''
      this.f.cantor.disable();
      this.f.cantor.setValue('');
      this.f.lector2.disable();
      this.f.lector2.setValue('');
      this.f.eMoHC2.disable();
      this.f.eMoHC2.setValue('');
      this.f.eMoHC3.disable();
      this.f.eMoHC3.setValue('');
      this.f.eMoHC4.disable();
      this.f.eMoHC4.setValue('');
      this.f.eMoHC5.disable();
      this.f.eMoHC5.setValue('');
      this.f.eMoHC6.disable();
      this.f.eMoHC6.setValue('');
      this.f.eMoHC7.disable();
      this.f.eMoHC7.setValue('');
      this.f.gifts.disable();
      this.f.gifts.setValue('');
      this.f.giftsChild.disable();
      this.f.giftsChild.setValue('');
      this.f.rosary1.disable();
      this.f.rosary1.setValue('');
      this.f.rosary2.disable();
      this.f.rosary2.setValue('');
      this.f.other.disable();
      this.f.other.setValue('');
      this.f.usher1.disable();
      this.f.usher1.setValue('');
      this.f.usher2.disable();
      this.f.usher2.setValue('');
      this.f.usher3.disable();
      this.f.usher3.setValue('');
      this.f.usher4.disable();
      this.f.usher4.setValue('');
      this.f.usher5.disable();
      this.f.usher5.setValue('');
      this.f.massCord.disable();
      this.f.massCord.setValue('');
      this.f.server2.disable();
      this.f.server2.setValue('');
      this.f.server3.disable();
      this.f.server3.setValue('');
      this.f.tech1.disable();
      this.f.tech1.setValue('');
      this.f.tech2.disable();
      this.f.tech2.setValue('');
      // Set Value of fields still used to ''
      this.f.lector1.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.server1.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    } else if (this.currentEventType === 'Sunday-Early') {
      // Disable non used volunteers & set value to ''
      this.f.eMoHC3.disable();
      this.f.eMoHC3.setValue('');
      this.f.eMoHC4.disable();
      this.f.eMoHC4.setValue('');
      this.f.eMoHC5.disable();
      this.f.eMoHC5.setValue('');
      this.f.eMoHC6.disable();
      this.f.eMoHC6.setValue('');
      this.f.eMoHC7.disable();
      this.f.eMoHC7.setValue('');
      this.f.gifts.disable();
      this.f.gifts.setValue('');
      this.f.giftsChild.disable();
      this.f.giftsChild.setValue('');
      this.f.rosary1.disable();
      this.f.rosary1.setValue('');
      this.f.rosary2.disable();
      this.f.rosary2.setValue('');
      this.f.other.disable();
      this.f.other.setValue('');
      this.f.usher3.disable();
      this.f.usher3.setValue('');
      this.f.usher4.disable();
      this.f.usher4.setValue('');
      this.f.usher5.disable();
      this.f.usher5.setValue('');
      this.f.massCord.disable();
      this.f.massCord.setValue('');
      this.f.server3.disable();
      this.f.server3.setValue('');
      this.f.tech1.disable();
      this.f.tech1.setValue('');
      this.f.tech2.disable();
      this.f.tech2.setValue('');
      // Set Value of fields still used to ''
      this.f.cantor.setValue('');
      this.f.lector1.setValue('');
      this.f.lector2.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.eMoHC2.setValue('');
      this.f.usher1.setValue('');
      this.f.usher2.setValue('');
      this.f.server1.setValue('');
      this.f.server2.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    } else {
      this.f.cantor.setValue('');
      this.f.lector1.setValue('');
      this.f.lector2.setValue('');
      this.f.eMoHC1.setValue('');
      this.f.eMoHC2.setValue('');
      this.f.eMoHC3.setValue('');
      this.f.eMoHC4.setValue('');
      this.f.eMoHC5.setValue('');
      this.f.eMoHC6.setValue('');
      this.f.eMoHC7.setValue('');
      this.f.gifts.setValue('');
      this.f.giftsChild.setValue('');
      this.f.rosary1.setValue('');
      this.f.rosary2.setValue('');
      this.f.other.setValue('');
      this.f.usher1.setValue('');
      this.f.usher2.setValue('');
      this.f.usher3.setValue('');
      this.f.usher4.setValue('');
      this.f.usher5.setValue('');
      this.f.massCord.setValue('');
      this.f.server1.setValue('');
      this.f.server2.setValue('');
      this.f.server3.setValue('');
      this.f.tech1.setValue('');
      this.f.tech2.setValue('');
      this.checkStaffingLevel(this.currentEventType);
    }
  }

  resetDuplicates() {
    this.hasDuplicateUsher = false;
    this.hasDuplicateLector = false;
    this.hasDuplicateServer = false;
    this.hasDuplicateEMoHC = false;
    this.hasDuplicateRosary = false;
    this.hasDuplicateTech = false;
  }

  checkForDuplicates() {
    this.resetDuplicates();
    //  If Incomplete Event Approval is checked
    //  Do not check for duplicates.
    if (!this.incompleteEventApproval) {
      if (this.currentEventType === 'Weekday') {
        return;
      } else if (this.currentEventType === 'Sunday-Early') {
        // Check for duplicate Lectors
        if (this.f.lector1.value === this.f.lector2.value) {
          return (this.hasDuplicateLector = true);
        }

        // Check for duplicate Servers
        if (this.f.server1.value === this.f.server2.value) {
          return (this.hasDuplicateServer = true);
        }

        // Check for duplicate Eucharstic Ministers
        if (
          this.f.eMoHC1.value === this.f.eMoHC2.value ||
          this.f.eMoHC1.value === this.f.eMoHC3.value ||
          this.f.eMoHC2.value === this.f.eMoHC3.value
        ) {
          return (this.hasDuplicateEMoHC = true);
        }

        // Check for duplicate Ushers
        if (
          this.f.usher1.value === this.f.usher2.value ||
          this.f.usher1.value === this.f.usher3.value ||
          this.f.usher2.value === this.f.usher3.value
        ) {
          return (this.hasDuplicateUsher = true);
        }
      } else {
        // Saturday & Sunday Late Duplicate Checking
        // Check for duplicate Lectors
        if (this.f.lector1.value === this.f.lector2.value) {
          return (this.hasDuplicateLector = true);
        }

        // Check for duplicate Servers
        if (
          this.f.server1.value === this.f.server2.value ||
          this.f.server1.value === this.f.server3.value ||
          this.f.server2.value === this.f.server3.value
        ) {
          return (this.hasDuplicateServer = true);
        }

        // Check for duplicate Eucharstic Ministers
        if (
          this.f.eMoHC1.value === this.f.eMoHC2.value ||
          this.f.eMoHC1.value === this.f.eMoHC3.value ||
          this.f.eMoHC1.value === this.f.eMoHC4.value ||
          this.f.eMoHC1.value === this.f.eMoHC5.value ||
          this.f.eMoHC1.value === this.f.eMoHC6.value ||
          this.f.eMoHC1.value === this.f.eMoHC7.value ||
          this.f.eMoHC2.value === this.f.eMoHC3.value ||
          this.f.eMoHC2.value === this.f.eMoHC4.value ||
          this.f.eMoHC2.value === this.f.eMoHC5.value ||
          this.f.eMoHC2.value === this.f.eMoHC6.value ||
          this.f.eMoHC2.value === this.f.eMoHC7.value ||
          this.f.eMoHC3.value === this.f.eMoHC4.value ||
          this.f.eMoHC3.value === this.f.eMoHC5.value ||
          this.f.eMoHC3.value === this.f.eMoHC6.value ||
          this.f.eMoHC3.value === this.f.eMoHC7.value ||
          this.f.eMoHC4.value === this.f.eMoHC5.value ||
          this.f.eMoHC4.value === this.f.eMoHC6.value ||
          this.f.eMoHC4.value === this.f.eMoHC7.value ||
          this.f.eMoHC5.value === this.f.eMoHC6.value ||
          this.f.eMoHC5.value === this.f.eMoHC7.value ||
          this.f.eMoHC6.value === this.f.eMoHC7.value
        ) {
          return (this.hasDuplicateEMoHC = true);
        }

        // Check for duplicate Tech
        if (this.f.tech1.value === this.f.tech2.value) {
          return (this.hasDuplicateTech = true);
        }

        // Check for duplicate Ushers
        if (
          this.f.usher1.value === this.f.usher2.value ||
          this.f.usher1.value === this.f.usher3.value ||
          this.f.usher1.value === this.f.usher4.value ||
          this.f.usher1.value === this.f.usher5.value ||
          this.f.usher2.value === this.f.usher3.value ||
          this.f.usher2.value === this.f.usher4.value ||
          this.f.usher2.value === this.f.usher5.value ||
          this.f.usher3.value === this.f.usher4.value ||
          this.f.usher3.value === this.f.usher5.value ||
          this.f.usher4.value === this.f.usher5.value
        ) {
          return (this.hasDuplicateUsher = true);
        }

        // Check for duplicate Rosary
        if (this.f.rosary1.value === this.f.rosary2.value) {
          return (this.hasDuplicateRosary = true);
        }
      }
    }
    return;
  }

  checkStaffingLevel(e) {
    this.prBarCounter = 0;
    var eventTypeMultiplier = 0;
    if (e === 'Weekday') {
      eventTypeMultiplier = 33.4;
    } else if (e === 'Sunday-Early') {
      eventTypeMultiplier = 11.2;
    } else {
      eventTypeMultiplier = 4;
    }

    if (this.f.cantor.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.lector1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.lector2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC4.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC5.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC6.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.eMoHC7.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.gifts.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.giftsChild.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.rosary1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.rosary2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher4.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.usher5.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.massCord.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.server3.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.tech1.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.f.tech2.value !== '') {
      this.prBarCounter = this.prBarCounter + eventTypeMultiplier;
    }

    if (this.prBarCounter >= 100) {
      this.prBarCounter = 100;
      this.eventIsFull = true;
      this.eventEditForm.controls['isFull'].patchValue(true);
    } else {
      this.eventIsFull = false;
    }
  }

  onSubmit({ value, valid }: { value: Event; valid: boolean }) {
    if (!valid && !this.incompleteEventApproval) {
      this.modalToggle('Event Form Error');
      this.showModalErrorText('Form Invalid');
      return;
    } else if (!this.duplicateVolunteerApproval) {
      this.checkForDuplicates();
      if (this.hasDuplicateLector) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate lectors!');
        return;
      }

      if (this.hasDuplicateEMoHC) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate EMoHCs!');
        return;
      }

      if (this.hasDuplicateServer) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate servers!');
        return;
      }

      if (this.hasDuplicateUsher) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate ushers!');
        return;
      }

      if (this.hasDuplicateRosary) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate rosary!');
        return;
      }

      if (this.hasDuplicateTech) {
        this.modalToggle(this.modalHeaderVolError);
        this.showModalErrorText('You have duplicate technology!');
        return;
      }

      if (!this.incompleteEventApproval)
        this.checkStaffingLevel(this.currentEventType);
      if (this.prBarCounter < 100) {
        this.eventIsFull = false;
        this.eventEditForm.controls['isFull'].patchValue(false);
      } else {
        this.eventIsFull = true;
        this.eventEditForm.controls['isFull'].patchValue(true);
      }
    }
    this.eventsService.updateEvent(value);
    this.showToastrSuccess('Success', 'New Event Added!');
    this.router.navigate(['/events']);
  }

  // Sets active class on Tab HTML
  tabSelect(tab: number) {
    this.tabChoice = tab;
  }

  // Shows & Hides Model for Errors
  modalToggle(val: string) {
    this.modalHeaderText = val;
    this.showModal = !this.showModal;
  }

  showModalErrorText(err: string) {
    this.modalErrorText = err;
  }
}
