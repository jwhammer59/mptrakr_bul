import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  headerTitle = 'Events Page';
  headerIcon = 'far fa-lg fa-calendar-alt';
  constructor() {}

  ngOnInit(): void {}
}
