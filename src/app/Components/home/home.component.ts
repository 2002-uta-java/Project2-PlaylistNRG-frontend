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
  image: String;
  constructor(private router: Router, private http: HttpClient) {
    if (typeof getHashParams()['access_token'] !== 'undefined') {
      this.http.get('https://api.spotify.com/v1/me', {
        headers:
          { 'Authorization': 'Bearer ' + getHashParams()['access_token'] }
      }
      ).subscribe(response => {
        localStorage.setItem("user", JSON.stringify(response));
        this.username = response["display_name"];
        this.id = response["id"];
        this.image = response["images"][0].url;
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
