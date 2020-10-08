import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Forms Modules
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Standard Modules
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Third Party Modules
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

// Angular Fire Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// Navigation Components
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';

// Auth Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Events Components
import { EventsComponent } from './components/events/events.component';
import { AddEventComponent } from './components/events/add-event/add-event.component';
import { DetailEventComponent } from './components/events/detail-event/detail-event.component';
import { EditEventComponent } from './components/events/edit-event/edit-event.component';

// Family ID Components
import { FamilyIdsComponent } from './components/family-ids/family-ids.component';
import { AddFamilyIdComponent } from './components/family-ids/add-family-id/add-family-id.component';
import { DetailFamilyIdComponent } from './components/family-ids/detail-family-id/detail-family-id.component';
import { EditFamilyIdComponent } from './components/family-ids/edit-family-id/edit-family-id.component';

// Volunteers Components
import { VolunteersComponent } from './components/volunteers/volunteers.component';
import { AddVolunteerComponent } from './components/volunteers/add-volunteer/add-volunteer.component';
import { DetailVolunteerComponent } from './components/volunteers/detail-volunteer/detail-volunteer.component';
import { EditVolunteerComponent } from './components/volunteers/edit-volunteer/edit-volunteer.component';

// Table Components
import { EventTableComponent } from './components/tables/event-table/event-table.component';
import { FamilyIdTableComponent } from './components/tables/family-id-table/family-id-table.component';
import { VolunteerTableComponent } from './components/tables/volunteer-table/volunteer-table.component';

// Auth Modules
import { AuthService } from './services/auth.service';
import { AuthGuard } from './components/auth/auth-guard';
import { LoadingComponent } from './components/loading/loading.component';

import { PhonePipe } from './pipes/phone-pipe';
import { RoundNumberPipe } from './pipes/round-number-pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    LoadingComponent,
    EventTableComponent,
    FamilyIdTableComponent,
    VolunteerTableComponent,
    DashboardComponent,
    EventsComponent,
    AddEventComponent,
    DetailEventComponent,
    EditEventComponent,
    FamilyIdsComponent,
    AddFamilyIdComponent,
    DetailFamilyIdComponent,
    EditFamilyIdComponent,
    VolunteersComponent,
    AddVolunteerComponent,
    DetailVolunteerComponent,
    EditVolunteerComponent,
    RoundNumberPipe,
    PhonePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],
  exports: [AppRoutingModule],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
