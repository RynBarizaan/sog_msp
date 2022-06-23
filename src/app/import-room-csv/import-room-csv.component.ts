import {Component, OnInit, ViewChild} from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {csvRecord} from "../model/csv-record";
import * as CryptoJS from "crypto-js";
import {utf8Encode} from "@angular/compiler/src/util";

@Component({
  selector: 'app-import-room-csv',
  templateUrl: './import-room-csv.component.html',
  styleUrls: ['./import-room-csv.component.css']
})
export class ImportRoomCsvComponent implements OnInit {

  roomElements: Array<any> =[];
  roomDetails: Array<any> =[];
  Decrypt: Array<any> = [];
  textToConvert!: string;
  password= "123";
  hide = true;
  messageIfNoFile!: string;
  csv = [];

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  // Import CSV File in Array
  uploadListener($event: any): void {

    let files = $event.srcElement.files;

      if(files && files.length > 0) {
        let file : File = files.item(0);
        console.log(file.name);
        console.log(file.size);
        console.log(file.type);

        let reader: FileReader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
          let csv: string = reader.result as string;
          console.log("\ufeff" + csv);
        }
    }

    if (this.isValidCSVFile(files[0]) ) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    }
    else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {

    console.log("is works 2");

    for (let i = 1; i < csvRecordsArray.length - 1; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(/\r\n|\n/);
      this.roomElements.push((CryptoJS.AES.decrypt(curruntRecord.toString(), this.password.trim()).toString(CryptoJS.enc.Utf8)));
      this.roomDetails = [];
    }

    if (this.roomElements.length==0 || this.roomElements==[] || this.roomElements==null ){
      this.messageIfNoFile = "Ausgewählt CSV Datei ist Leer";
      console.log("Error")
    }


      for (var x = 0; x < this.roomElements.length; x++) {
        this.roomDetails[x] = JSON.parse(this.roomElements[x]);
      }
      console.log(this.roomElements[0]);
      if (this.roomElements[0]=={width:""}){
        console.log("Falshe datei")
      }
      else {
      sessionStorage.setItem("roomDimension", JSON.stringify(this.roomDetails[0]));
      for (var x = 1; x < this.roomElements.length; x++) {
        this.roomDetails[x] = JSON.parse(this.roomElements[x]);
      }
      sessionStorage.setItem("room", JSON.stringify(this.roomDetails));
      this.fileReset();
      this.closeModal();
    }
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  fileReset() {
    this.csvReader.nativeElement.value = "";
  }

  constructor(public mainmenuComponent: MainmenuComponent ) { }

  ngOnInit(): void {
  }

  //close modal box
  closeModal() {
    this.mainmenuComponent.closeModalRoom();
    this.fileReset();
    this.messageIfNoFile=""
  }


}
