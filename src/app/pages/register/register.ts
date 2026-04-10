import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AuthService } from '../../services/auth.service';

const ALL_NATIONALITIES: string[] = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan',
  'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian',
  'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean',
  'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Botswanan', 'Brazilian',
  'Bruneian', 'Bulgarian', 'Burkinabe', 'Burundian', 'Cambodian', 'Cameroonian',
  'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese',
  'Colombian', 'Comorian', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban',
  'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch', 'Ecuadorian',
  'Egyptian', 'Emirati', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian',
  'Fijian', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German',
  'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinean', 'Guinea-Bissauan',
  'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelander', 'Indian',
  'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian',
  'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kiribatian',
  'Kuwaiti', 'Kyrgyz', 'Lao', 'Latvian', 'Lebanese', 'Lesothan', 'Liberian',
  'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourgish', 'Macedonian',
  'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese',
  'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan',
  'Monegasque', 'Mongolian', 'Montenegrin', 'Moroccan', 'Mozambican', 'Myanmarese',
  'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian',
  'Nigerien', 'North Korean', 'Norwegian', 'Omani', 'Pakistani', 'Palauan',
  'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian',
  'Filipino', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan',
  'Saint Kittsian', 'Saint Lucian', 'Saint Vincentian', 'Samoan', 'San Marinese',
  'Sao Tomean', 'Saudi', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean',
  'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali', 'South African',
  'South Korean', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese',
  'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai',
  'Timorese', 'Togolese', 'Tongan', 'Trinidadian', 'Tunisian', 'Turkish', 'Turkmen',
  'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbek', 'Vanuatuan', 'Venezuelan',
  'Vietnamese', 'Yemeni', 'Zambian', 'Zimbabwean'
];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatAutocompleteModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  errorMessage = '';

  filteredNationalities: string[] = ALL_NATIONALITIES;

  filterNationalities(value: string): void {
    const filter = (value ?? '').toLowerCase();
    this.filteredNationalities = ALL_NATIONALITIES.filter(n => n.toLowerCase().includes(filter));
  }

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    roles: [['PASSENGER'] as string[]],

    position: [''],
    department: [''],
    grade: [''],
    hireDate: [null as Date | null],
    docType: ['', Validators.required],
    docNumber: ['', Validators.required],
    nationality: ['', Validators.required],
    loyaltyTier: [''],
    emergencyContact: ['']
  });

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.value;
    this.authService.register({
      email: raw.email!,
      phone: raw.phone!,
      password: raw.password!,
      roles: raw.roles ?? [],
      position: raw.position ?? undefined,
      department: raw.department ?? undefined,
      grade: raw.grade ?? undefined,
      hireDate: raw.hireDate ? (raw.hireDate as Date).toISOString().split('T')[0] : undefined,
      docType: raw.docType ?? undefined,
      docNumber: raw.docNumber ?? undefined,
      nationality: raw.nationality ?? undefined,
      loyaltyTier: raw.loyaltyTier ?? undefined,
      emergencyContact: raw.emergencyContact ?? undefined,
    }).subscribe({
      next: () => this.router.navigate(['/search-flights']),
      error: () => { this.errorMessage = 'Registration failed. Please try again.'; }
    });
  }

  goBack() {
    this.router.navigate(['/search-flights']);
  }
}
