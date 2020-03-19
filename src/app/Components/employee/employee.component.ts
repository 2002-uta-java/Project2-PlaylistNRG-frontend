import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() role: string;
  @Input() requests;
  results: any;
  requestedSong: any;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  submitSongRequest() {
    let name = JSON.parse(localStorage.getItem("user"))["display_name"].split(" ")[0];
    let date = new Date();
    this.requestedSong = {
      ...this.requestedSong,
      employeeName:name,
      date:date.toLocaleDateString(),
      status:"Pending"
    }
    this.requests = [...this.requests, this.requestedSong];
  }

  setRequestedSong(index) {
    this.requestedSong = this.results[index];
  }

  searchTracks(query) {
    let auth = localStorage.getItem("Authorization");
    this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=track&market=US`, {
      observe: 'response',
      headers:
        { 'Authorization': 'Bearer ' + auth }
    }).subscribe((response) => {
      this.results = response.body["tracks"].items.map((item) => {
        return {
          artist: item.artists[0].name,
          title: item.name,
          id: item.id,
          thumbnail: item.album.images[1].url,
          explicit: item.explicit
        }
      });
    },(error)=>{
      console.log(error);
      localStorage.clear();
      this.router.navigate(['/login']);
    })
  }
}
