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
  teamTracks: string[];
  personalTracks: string[];
  role: string;
  group: string;
  //request data for testing
  requests = [
    {
      employeeName: "Mila",
      date: "3/17/2020",
      artist: "Croatian Amor",
      title: "iPhone Flashes Lead the Way to the Underground Clubs",
      status: "Pending"
    },
    {
      employeeName: "Mila",
      date: "3/17/2020",
      artist: "DJ Loser",
      title: "Kawasaki Outrun",
      status: "Pending"
    }
  ];
  constructor(private router: Router, private http: HttpClient) {
    //get current group
    this.group = localStorage.getItem("group");
    //get user role
    this.role = localStorage.getItem("role");
    //get OAuth token from local storage
    let auth: string = localStorage.getItem("Authorization");
    //check if the token exists
    if (auth !== null) {
      //if the token is persisted in local storage (user logged in and refreshed):
      //get persisted user data from Spotify
      let user: Object = JSON.parse(localStorage.getItem("user"));
      //get personal top tracks
      this.getPersonalTracks(auth).then((response)=>{
        this.personalTracks = response;
      });
      //get team's top tracks
      this.getTeamTracks().then((response)=>{
        //TODO: set team tracks
        //this.teamTracks = response;
      })
      //set user name
      this.username = user["display_name"];
      //set user id
      this.id = user["id"];
      //set top tracks
    } else {
      //send user to login if the token is undefined
      this.router.navigate(['/login']);
    }
  }

  async getPersonalTracks(auth:string){
    return await this.http.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
      headers:
        { 'Authorization': 'Bearer ' + auth }
    }).toPromise().then((response)=>{
      return response["items"].map((track) => {
        return {
          artist: track.artists[0].name,
          title: track.name,
          thumbnail: track.album.images[1].url,
          popularity: track.popularity,
          id: track.id
        }
      });
    });
  }

  async getTeamTracks(){
    return await this.http.get(''
    + this.group).toPromise().then((response)=>{
      //batch get tracks from spotify based on id
    });
  }

  onLogout() {
    localStorage.clear();
    window.location.href = "http://localhost:4200/";
  }

}
