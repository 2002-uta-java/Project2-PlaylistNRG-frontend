import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor() {
  }

  ngOnInit(): void{
    
  }

  onLogin(): void {
    let client_id = '84e1693d831742689c2157b5bd0079bc';
    let redirect_uri = 'http://localhost:4200/home';
    let scope = 'user-read-private user-read-email user-top-read';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&state=1234';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&show_dialog=true';
    window.location.href = url;
  }

}
