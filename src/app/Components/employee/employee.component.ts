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
  requestedSong:any;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  submitSongRequest() {
    console.log("Request sent.");
  }

  setRequestedSong(index){
    this.requestedSong = this.results[index];
  }

  searchTracks(query) {
    let auth = localStorage.getItem("Authorization");
    this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=track&market=US`, {
      headers:
        { 'Authorization': 'Bearer ' + auth },
      observe: 'response'
    }).subscribe((response) => {
      if (response.status === 200) {
        this.results = response.body["tracks"].items.map((item) => {
          return {
            artist: item.artists[0].name,
            title: item.name,
            id: item.id,
            thumbnail: item.album.images[1].url,
            explicit: item.explicit
          }
        });
      } else{
        this.router.navigate(['/login']);
      }
    })
  }
}
