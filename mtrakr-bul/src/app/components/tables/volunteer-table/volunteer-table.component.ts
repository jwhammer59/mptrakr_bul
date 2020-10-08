import { Component, OnInit } from '@angular/core';

import { Volunteer } from 'src/app/models/Volunteer';
import { VolunteersService } from 'src/app/services/volunteers.service';

@Component({
  selector: 'app-volunteer-table',
  templateUrl: './volunteer-table.component.html',
  styleUrls: ['./volunteer-table.component.scss'],
})
export class VolunteerTableComponent implements OnInit {
  volunteers: Volunteer[];
  volunteer: Volunteer;

  p: number = 1;
  numPerPage: number = 5;

  constructor(private volunteersService: VolunteersService) {}

  ngOnInit(): void {
    this.volunteersService.getVolunteers().subscribe((volunteers) => {
      this.volunteers = volunteers;
    });
  }

  updateItemsPerPage(e) {
    this.numPerPage = e.target.value;
  }
}
