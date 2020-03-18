import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() role: string;
  @Input() requests;
  constructor() { }

  ngOnInit(): void {
  }

  submitSongRequest() {
    console.log("Request sent.");
  }
}
