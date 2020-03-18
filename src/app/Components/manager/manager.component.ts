import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['../styles/dashboard.css']
})
export class ManagerComponent implements OnInit {
  @Input() role: string;
  @Input() requests;
  constructor() { }

  ngOnInit(): void {
  }

  updateSongRequest(id, status:string){
    let index = id.substring(7,id.length);
    this.requests[index].status = status;
  }
}
