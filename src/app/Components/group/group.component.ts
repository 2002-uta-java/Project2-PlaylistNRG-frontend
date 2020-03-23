import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  bsModalRef: BsModalRef;
  groups = [];
  teamTracks: object[];
  personalTracks: object[];
  auth: string;
  user: object;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true,
    class: "group-modal"
  };
  constructor(private modalService: BsModalService, private router: Router, private http: HttpClient) {
    //if the token doesn't exist in local storage (user just logged in):
    //store access token in variable
    this.auth = getHashParams()['access_token'];
    //if the token isn't undefined
    if (typeof this.auth !== 'undefined') {
      //persist 
      localStorage.setItem("Authorization", this.auth);
      this.http.get('https://api.spotify.com/v1/me', {
        headers:
          { 'Authorization': 'Bearer ' + this.auth }
      }
      ).subscribe(profileRes => {
        let spotifyId = profileRes["id"];
        //validate user based on spotify id
        this.validateUser(spotifyId).then((user) => {
          //set app user id from backend
          profileRes = {
            ...profileRes,
            appUserId: user["User"].id
          }
          this.user = profileRes;
          //put user data in local storage
          localStorage.setItem("user", JSON.stringify(this.user));
          this.batchRequestGroupNames(user["groups"]).then((response) => {
            this.groups = response.map((item) => {
              return {
                name: item["Group"].name,
                id: item["Group"].id,
                manager: item["Group"].managerId
              };
            });
            //1. get personal top tracks from spotify
            //2. set personal top tracks in backend
            this.getPersonalTracks(this.auth).then((personalResponse) => {
              this.personalTracks = personalResponse;
              localStorage.setItem("personal-tracks", JSON.stringify(this.personalTracks));
              this.setPersonalTracks(this.user["appUserId"]).then(() => {
                this.router.navigate(['/group']);
              })
            })
          });
        });
      });
    } else {
      //send user to login if the token is undefined
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

  /*-------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ------------------------------------------GROUP FUNCTIONS------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------*/


  //checks if a user exists in backend and creates a user if it doesn't
  async validateUser(spotifyId: string) {
    return this.http.get(
      "http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/user/spot/"
      + spotifyId).toPromise().then((response) => {
        return response;
      }, (error) => {
        console.log(error);
        return this.newUser(spotifyId);
      });
  }

  //creates new user in backend
  async newUser(spotifyId: string) {
    return await this.http.post("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/user",
      spotifyId).toPromise();
  }

  newGroup(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, this.config);
  }

  batchRequestGroupNames(groups) {
    if (typeof groups === 'undefined') { groups = null }
    let requests = groups === null ? [] : groups.map((item) => {
      return this.http.get("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/group/"
        + item[0]
      ).toPromise();
    });
    return Promise.all(requests);
  }

  /*-------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ------------------------------------------TRACK FUNCTIONS------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------------*/


  async getPersonalTracks(auth: string) {
    return await this.http.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
      headers:
        { 'Authorization': 'Bearer ' + auth }
    }).toPromise().then((response) => {
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

  async setPersonalTracks(appUserId) {
    let toptracks = this.personalTracks.map((item) => {
      return {
        spotifyTrackId: item["id"],
        spotifyPopularity: item["popularity"]
      };
    });
    return await this.http.post("http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/toptracks/"
      + appUserId, toptracks).toPromise();
  }

  async getTeamTracks(group) {
    return await this.http.get('http://ec2-18-191-161-102.us-east-2.compute.amazonaws.com:8090/PlaylistNRG/toptracks/group/'
      + group).toPromise();
  }

  async batchGetSpotifyTracks(trackIds, auth) {
    return await Promise.all(trackIds.map((item) => {
      return this.http.get("https://api.spotify.com/v1/tracks/" + item["spotifyTrackId"], {
        headers:
          { 'Authorization': 'Bearer ' + auth }
      }).toPromise()
    }));
  }

  sendHome(name) {
    let group = this.groups.find((item) => { return item["name"] === name });
    if(this.user["appUserId"] === group.manager){
      localStorage.setItem("role", "Manager");
    }
    localStorage.setItem("group", JSON.stringify(group));
    //get team's top tracks
    this.getTeamTracks(group["id"]).then((response) => {
      let tracks = response["SpotifyTracks"];
      this.batchGetSpotifyTracks(tracks, this.auth).then((batchResponse) => {
        this.teamTracks = batchResponse.map((item) => {
          return {
            title: item["name"],
            artist: item["artists"][0].name,
            popularity: item["popularity"],
            id: item["id"],
            thumbnail: item["album"].images[1].url,
            uri: item["uri"]
          }
        })
        this.teamTracks = this.teamTracks.length > 10 ? [...this.teamTracks, this.personalTracks] : this.teamTracks;
        localStorage.setItem("team-tracks", JSON.stringify(this.teamTracks));
        //send to home page
        this.router.navigate(["/home"]);
      });
    })
  }
}
