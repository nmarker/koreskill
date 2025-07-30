import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ErrorStateMatcher, MatNativeDateModule} from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {JsonPipe} from '@angular/common';
import { range } from 'rxjs';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8X3YDytQmblhgJD_mbgV9FPI8hWVZ86o",
  authDomain: "koreskills-6a127.firebaseapp.com",
  databaseURL: "https://koreskills-6a127-default-rtdb.firebaseio.com",
  projectId: "koreskills-6a127",
  storageBucket: "koreskills-6a127.firebasestorage.app",
  messagingSenderId: "563009415025",
  appId: "1:563009415025:web:72cf517ce344a1db1578d0",
  measurementId: "G-BEQF9DRVCS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //condition true
    const isSubmitted = form && form.submitted;
    //false
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  providers:[
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  imports: [
    NgIf,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    JsonPipe,
    MatDialogModule
  ],
})



export class AppComponent {
  //firstFormGroup!: FormGroup;
  //secondFormGroup!: FormGroup;
  //range!: FormGroup;

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog) {}

  
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  panelOpenState = false;
  title = 'koreskills';
  showDetails="";
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  ngOnInit(){}
  
  matcher = new MyErrorStateMatcher();

  firstFormGroup = this._formBuilder.group({
    fullName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    studentGrade: ['', Validators.required],
    studentName: ['', Validators.required],
    notes:[''],
  });


  skill = this._formBuilder.group({
    python: false,
    html: false,
  });
  

  fullname = "";
  phonenumber = "";
  emailaddress = "";
  studentgrade = "";
  studentname = "";
  skillinterestedin = "";
  notes = "";
  selectedChips: string[] = [];

  onStepChange(event: StepperSelectionEvent) {
  if (event.selectedIndex === 1) {
    this.showdetails(); // gather values from the form
  }
}

  showdetails(){
    this.showDetails =  JSON.stringify(this.firstFormGroup.value);
    console.log(this.firstFormGroup.value);
    this.fullname = String(this.firstFormGroup.value.fullName);
    this.phonenumber = String(this.firstFormGroup.value.phoneNumber);
    this.emailaddress = String(this.firstFormGroup.value.emailAddress);
    this.studentgrade = String(this.firstFormGroup.value.studentGrade);
    this.studentname = String(this.firstFormGroup.value.studentName);
    this.skillinterestedin = this.selectedChips.join(', ');
    this.notes = String(this.firstFormGroup.value.notes);
  }

  submit(stepper: any) {
    //throw new Error('Method not implemented.');
    //firstCtrl.useValue
    //console.log(this.firstFormGroup.value)
    //console.log(this.secondFormGroup.value)
    console.log(this.range.value)
    //console.log(this.skill.value)
    const db = getFirestore(app);
    const userData = {
      fullName: this.fullname,
      phoneNumber: this.phonenumber,
      emailAddress: this.emailaddress,
      studentGrade: this.studentgrade,
      studentName: this.studentname,
      skillInterestedIn: this.selectedChips,
      notes: this.notes,
      timestamp: new Date()
    };
    addDoc(collection(db, "submissions"), userData)
      .then(() => {
        console.log("Data submitted to Firebase");
        this.dialog.open(SubmissionDialog, {
          height: '400px',
          width: '600px',
          data: {
            onClose: () => {
              this.cleardata();
              stepper.reset();
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  cleardata(){
    this.fullname = "";
    this.phonenumber = "";
    this.emailaddress = "";
    this.studentgrade = "";
    this.studentname = "";
    this.skillinterestedin = "";
    this.notes = "";
  }
}


@Component({
  selector: 'submission-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="font-size: 24px;">🎉 Submission Successful</h2>
    <div style="font-size: 18px; padding: 50px;">
      Thank you for your interest! We’ll be in touch soon.
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <button mat-raised-button color="primary" (click)="close()">OK</button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class SubmissionDialog {
  constructor(
    public dialogRef: MatDialogRef<SubmissionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { onClose: () => void }
  ) {}

  close(): void {
    this.dialogRef.close();
    if (this.data?.onClose) {
      this.data.onClose();
    }
  }
}