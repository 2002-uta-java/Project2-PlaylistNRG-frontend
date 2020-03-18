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

  updateSongRequest(id, status:string){
    let index = id.substring(7,id.length);
    this.requests[index].status = status;
  }

  createPlaylist(){
    console.log("Playlist created.");
    //TODO: POST request to https://api.spotify.com/v1/users/{user_id}/playlists
    //TODO: POST request to https://api.spotify.com/v1/playlists/{playlist_id}/tracks
  }
}
