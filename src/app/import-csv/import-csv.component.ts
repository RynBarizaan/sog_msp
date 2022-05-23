import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MainmenuComponent} from "../mainmenu/mainmenu.component";
import {FormControl, Validators} from "@angular/forms";
import * as CryptoJS from 'crypto-js'
import {csvRecord} from "../model/csv-record";
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})

export class ImportCsvComponent implements OnInit {


  listOfContacts: Array<any> =[];
  listOfContactsASObject: Array<any> =[];
  private newAttribute: any = new Person("", "",false,false,false,false,false,false,[],[]);
  Decrypt: Array<any> = [];
  textToConvert!: string;
  password: any;
  hide = true;

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  // Import CSV File in Array


  uploadListener($event: any): void {

    let files = $event.srcElement.files;

   if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        console.log("is works 1")

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

    console.log("is works 2")
    let csvArr = [];
    let test:any;
    let test1:any;
    let test2=[];

    for (let i = 1; i < csvRecordsArray.length-1; i++) {

      let curruntRecord = (<string>csvRecordsArray[i]).split(/\r\n|\n/);
      let encrypt: csvRecord = new csvRecord();
      csvArr.push(encrypt);
      this.listOfContacts.push((CryptoJS.AES.decrypt(curruntRecord.toString(), this.password.trim()).toString(CryptoJS.enc.Utf8)));
      this.listOfContactsASObject=[];
    }

    for (var x=0; x<this.listOfContacts.length; x++){
      test2=[];
      test = (<string>this.listOfContacts[x]).split(",");
      test1 = (<string>this.listOfContacts[x]).split("/");
   for (var y=1; y<test1.length-1; y++){
      test2.push(test1[y]);
    }

      this.listOfContactsASObject.push(new Person(test[0],test[1],JSON.parse(test[2]),JSON.parse(test[3]),JSON.parse(test[4]),JSON.parse(test[5]),JSON.parse(test[6]),JSON.parse(test[7]),test2,[]));
    }

      console.log(this.listOfContactsASObject);

    sessionStorage.removeItem("person");
    sessionStorage.setItem("person", JSON.stringify(this.listOfContactsASObject));
    // @ts-ignore
    console.log(JSON.parse(sessionStorage.getItem("person")));
    //console.log(csvArr)
     return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  fileReset() {
    this.csvReader.nativeElement.value = "";
  }

//html view functions for import
  passFormControl = new FormControl('', [
    Validators.required,
  ]);
  @ViewChild('myInput') myInput!: ElementRef;

  constructor(public mainmenuComponent: MainmenuComponent) { }

  ngOnInit(): void {

  }
  test(){
    if (this.password !="" && this.password != null){
      sessionStorage.setItem("isDataConfirm", JSON.stringify(true));
      this.closeModal()

    }

    else{
      this.myInput.nativeElement.focus();
      console.log("Bitte Passwort eingeben")
    }
  }

  closeModal() {
    this.fileReset()
    this.mainmenuComponent.closeModal()
  }


}
