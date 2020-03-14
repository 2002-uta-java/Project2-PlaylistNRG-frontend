import { Component } from '@angular/core';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  username: String;
  id: number;
  topTracks: String[];
  constructor(private router: Router, private http: HttpClient) {
    let auth:string = localStorage.getItem("Authorization");
    if (auth !== null) {
        let user: Object = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        let topTracks: String[] = JSON.parse(localStorage.getItem("top-tracks"));
        this.username = user["display_name"];
        this.id = user["id"];
        this.topTracks = topTracks;
    } else {
      auth = getHashParams()['access_token'];
      if (typeof auth !== 'undefined') {
        localStorage.setItem("Authorization", auth);
        this.http.get('https://api.spotify.com/v1/me', {
          headers:
            { 'Authorization': 'Bearer ' + auth }
        }
        ).subscribe(profileRes => {
          this.username = profileRes["display_name"];
          this.id = profileRes["id"];
          console.log()
          this.http.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
            headers:
              { 'Authorization': 'Bearer ' + auth }
          }).subscribe(topTracksRes => {
            localStorage.setItem("user", JSON.stringify(profileRes));
            this.topTracks = topTracksRes["items"].map((track) => {
              return {
                artist: track.artists[0].name,
                title: track.name,
                image: track.album.images[1].url
              }
            });
            localStorage.setItem("top-tracks", JSON.stringify(this.topTracks));
            this.router.navigate(['/home']);
          });
        });
      }
      this.router.navigate(['/login']);
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
