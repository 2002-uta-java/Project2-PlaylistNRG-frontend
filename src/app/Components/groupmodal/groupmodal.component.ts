import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-groupmodal',
  templateUrl: './groupmodal.component.html',
  styleUrls: ['./groupmodal.component.css']
})
export class GroupmodalComponent implements OnInit {
  @Input() modal;
  @Input() groups;
  //output has to be named exactly like the input + Change in order to enable 2 way binding
  @Output() groupsChange = new EventEmitter<any>();
  role: string = "Employee";
  passcode: string;
  name: string;
  emails: string[];
  appUserId: number;
  constructor(private http: HttpClient) {
    this.appUserId = JSON.parse(localStorage.getItem("user"))["appUserId"];
  }

  ngOnInit(): void {
  }

  joinGroup(passcode: string) {
    //GET request to check if group with passcode exists
    this.http.get("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/group/pass/"
      + passcode).subscribe((response) => {
        let group = response["Group"];
        //POST request to add user to group
        if (group !== null) {
          this.http.put("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/user/"
            + this.appUserId,
            group["id"]).subscribe(() => {
              this.updateGroups(group);
            });
        }
      });
  }

  createGroup() {
    //POST request to create new group
    this.http.post("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/group",
      {
        name: this.name,
        passcode: this.passcode,
        managerId: this.appUserId
      }).subscribe(() => {
        this.joinGroup(this.passcode);
      });
  }

  updateGroups(newGroup) {
    localStorage.setItem("role", this.role);
    this.groups = [...this.groups, newGroup];
    this.groupsChange.emit(this.groups);
    this.modal.hide();
  }
}
