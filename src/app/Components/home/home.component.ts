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
  topArtists:String[];
  constructor(private router: Router, private http: HttpClient) {
    if (typeof getHashParams()['access_token'] !== 'undefined') {
      
      this.http.get('https://api.spotify.com/v1/me', {
        headers:
          { 'Authorization': 'Bearer ' + getHashParams()['access_token'] }
      }
      ).subscribe(profileRes => {
        this.username = profileRes["display_name"];
        this.id = profileRes["id"];
        this.http.get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10',{
          headers:
          { 'Authorization': 'Bearer ' + getHashParams()['access_token'] }
        }).subscribe(topArtistRes=>{
          this.topArtists = topArtistRes["items"].map((artist)=>{return artist.name});
          localStorage.setItem("user", JSON.stringify(profileRes));
          localStorage.setItem("top-artists", JSON.stringify(this.topArtists));
        });
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:4200/";
  }

}
