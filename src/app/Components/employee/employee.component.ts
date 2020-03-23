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
  requests = [];
  results: any;
  group:object;
  requestedSong: any;
  user:object;
  constructor(private router: Router, private http: HttpClient) { 
    this.group = JSON.parse(localStorage.getItem("group"))["id"];
    this.http.get("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/request/"
    +this.group).subscribe((response)=>{
      let auth = localStorage.getItem("Authorization");
      this.user = JSON.parse(localStorage.getItem("user"));
      for(let request of response["RequestedTracks"]){
        this.getRequestedTrackInfo(this.user["id"], request, auth).then((results)=>{
          let [user, track] = results;
          this.requests = [...this.requests, {
            employeeName: [user["display_name"]],
            artist: track["artists"][0].name,
            title: track["name"],
            status: request["status"]
          }]
        });
      }
    })
  }

  ngOnInit(): void {
  }

  submitSongRequest() {
    let name = JSON.parse(localStorage.getItem("user"))["display_name"].split(" ")[0];
    this.requestedSong = {
      ...this.requestedSong,
      employeeName: name,
      status: "Pending"
    }
    this.requests = [...this.requests, this.requestedSong];
    let request = {
      employeeId: this.user["appUserId"],
      spotifyPopularity: this.requestedSong["popularity"],
      spotifyTrackId: this.requestedSong["id"],
      status: this.requestedSong["status"]
    }
    this.http.post("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/request/"
    +this.user["appUserId"], request).subscribe();
  }

  setRequestedSong(index) {
    this.requestedSong = this.results[index];
  }

  searchTracks(query) {
    if (query.length > 0) {
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
            explicit: item.explicit,
            popularity: item["popularity"]
          }
        });
      }, (error) => {
        localStorage.clear();
        this.router.navigate(['/login','token=expired']);
      })
    }
  }

  async getSpotifyTrack(trackId, auth) {
    return await this.http.get("https://api.spotify.com/v1/tracks/" + trackId, {
        headers:
          { 'Authorization': 'Bearer ' + auth }
      }).toPromise();
  }

  async getUserById(id, auth){
    return await this.http.get("https://api.spotify.com/v1/users/"
    +id, {
      headers:
        { 'Authorization': 'Bearer ' + auth }
    }).toPromise();
  }

  async getRequestedTrackInfo(id, request, auth){
    return await Promise.all([
      this.getUserById(id, auth), 
      this.getSpotifyTrack(request["spotifyTrackId"],auth)
    ]);
  }
}
