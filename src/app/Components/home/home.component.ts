import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ShortenPipe } from '../../Pipes/shorten.pipe';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  username: String;
  id: number;
  teamTracks: String[];
  personalTracks: String[];
  //init value for testing
  role: String = "Manager";
  //request data for testing
  requests = [
    {
      employeeName: "Mila",
      date: "3/17/2020",
      artist: "Croatian Amor",
      title: "iPhone Flashes Lead the Way to the Underground Clubs"
    },
    {
      employeeName: "Mila",
      date: "3/17/2020",
      artist: "DJ Loser",
      title: "Kawasaki Outrun"
    }
  ];
  constructor(private router: Router, private http: HttpClient) {
    //get OAuth token from local storage
    let auth: string = localStorage.getItem("Authorization");
    //check if the token exists
    if (auth !== null) {
      //if the token is persisted in local storage (user logged in and refreshed):
      //get persisted user data from Spotify
      let user: Object = JSON.parse(localStorage.getItem("user"));
      //get persisted top tracks from Spotify
      let teamTracks: String[] = JSON.parse(localStorage.getItem("team-tracks"));
      let personalTracks: String[] = JSON.parse(localStorage.getItem("personal-tracks"));
      //set user name
      this.username = user["display_name"];
      //set user id
      this.id = user["id"];
      //set top tracks
      this.teamTracks = teamTracks;
      this.personalTracks = personalTracks;
    } else {
      //if the token doesn't exist in local storage (user just logged in):
      //store access token in variable
      auth = getHashParams()['access_token'];
      //if the token isn't undefined
      if (typeof auth !== 'undefined') {
        //persist 
        localStorage.setItem("Authorization", auth);
        this.http.get('https://api.spotify.com/v1/me', {
          headers:
            { 'Authorization': 'Bearer ' + auth }
        }
        ).subscribe(profileRes => {
          this.username = profileRes["display_name"];
          this.id = profileRes["id"];
          this.http.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
            headers:
              { 'Authorization': 'Bearer ' + auth }
          }).subscribe(topTracksRes => {
            localStorage.setItem("user", JSON.stringify(profileRes));
            this.teamTracks = topTracksRes["items"].map((track) => {
              return {
                artist: track.artists[0].name,
                title: track.name,
                image: track.album.images[1].url
              }
            });
            this.personalTracks = this.teamTracks.filter((item, index) => { return index >= 5 });
            localStorage.setItem("team-tracks", JSON.stringify(this.teamTracks));
            localStorage.setItem("personal-tracks", JSON.stringify(this.personalTracks));
            this.router.navigate(['/home']);
          });
        });
      } else {
        //send user to login if the token is undefined
        this.router.navigate(['/login']);
      }
    }
  }

  onLogout() {
    localStorage.clear();
    window.location.href = "http://localhost:4200/";
  }

  submitSongRequest() {
    console.log("Request sent.");
  }

}
