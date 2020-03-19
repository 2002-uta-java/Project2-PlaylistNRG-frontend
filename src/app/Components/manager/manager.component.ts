import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  @Input() role: string;
  @Input() requests;
  @Input() teamTracks;
  constructor() { 
  }

  ngOnInit(): void {
  }

  updateSongRequest(index, status:string){
    this.requests[index].status = status;
    if(status === "Approved"){
      this.teamTracks = [...this.teamTracks, this.requests[index]];
    }
  }

  createPlaylist(){
    console.log("Playlist created.");
    //TODO: POST request to https://api.spotify.com/v1/users/{user_id}/playlists
    //TODO: POST request to https://api.spotify.com/v1/playlists/{playlist_id}/tracks
  }
}
