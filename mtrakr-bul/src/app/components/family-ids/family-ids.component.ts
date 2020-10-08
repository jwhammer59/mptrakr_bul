import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-ids',
  templateUrl: './family-ids.component.html',
  styleUrls: ['./family-ids.component.scss'],
})
export class FamilyIdsComponent implements OnInit {
  headerTitle = 'Family ID Page';
  headerIcon = 'far fa-lg fa-id-card';

  constructor() {}

  ngOnInit(): void {}
}
