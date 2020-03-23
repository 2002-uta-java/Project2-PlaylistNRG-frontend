import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  username: string;
  id: number;
  role: string;
  group: string;
  requests = [];
  personalTracks: object[];
  teamTracks: object[];
  constructor(private router: Router, private http: HttpClient) {
    //get current group
    this.group = localStorage.getItem("group")["id"];
    //get user role
    this.role = localStorage.getItem("role");
    //get OAuth token from local storage
    let auth: string = localStorage.getItem("Authorization");
    //check if the token exists
    if (auth !== null) {
      //if the token is persisted in local storage (user logged in and refreshed):
      //get persisted user data from Spotify
      let user: Object = JSON.parse(localStorage.getItem("user"));
      this.personalTracks = JSON.parse(localStorage.getItem("personal-tracks"));
      this.teamTracks = JSON.parse(localStorage.getItem("team-tracks"));
      //set user name
      this.username = user["display_name"];
      //set user id
      this.id = user["id"];
      //get top 10 tracks based on occurrence/popularity
      this.teamTracks = this.filterTeamTracks(this.teamTracks);
    } else {
      //send user to login if the token is undefined
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  filterTeamTracks(tracks) {
    //get track occurrence
    let occurrence = tracks.reduce((accumulator, obj) => {
      if (typeof accumulator[obj["id"]] === 'undefined') {
        accumulator[obj["id"]] = 1;
      } else {
        accumulator[obj["id"]]++;
      }
      return accumulator;
    }, {})
    //add occurrence to tracks
    for(let prop in occurrence){
      let track = tracks.find((item)=>{return item["id"]===prop});
      tracks[tracks.indexOf(track)] = {
        ...tracks[tracks.indexOf(track)],
        occurrence : occurrence[prop]
      };
    }
    //sort by occurrence or by popularity if occurence is equal
    tracks = tracks.sort((a,b)=>{
      if(a["occurrence"] === b["occurrence"]){
        return b["popularity"] - a["popularity"];
      } else{
        return b["occurrence"] - a["occurrence"];
      }
    });
    return tracks.slice(0, 10);
  }
}
