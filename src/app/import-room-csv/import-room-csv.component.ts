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


  roomDetails: Array<any> =[];
  roomElements: Array<any> =[];
  Decrypt: Array<any> = [];
  textToConvert!: string;
  password= "123";
  hide = true;
  messageIfNoFile!: string;
  messageIfWrongCSV!: string;
  csv = [];
  isTrue= false;


  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  // Import CSV File in Array
  uploadListener($event: any): void {

    let files = $event.srcElement.files;

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

    try {
      for (let i = 1; i < csvRecordsArray.length - 1; i++) {
        let curruntRecord = (<string>csvRecordsArray[i]).split(/\r\n|\n/);
        this.roomElements.push((CryptoJS.AES.decrypt(curruntRecord.toString(), this.password.trim()).toString(CryptoJS.enc.Utf8)));
        this.roomDetails = [];
        this.isTrue=false;
      }
      if (this.roomElements.length==0|| this.roomElements.length<0){
        this.messageIfWrongCSV = "Falsche CSV Datei Ausgewählt";

      }
      else {
        for (var x = 0; x < this.roomElements.length; x++) {
          this.roomDetails[x] = JSON.parse(this.roomElements[x]);
        }
        sessionStorage.setItem("roomDimension", JSON.stringify(this.roomDetails[0]));
        this.isTrue=true;
        this.messageIfWrongCSV="";
        this.messageIfNoFile="";

        for (var x = 1; x < this.roomElements.length; x++) {
          this.roomDetails[x] = JSON.parse(this.roomElements[x]);
        }
        sessionStorage.setItem("room", JSON.stringify(this.roomDetails));
      }
    }
    catch (Exception){
      console.log(Exception)
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

  //click event

  Import(){
    //Error if you didn't upload any file
    this.isTrue==false
    if (this.csvReader.nativeElement.value == ""){
      this.messageIfNoFile="Bitte eine CSV Datei Auswählen";
    }
    else {
      this.messageIfNoFile="";
    }
    //Error if you choose wrong csv file
    if (this.roomElements.length == 0 || this.roomElements==null || this.roomElements ==[] || this.roomElements==['']) {
      this.messageIfWrongCSV = "Falsche CSV Datei Ausgewählt";
      this.fileReset()
    }
    if (this.isTrue){
      this.closeModal()
      this.messageIfWrongCSV=" "
      this.isTrue=false;
    }
    else {
      this.isTrue==false;
      this.messageIfWrongCSV = "Falsche CSV Datei Ausgewählt";
    }

  }

  //close modal box
  closeModal() {
    this.mainmenuComponent.closeModalRoom();
    this.fileReset();
    this.messageIfNoFile=""
    this.isTrue==false;
    this.messageIfWrongCSV =""
  }


}
