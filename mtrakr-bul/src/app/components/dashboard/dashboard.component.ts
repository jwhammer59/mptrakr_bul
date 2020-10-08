import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  headerTitle = 'Dashboard Page';
  headerIcon = 'fas fa-columns';
  constructor() {}

  ngOnInit(): void {}
}
