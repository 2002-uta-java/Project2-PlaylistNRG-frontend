import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  bsModalRef: BsModalRef;
  groups = [];
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: "group-modal"
  };
  constructor(private modalService: BsModalService, private router: Router, private http: HttpClient) {
    //if the token doesn't exist in local storage (user just logged in):
    //store access token in variable
    let auth = getHashParams()['access_token'];
    //if the token isn't undefined
    if (typeof auth !== 'undefined') {
      //persist 
      localStorage.setItem("Authorization", auth);
      this.http.get('https://api.spotify.com/v1/me', {
        headers:
          { 'Authorization': 'Bearer ' + auth }
      }
      ).subscribe(profileRes => {
        let spotifyId = profileRes["id"];
        //validate user based on spotify id
        this.validateUser(spotifyId).then((user) => {
          //set app user id from backend
          profileRes = {
            ...profileRes,
            appUserId: user["User"].id
          }
          //put user data in local storage
          localStorage.setItem("user", JSON.stringify(profileRes));
          this.groups = user["Groups"];
          this.router.navigate(['/group']);
        });
      });
    } else {
      //send user to login if the token is undefined
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

  //checks if a user exists in backend and creates a user if it doesn't
  async validateUser(spotifyId: string) {
    return this.http.get(
      "http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/user/spot/"
      + spotifyId).toPromise().then((response) => {
        return response;
      }, (error) => {
        console.log(error);
        return this.newUser(spotifyId);
      });
  }

  //creates new user in backend
  async newUser(spotifyId: string) {
    return await this.http.post("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/user",
      spotifyId).toPromise();
  }

  newGroup(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, this.config);
  }

  sendHome(group) {
    console.log(group);
    this.router.navigate(["/home"]);
  }
}
