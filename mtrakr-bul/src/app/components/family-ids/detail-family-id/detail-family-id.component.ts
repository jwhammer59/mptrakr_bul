import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-family-id',
  templateUrl: './detail-family-id.component.html',
  styleUrls: ['./detail-family-id.component.scss'],
})
export class DetailFamilyIdComponent implements OnInit {
  headerTitle = 'Family ID Detail Page';
  headerIcon = 'fas fa-lg fa-info-circle';

  constructor() {}

  ngOnInit(): void {}
}
