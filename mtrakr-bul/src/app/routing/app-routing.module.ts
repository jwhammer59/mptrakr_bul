import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { EventsComponent } from '../components/events/events.component';
import { AddEventComponent } from '../components/events/add-event/add-event.component';
import { EditEventComponent } from '../components/events/edit-event/edit-event.component';
import { DetailEventComponent } from '../components/events/detail-event/detail-event.component';
import { VolunteersComponent } from '../components/volunteers/volunteers.component';
import { AddVolunteerComponent } from '../components/volunteers/add-volunteer/add-volunteer.component';
import { EditVolunteerComponent } from '../components/volunteers/edit-volunteer/edit-volunteer.component';
import { DetailVolunteerComponent } from '../components/volunteers/detail-volunteer/detail-volunteer.component';
import { FamilyIdsComponent } from '../components/family-ids/family-ids.component';
import { AddFamilyIdComponent } from '../components/family-ids/add-family-id/add-family-id.component';
import { EditFamilyIdComponent } from '../components/family-ids/edit-family-id/edit-family-id.component';
import { DetailFamilyIdComponent } from '../components/family-ids/detail-family-id/detail-family-id.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AuthGuard } from '../components/auth/auth-guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'events', component: EventsComponent },
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard] },
  {
    path: 'edit-event/:id',
    component: EditEventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-event/:id',
    component: DetailEventComponent,
    canActivate: [AuthGuard],
  },
  { path: 'volunteers', component: VolunteersComponent },
  {
    path: 'add-volunteer',
    component: AddVolunteerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-volunteer/:id',
    component: EditVolunteerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-volunteer/:id',
    component: DetailVolunteerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'family-ids', component: FamilyIdsComponent },
  {
    path: 'add-family-id',
    component: AddFamilyIdComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-family-id/:id',
    component: EditFamilyIdComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-family-id/:id',
    component: DetailFamilyIdComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
