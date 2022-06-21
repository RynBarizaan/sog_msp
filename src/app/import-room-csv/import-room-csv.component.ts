import { Component, OnInit } from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {csvRecord} from "../model/csv-record";
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-import-room-csv',
  templateUrl: './import-room-csv.component.html',
  styleUrls: ['./import-room-csv.component.css']
})
export class ImportRoomCsvComponent implements OnInit {

  constructor(public mainmenuComponent: MainmenuComponent ) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.mainmenuComponent.closeModalRoom();
  }


}
