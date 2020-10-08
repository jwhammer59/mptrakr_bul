import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss'],
})
export class VolunteersComponent implements OnInit {
  headerTitle = 'Volunteers Page';
  headerIcon = 'fas fa-lg fa-users';
  constructor() {}

  ngOnInit(): void {}
}
