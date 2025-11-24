import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import Forms

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  router = inject(Router);

  // Form Data
  user = {
    username: '',
    email: '',
    password: '',
    role: 'USER',
  };

  onRegister() {
    this.http
      .post('http://localhost:8080/api/user/register', this.user, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert(res);
          this.router.navigate(['/login']); // Go to login after success
        },
        error: (err) => alert('Registration Failed'),
      });
  }
}
