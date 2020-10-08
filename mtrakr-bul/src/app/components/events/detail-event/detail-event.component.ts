import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Event } from 'src/app/models/Event';
import { EventsService } from 'src/app/services/events.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.scss'],
})
export class DetailEventComponent implements OnInit {
  headerTitle = 'Event Detail Page';
  headerIcon = 'far fa-lg fa-calendar-alt';

  tabChoice: number = 1;
  showDeleteModal: boolean = false;

  id: string;
  event: Event = {
    date: '',
    type: '',
    isFull: false,
    cantor: '',
    lector1: '',
    lector2: '',
    eMoHC1: '',
    eMoHC2: '',
    eMoHC3: '',
    eMoHC4: '',
    eMoHC5: '',
    eMoHC6: '',
    eMoHC7: '',
    gifts: '',
    giftsChild: '',
    rosary1: '',
    rosary2: '',
    other: '',
    usher1: '',
    usher2: '',
    usher3: '',
    usher4: '',
    usher5: '',
    massCord: '',
    server1: '',
    server2: '',
    server3: '',
    tech1: '',
    tech2: '',
  };
  constructor(
    private eventsService: EventsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.eventsService.getEvent(this.id).subscribe((event) => {
      this.event = event;
    });
  }

  modalToggle() {
    this.showDeleteModal = !this.showDeleteModal;
  }

  onDeleteClicked() {
    this.modalToggle();
  }

  // Sets active class on Tab HTML
  tabSelect(tab: number) {
    this.tabChoice = tab;
  }

  modalDeleteResponse(res: boolean) {
    if (res) {
      this.modalToggle();
      this.eventsService.deleteEvent(this.event);
      this.showToastrSuccess('Success', 'Event Deleted!');
      this.router.navigate(['/events']);
    } else {
      this.modalToggle();
    }
  }

  showToastrSuccess(title: string, val: string) {
    this.toastr.success(`${val}`, `${title}`, {
      timeOut: 2000,
      positionClass: 'toast-top-left',
    });
  }
}
