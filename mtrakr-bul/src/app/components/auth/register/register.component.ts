import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { MustMatch } from '../../../validators/must-match.validator';
import { User } from '../../../models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showModal: boolean = false;
  modalErrorText: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'passwordConfirm'),
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  getEmailErrorMessage() {
    return this.f.email.hasError('required')
      ? 'You must enter a value'
      : this.f.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getPasswordErrorMessage() {
    return this.f.password.hasError('required')
      ? 'You must enter a value'
      : this.f.password.hasError('minlength')
      ? 'Password must be at least 6 characters'
      : '';
  }

  getPasswordConfirmErrorMessage() {
    return this.f.passwordConfirm.hasError('required')
      ? 'You must enter a value'
      : this.f.passwordConfirm.hasError('mustMatch')
      ? 'Password must match'
      : '';
  }

  modalToggle() {
    this.showModal = !this.showModal;
  }

  showModalErrorText(err: string) {
    this.modalErrorText = err;
  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
    this.authService
      .register(this.f.email.value, this.f.password.value)
      .then((res) => {
        this.router.navigate(['/events']);
      })
      .catch((err) => {
        this.modalToggle();
        this.showModalErrorText(err);
      });
  }
}
