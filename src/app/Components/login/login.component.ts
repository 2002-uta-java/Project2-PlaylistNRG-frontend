import { Component, OnInit } from '@angular/core';

function getHashParams() {
  var params = {};
	var parser = document.createElement('a');
	parser.href = window.location.href;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: [
    `
  :host >>> .alert-md-local {
    position:fixed;
    top: 0;
    left: 50%;
    background-color: #DB3030;
    border-color: #0F1020;
    color: #F7F0F5;
    width: 50%;
    transform: translate(-50%, 0);
  }
  `
  ]
})
export class LoginComponent implements OnInit{
  showAlert:boolean = false;
  constructor() {}

  ngOnInit(): void{
    if(getHashParams()["token"] === "expired"){
      this.showAlert = true;
    } else{
      this.showAlert = false;
    }
  }

  onLogin(): void {
    let client_id = '84e1693d831742689c2157b5bd0079bc';
    let redirect_uri = 'http://localhost:4200/group';
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
