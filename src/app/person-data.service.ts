import { Injectable } from '@angular/core';
import {Person} from "./model/person";

@Injectable({
  providedIn: 'root'
})
export class PersonDataService {
  public person: Array<any> = [];

  constructor() { }
  savePerson(person: Person){
    this.person.push(person);
  }
}
