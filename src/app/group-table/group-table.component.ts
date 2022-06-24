import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Person} from "../model/person";
import {PersonDataService} from "../person-data.service";
import {Injectable} from '@angular/core';



declare var window: any;
@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
@Injectable()
export class GroupTableComponent {
  title = 'angular13';
  printVal : number | undefined;
  contenteditable: boolean =false;
  formModal:any;
  modalText: string | undefined;
  isImputEmpty :boolean= true ;
  private newAttribute: any = new Person("", "",false,false,false,false,false,false,[],[]);
  // @ts-ignore
  listOfContacts:Array<any> = JSON.parse(sessionStorage.getItem("person"));

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private personData:PersonDataService) {}

  ngOnInit(): void {
    this.formModal = new  window.bootstrap.Modal(
      document.getElementById("errorMessage"));

  }




  //// delete the row from table //////
  delete(d:any){
    this.listOfContacts.splice(d ,1);
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

  ////// add empty row to table  ////////
  addField(){
    this.newAttribute = new Person("", "",false,false,false,false,false,false,[],[]);
    this.listOfContacts.push(this.newAttribute);
    sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));
  }

  ///// set Value into the table /////
  updateList(id: number, property: string, event: any) {
    const editField = event.target.value;

      this.listOfContacts[id][property] = editField;
      sessionStorage.setItem("person", JSON.stringify(this.listOfContacts));

  }

  //// back to mainmenu  /////
  Cancel(){
    // @ts-ignore
    let data=JSON.parse(sessionStorage.getItem("isDataConfirm"));
    if (!data){
      sessionStorage.removeItem("person");
      this.router.navigate(['/mainmenu']);
    }
    else {
      this.router.navigate(['/mainmenu']);
    }

  }

  ////// check if the there are a empty Input //////
  istInputEmpty():boolean{
    let isConfirmed:boolean=false;
    for(var x=0; x<this.listOfContacts.length ; x++){
      if(this.listOfContacts[x]['Vorname'] == "" || this.listOfContacts[x]['Nachname'] == "" ){
        this.modalText = "Tragen Sie alle Felder ein, Bitte!"
        this.formModal.show();
        isConfirmed = false;
      }
      else {
        isConfirmed = true;
      }
    }
    return isConfirmed;
  }

  //// confirm the table with values ////
  confirmList(){
   if (this.istInputEmpty()){
     if (this.listOfContacts[0]['AusnahmenVonNachbernAsBoolean'].length == 0) {
       for (var x=0; x<this.listOfContacts.length-1; x++){
         for (var y=0; y<this.listOfContacts.length; y++){
           this.listOfContacts[y]['AusnahmenVonNachbernAsBoolean'][x]=false;
         }}}
     this.router.navigate(['/groupTableConfirmed']);
   }

  }


  /////// close the Modal of Error //////
  closeErrorMessageModal(){
    this.formModal.hide();
  }


}
