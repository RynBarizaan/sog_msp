import {Component, OnInit, SimpleChanges} from '@angular/core';
import Konva from 'konva';
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas";
import { ColorEvent } from 'ngx-color';
import objectsData from './objects.json';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import {roomInfo} from "../model/roomInfo";
interface Object {
  id: number;
  roomId: number;
  element: string;
  elementtyp?: string;
  place?: number;
  x?: number;
  y?: number;
  degRotation?: number;
  bgClr: string,
  firstname1?: string;
  lastname1?: string;
  firstname2?: string | "Vorname2";
  lastname2?: string | "Nachname2";
  platzierung?: string;
  elementid: number;
  objectWidth?: number;
  objectHeight?: number;
  xNotSmallerZ?: number | 0;
  xNotBiggerZ?: number;
  yNotSmallerZ?: number | 0;
  yNotBiggerZ?: number;
}
import {Router} from "@angular/router";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  constructor(private route: Router) {
  }

  standardRooms: {"id": number, "name": string, "width": number, "height": number}[] = [
    {
      "id": 0,
      "name": "Unterricht",
      "width": 8,
      "height": 8
    },
    {
      "id": 1,
      "name": "Konferenz",
      "width": 8,
      "height": 8
    },
    {
      "id": 2,
      "name": "Workshop",
      "width": 8,
      "height": 8
    },
    {
      "id": 3,
      "name": "Customised Room",
      "width": 8,
      "height": 8
    }
  ];

  elementsNumber: any = [
     {
       'typ': 'desk',
       'number': 0,
     },
     {
       'typ': 'door',
       'number': 0,
     },
     {
       'typ': 'window',
       'number': 0,
     },
     {
       'typ': 'board',
       'number': 0,
     }
     ];
  // Elements for all standard rooms
  allElements: any[] = JSON.parse(JSON.stringify(objectsData));
  // Stage
  currentRoomId: number = 0;
  widthStage: number = 700;
  heightStage: number = 700;
  // Min and max stage in meter
  minWidth: number = 5;
  maxWidth: number = 30;
  minHeight: number = 5;
  maxHeight: number = 30;
  meterInPixel: number = Math.floor(this.widthStage / this.standardRooms[this.currentRoomId].width);
  // Elements
  stage?: any;
  backgroundLayer?: any;
  layerElements: any = new Konva.Layer();
  widthSmallDesk?: number;
  heightDesk?: number;
  radiusSmallDesk?: number;
  radiusBigDesk?: number;
  widthBigDesk?: number;
  widthChair?: number;
  heightChair?: number;
  // initial color and change color
  primaryColor = '#11b0e7';
  showPicker: boolean = false;
  // room saved then switch elements in visualisation
  isRoomSaved: boolean = false;
  // Add Element
  isToAddDesk: boolean = false;
  isToAddDoor: boolean = false;
  isToAddWindow: boolean = false;
  isToAddBoard: boolean = false;
  isToSaveRoom: boolean = false;
  isRoomEmpty: boolean = false;
  // Delete Element
  isToDelete: boolean = false;
  currentId?: any;
  // Room name
  roomname: string = 'My Room name';

  deskToAdd: {elementtyp: string, place: number, x:number, y: number, degRotation: number, bgClr: string} =
    {
      "elementtyp": "eckig",
      "place": 1,
      "x": 0,
      "y": 0,
      "degRotation": 0,
      "bgClr": 'white'
    };
  doorToAdd: {elementtyp: string, bgClr: string, platzierung: string, x?:number, y?: number} =
    {
      "elementtyp": "door",
      "x": 0,
      "y": 0,
      "bgClr": 'white',
      "platzierung": 'links'
    };
  windowToAdd: {elementtyp: string, bgClr: string, platzierung: string, x?:number, y?: number} =
    {
      "elementtyp": "window",
      "x": 0,
      "y": 0,
      "bgClr": 'white',
      "platzierung": 'links'
    };
  boardToAdd: {elementtyp: string, bgClr: string, platzierung: string, x?:number, y?: number} =
    {
      "elementtyp": "board",
      "x": 0,
      "y": 0,
      "bgClr": 'white',
      "platzierung": 'links'
    };

  zoomValue: number = 5;

  roomElements: any = [];


  // Initial visualisation
  ngOnInit() {

    // Get dimension of html container and give it to the stage
    let stageContainer: any = document.getElementById('container-visualiser');

    if (this.standardRooms[this.currentRoomId].width > this.standardRooms[this.currentRoomId].height) {
      this.widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.heightStage = Math.ceil(this.standardRooms[this.currentRoomId].height * (this.widthStage / this.standardRooms[this.currentRoomId].width));
    } else if (this.standardRooms[this.currentRoomId].height > this.standardRooms[this.currentRoomId].width) {
      this.heightStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.widthStage = Math.ceil(this.standardRooms[this.currentRoomId].width * (this.heightStage / this.standardRooms[this.currentRoomId].height));
    } else if (this.standardRooms[this.currentRoomId].width = this.standardRooms[this.currentRoomId].height) {
      this.widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.heightStage =  this.widthStage;
    }


    // Declaring and Initiate variable with local stored room and dimension of it
    let room = JSON.parse(<string>sessionStorage.getItem("room"));
    let roomDimension = JSON.parse(<string>sessionStorage.getItem("roomDimension"));

    // Conditions if room is saved or not
    if(room != null) {
      this.isRoomSaved = true;
      this.allElements = room;
      for(let i = 0; i < this.allElements.length; i++){
        this.allElements[i].id = i;
      }
      this.standardRooms[0].width = roomDimension.width;
      this.standardRooms[0].height = roomDimension.height;
    } else {
      this.isRoomSaved = false;
      let c: any = document.getElementById('standardRoomsChanger');
      c.style.display = 'flex';
      c.style.alignItems = 'center';
      c.style.gap = '10px';
      c.style.visibility = 'visible';
      this.setButtonsStyle();
    }

    // Initiate stage with given dimension from html container
    this.stage = new Konva.Stage({
      container: 'roomvisualiser',
      width: this.widthStage,
      height: this.heightStage,
      draggable: false,
    });

    // calculate how much pixel in width and height has a Meter
    this.calculateMeter(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);

    // calculate dimensions of desks and chairs based on pixel in meter
    this.calculateElements();

    // initiate and draw the ground
    this.backgroundLayer = new Konva.Layer();
    for (let i = 0; i < this.standardRooms[this.currentRoomId].width; i++) {
      for (let j = 0; j < this.standardRooms[this.currentRoomId].height; j++) {
        if((i==0 && j==0)){
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1,
            cornerRadius: [this.meterInPixel*.1,0,0,0],
          });
          this.backgroundLayer.add(rect);
        }
        else if((i==this.standardRooms[this.currentRoomId].width - 1) && j==0){
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1,
            cornerRadius: [0,this.meterInPixel*.1,0,0],
          });
          this.backgroundLayer.add(rect);
        }
        else if((i==this.standardRooms[this.currentRoomId].width - 1) && (j==this.standardRooms[this.currentRoomId].height - 1)){
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1,
            cornerRadius: [0,0,this.meterInPixel*.1,0],
          });
          this.backgroundLayer.add(rect);
        }
        else if((i==0) && (j==this.standardRooms[this.currentRoomId].height - 1)){
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1,
            cornerRadius: [0,0,0,this.meterInPixel*.1],
          });
          this.backgroundLayer.add(rect);
        }
        else {
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1
          });
          this.backgroundLayer.add(rect);
        }


      }
    }

    // add the ground in the stage
    this.stage.add(this.backgroundLayer);

    // draw all elements in the stage
    this.drawElements();

    // make zoom slider element functional
    this.changeStageScale();

    // set roomElement object with all element of current room
    // and set object with number of specific element in the current room
    this.makeRoomDetailsReady();
  }

  // Update visualisation if any changes made
  updateVisualisation(width: number, height: number): void {

    // Get dimension of html container and give it to the stage
    let stageContainer: any = document.getElementById('container-visualiser');

    if (this.standardRooms[this.currentRoomId].width > this.standardRooms[this.currentRoomId].height) {
      this.widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.heightStage = Math.ceil(this.standardRooms[this.currentRoomId].height * (this.widthStage / this.standardRooms[this.currentRoomId].width));
    } else if (this.standardRooms[this.currentRoomId].height > this.standardRooms[this.currentRoomId].width) {
      this.heightStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.widthStage = Math.ceil(this.standardRooms[this.currentRoomId].width * (this.heightStage / this.standardRooms[this.currentRoomId].height));
    } else if (this.standardRooms[this.currentRoomId].width = this.standardRooms[this.currentRoomId].height) {
      this.widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      this.heightStage =  this.widthStage;
    }


    this.setButtonsStyle();

    // If the given dimension are permitted
    if (width >= this.minWidth && width <= this.maxWidth && height >= this.minHeight && height <= this.maxHeight) {

      this.stage.setWidth(this.widthStage);
      this.stage.setHeight(this.heightStage);

      // delete last backgroundstage
      this.backgroundLayer.destroy();
      /* Temporar code because not necessary only to test some new functionalities
      this.stage.destroy();

      // Initiate stage with given dimension from html container
      this.stage = new Konva.Stage({
        container: 'roomvisualiser',
        width: this.widthStage,
        height: this.heightStage,
        draggable: true,
      });
       */

      // calculate how much pixel in width and height has a Meter
      this.calculateMeter(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);

      // calculate dimensions of desks and chairs based on pixel in meter
      this.calculateElements();

      // initiate and draw the ground
      this.backgroundLayer = new Konva.Layer();
      for (let i = 0; i < this.standardRooms[this.currentRoomId].width; i++) {
        for (let j = 0; j < this.standardRooms[this.currentRoomId].height; j++) {
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#777',
            strokeWidth: 1
          });
          this.backgroundLayer.add(rect);
        }
      }
      this.stage.add(this.backgroundLayer);
    }

    // delete and initiate layer for elements
    this.layerElements.destroy();
    this.layerElements = new Konva.Layer();

    // draw all elements in the stage
    this.drawElements();

    // set roomElement object with all element of current room
    // and set object with number of specific element in the current room
    this.makeRoomDetailsReady();
  }

  // Add new desk and draw it
  addDesk(elementtyp: string, place: number, x: number, y: number, rotation: number, bgClr: string): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'desk',
      "elementtyp": elementtyp,
      "place": place,
      "x": x,
      "y": y,
      "degRotation": rotation,
      "bgClr": bgClr,
      "elementid": this.assignId('desk')
    }
    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }

  // Add new door and draw it
  addDoor(elementtyp: string, bgClr: string, platzierung: string, x?: number, y?: number): void {
    let door: any
    if(platzierung == 'links' || platzierung == 'rechts') {
      door = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'door',
        "elementtyp": elementtyp,
        "y": y,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    } else if(platzierung == 'vorne' || platzierung == 'hinten') {
      door = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'door',
        "elementtyp": elementtyp,
        "x": x,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    }

    this.allElements.push(door);
    this.layerElements.destroy();
    this.drawElements();
  }

  // Add new window and draw it
  addWindow(elementtyp: string, bgClr: string, platzierung: string, x?: number, y?: number): void {
    let window: any
    if(platzierung == 'links' || platzierung == 'rechts') {
      window = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'window',
        "elementtyp": elementtyp,
        "y": y,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    } else if(platzierung == 'vorne' || platzierung == 'hinten') {
      window = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'window',
        "elementtyp": elementtyp,
        "x": x,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    }
    this.allElements.push(window);
    this.layerElements.destroy();
    this.drawElements();
  }

  // Add new board and draw it
  addBoard(elementtyp: string, bgClr: string, platzierung: string, x?: number, y?: number): void {
    let board: any
    if(platzierung == 'links' || platzierung == 'rechts') {
      board = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'board',
        "elementtyp": elementtyp,
        "y": y,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    } else if(platzierung == 'vorne' || platzierung == 'hinten') {
      board = {
        "id": this.allElements.length,
        "roomId": this.currentRoomId,
        "element": 'board',
        "elementtyp": elementtyp,
        "x": x,
        "bgClr": bgClr,
        "elementid": this.assignId('door'),
        "platzierung": platzierung
      }
    }

    this.allElements.push(board);
    this.layerElements.destroy();
    this.drawElements();
  }

  // assign id that is used to scroll to a specific element. this function is triggered every time an element is added
  assignId(objectTyp: string): number {
    let id: number = 0
    for(let e of this.allElements) {
      if (e.element == objectTyp && e.roomId == this.currentRoomId) {
        id++
      }
    }
    return id;
  }

  // Update values for x or y or rotation and update visualisation
  updateElementsObject(id: number, platzierung?: string): void {
    if(this.allElements[id].element != 'desk') {
      if(platzierung == 'links' || platzierung == 'rechts') {
        let idy = 'ely'+id;
        let y : any = document.getElementById(idy);
        this.allElements[id].y = y.valueAsNumber;
      } else if(platzierung == 'vorne' || platzierung == 'hinten') {
        let idx = 'elx'+id;
        let x : any = document.getElementById(idx);
        this.allElements[id].x = x.valueAsNumber;
      }
    } else {
      let idx = 'elx'+id;
      let x : any = document.getElementById(idx);
      this.allElements[id].x = x.valueAsNumber;
      let idy = 'ely'+id;
      let y : any = document.getElementById(idy);
      this.allElements[id].y = y.valueAsNumber;
      let idr = 'elr'+id;
      let r : any = document.getElementById(idr);
      this.allElements[id].degRotation = r.valueAsNumber;
    }
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height)
  }

  // Change buttons stylesheet to show the current room
  setButtonsStyle(): void {
    for(let i=0;i<4;i++){
      let v: any = 'btn'+i;
      let ele: any = document.getElementById(v);
      if(i === this.currentRoomId){
        ele.style.backgroundColor = '#0088ff';
        ele.style.color = 'white';
        ele.style.border = '1px solid #ddd';
      } else {
        ele.style.backgroundColor = '#eee';
        ele.style.color = '#000';
        ele.style.border = '1px solid #ddd';
      }
    }
  }

  // scale stage in and out on changing the slider position
  changeStageScale(): void {
    if(this.zoomValue === 0) {
      this.stage.scale({ x: .1, y: .1 });
    } else if(this.zoomValue === 0.5) {
      this.stage.scale({ x: .2, y: .2 });
    } else if(this.zoomValue === 1) {
      this.stage.scale({ x: .3, y: .3 });
    } else if(this.zoomValue === 1.5) {
      this.stage.scale({ x: .4, y: .4 });
    } else if(this.zoomValue === 2) {
      this.stage.scale({ x: .5, y: .5 });
    } else if(this.zoomValue === 2.5) {
      this.stage.scale({ x: .6, y: .6 });
    } else if(this.zoomValue === 3) {
      this.stage.scale({ x: .7, y: .7 });
    } else if(this.zoomValue === 3.5) {
      this.stage.scale({ x: .8, y: .8 });
    } else if(this.zoomValue === 4) {
      this.stage.scale({ x: .9, y: .9 });
    } else if(this.zoomValue === 4.5) {
      this.stage.scale({ x: 1, y: 1 });
    } else if(this.zoomValue === 5) {
      this.stage.scale({ x: 1, y: 1 });
    } else if(this.zoomValue === 5.5) {
      this.stage.scale({ x: 1.1, y: 1.1 });
    } else if(this.zoomValue === 6) {
      this.stage.scale({ x: 1.2, y: 1.2 });
    } else if(this.zoomValue === 6.5) {
      this.stage.scale({ x: 1.3, y: 1.3 });
    } else if(this.zoomValue === 7) {
      this.stage.scale({ x: 1.4, y: 1.4 });
    } else if(this.zoomValue === 7.5) {
      this.stage.scale({ x: 1.5, y: 1.5 });
    } else if(this.zoomValue === 8) {
      this.stage.scale({ x: 1.6, y: 1.6 });
    } else if(this.zoomValue === 8.5) {
      this.stage.scale({ x: 1.7, y: 1.7 });
    } else if(this.zoomValue === 9) {
      this.stage.scale({ x: 1.8, y: 1.8 });
    } else if(this.zoomValue === 9.5) {
      this.stage.scale({ x: 1.9, y: 1.9 });
    } else if(this.zoomValue === 10) {
      this.stage.scale({ x: 2, y: 2 });
    }

    /*
    // if stage scaled make it draggable
    if(this.zoomValue !== 5) {
      this.stage.draggable(true);
    } else if (this.zoomValue === 5) {
      this.stage.draggable(false);
      this.stage.x(0);
      this.stage.y(0);
    }
    */

  }

  // convert meter in pixels
  calculateMeter(width: number, height: number): void {

    if (width > height) {
      this.meterInPixel = this.widthStage / width;
    } else if (height > width) {
      this.meterInPixel = this.heightStage / height;
    } else if (width == height) {
      this.meterInPixel = this.widthStage / width;
    }

  }

  // calculate desks dimension based on meter in pixel
  calculateElements(): void {
    this.widthSmallDesk = this.meterInPixel * 1.2;
    this.widthBigDesk = (this.meterInPixel * 1.2) * 2;
    this.heightDesk = this.meterInPixel * .7;
    this.widthChair = this.meterInPixel * .4;
    this.heightChair = this.meterInPixel * .3;
    this.radiusSmallDesk = Math.floor((this.meterInPixel * 1.2) / 2);
    this.radiusBigDesk = Math.floor((this.meterInPixel * 1.2) / 1.5);
  }

  // delete element from allelements object and rearrange ids and elementids for the scroll functionality then update visualisation
  deleteElem(): void {
    this.allElements.splice(this.currentId,1);
    for(let i = 0; i < this.allElements.length; i++) {
      this.allElements[i].id = i;
    }
    let desk: number = 0;
    let door: number = 0;
    let window: number = 0;
    let board: number = 0;
    let i = 0;
    for(let el of this.allElements){
      el.id = i;
      i++;
      if(el.roomId == this.currentRoomId) {
        if(el.element === 'desk') {
          el.elementid = desk;
          desk = desk + 1;
        } else if (el.element === 'door') {
          el.elementid = door;
          door = door + 1;
        } else if (el.element === 'window') {
          el.elementid = window;
          window = window + 1;
        } else if (el.element === 'board') {
          el.elementid = board;
          board = board + 1;
        }
      }
    }
    this.currentId = undefined;
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height)
  }

  // draws all elements
  drawElements(): void {
    this.stage.add(this.layerElements);
    for (let i = 0; i < this.allElements.length; i++) {
      if(this.allElements[i].roomId == this.currentRoomId){
        this.drawElement(this.allElements[i].element, this.allElements[i].elementtyp, this.allElements[i].place, this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].bgClr,
          this.allElements[i].platzierung)
      }
    }
  }

  // draw one element
  drawElement(element: string, elementtyp: string, place: number, id: number, x: number, y: number, rotation: number, bgClr: string, platzierung?: string): void {
    //Step 1
    let objWidth: any;
    let objHeight: any;

    //Step 2
    let elemente: any[] = [];

    // If the object is a small square desk
    if(element == 'desk' && elementtyp == 'eckig' && place == 1){
      let desktop = new Konva.Rect({
        width: this.widthSmallDesk,
        height: this.heightDesk,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      let chair = new Konva.Rect({
        x: this.meterInPixel * 0.4,
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      elemente.push(desktop)
      elemente.push(chair)

      objWidth = this.widthSmallDesk;
      // @ts-ignore
      objHeight = this.heightDesk + ((this.meterInPixel * 0.75) - this.heightDesk) + this.heightChair;
    }

    // If the object is a big square desk
    else if(element == 'desk' && elementtyp == 'eckig' && place == 2) {
      let desk = new Konva.Rect({
        width: this.widthBigDesk,
        height: this.heightDesk,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      let chair1 = new Konva.Rect({
        x: this.meterInPixel * .4,
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      let chair2 = new Konva.Rect({
        x: (this.meterInPixel * .4) + (this.meterInPixel * 1.2),
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      elemente.push(desk)
      elemente.push(chair1)
      elemente.push(chair2)

      objWidth = this.widthBigDesk;
      // @ts-ignore
      objHeight = this.heightDesk + ((this.meterInPixel * 0.75) - this.heightDesk) + this.heightChair;
    }
    // If the object is a small round desk
    else if(element == 'desk' && elementtyp == 'rund' && place == 1) {
      let desk = new Konva.Circle({
        x: this.radiusSmallDesk,
        y: this.radiusSmallDesk,
        radius: this.radiusSmallDesk,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      let chair = new Konva.Rect({
        x: this.meterInPixel * 0.4,
        y: this.meterInPixel * 1.25,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      elemente.push(desk)
      elemente.push(chair)

      // @ts-ignore
      objWidth = this.radiusSmallDesk * 2;
      // @ts-ignore
      objHeight = this.meterInPixel * 1.25 + this.heightChair;
    }
    // If the object is a big round desk
    else if(element == 'desk' && elementtyp == 'rund' && place == 2) {
      // @ts-ignore
      let xChair1: any = this.radiusBigDesk - (this.widthChair / 2);
      // @ts-ignore
      let xChair2: any = this.radiusBigDesk - (this.widthChair / 2);
      let yChair1: any = 0;
      // @ts-ignore
      let yChair2: any = (this.radiusBigDesk * 2) + this.widthChair + (this.widthChair - this.heightChair);
      let xDesk: any = this.radiusBigDesk;
      // @ts-ignore
      let yDesk: any = this.radiusBigDesk + this.widthChair;

      let desk = new Konva.Circle({
        x: xDesk,
        y: yDesk,
        radius: this.radiusBigDesk,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      let chair1 = new Konva.Rect({
        x: xChair1,
        y: yChair1,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      let chair2 = new Konva.Rect({
        x: xChair2,
        y: yChair2,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      elemente.push(desk)
      elemente.push(chair1)
      elemente.push(chair2)

      // @ts-ignore
      objWidth = this.radiusBigDesk * 2;
      // @ts-ignore
      objHeight = yChair2 + this.heightChair;
    }
    // If the object is a door
    else if(element == 'door') {
      let door1 = new Konva.Rect({
        width: this.meterInPixel * 0.08,
        height: this.meterInPixel * 2,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      let door2 = new Konva.Rect({
        x: this.meterInPixel * 0.08,
        y: this.meterInPixel * 0.1,
        width: this.meterInPixel * 0.04,
        height: this.meterInPixel * 1.8,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      elemente.push(door1)
      elemente.push(door2)

      objWidth = (this.meterInPixel * 0.08) + (this.meterInPixel * 0.04);
      objHeight = this.meterInPixel * 2;
    }
    // If the object is a window
    else if(element == 'window') {
      let window1 = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.meterInPixel * 0.08,
        height: this.meterInPixel * 2,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      let window2 = new Konva.Rect({
        x: this.meterInPixel * .08,
        y: this.meterInPixel * .05,
        width: this.meterInPixel * 0.04,
        height: this.meterInPixel * .9,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      let window3 = new Konva.Rect({
        x: this.meterInPixel * .08,
        y: this.meterInPixel * 1.05,
        width: this.meterInPixel * 0.04,
        height: this.meterInPixel * .9,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      });
      elemente.push(window1)
      elemente.push(window2)
      elemente.push(window3)

      objWidth = (this.meterInPixel * 0.08) + (this.meterInPixel * 0.04);
      objHeight = this.meterInPixel * 2;
    }

    // If the object is a board
    else if(element == 'board') {
      let board = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.meterInPixel * 0.12,
        height: this.meterInPixel * 2,
        fill: bgClr,
        stroke: 'black',
        strokeWidth: 1,
      })
      elemente.push(board)

      objWidth = (this.meterInPixel * 0.08) + (this.meterInPixel * 0.04);
      objHeight = this.meterInPixel * 2;
    }

    let circleDelete = new Konva.Circle({
      radius: 12,
      fill: 'red',
    });
    let cross1 = new Konva.Rect({
      x: -8,
      y: -1.5,
      width: 16,
      height: 3,
      fill: 'white',
      rotation: 0,
    })
    let cross2 = new Konva.Rect({
      x: -1.5,
      y: -8,
      width: 3,
      height: 16,
      fill: 'white',
      rotation: 0,
    })
    let circle = new Konva.Group({
      x: 0,
      y: 0,
      rotation: 45,
    })
    circle.add(circleDelete);
    circle.add(cross1);
    circle.add(cross2);

    //Step 3
    let groupElements: any;

    if(element == 'door' || element == 'window' || element == 'board') {
      switch (platzierung) {
        case "links" : groupElements = new Konva.Group({
          x: 0,
          y: y,
          draggable: true,
          rotation: 0,
        })
          break;
        case "hinten" : groupElements = new Konva.Group({
          x: x,
          y: this.heightStage,
          draggable: true,
          rotation: -90,
        })
          break;
        case "rechts" : groupElements = new Konva.Group({
          x: this.widthStage,
          y: y + (this.meterInPixel * 2),
          draggable: true,
          rotation: 180,
        })
          break;
        case "vorne" : groupElements = new Konva.Group({
          x: x + (this.meterInPixel * 2),
          y: 0,
          draggable: true,
          rotation: 90,
        })
          break;
      }
    } else {
       groupElements = new Konva.Group({
        x: x,
        y: y,
        draggable: true,
        rotation: rotation,
      })
    }

    //Step 4
    for(let e of elemente) {
      groupElements.add(e)
    }

    //Step 5
    this.layerElements.add(groupElements);

    //Step 6
    let tr = new Konva.Transformer({
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,

      borderDash: ([4, 4]),
      borderStroke: 'red',
      borderStrokeWidth: 1,

      anchorCornerRadius:10,
      anchorSize: 10,
      anchorFill: 'red',
      anchorStroke: 'red',
      anchorStrokeWidth: 1,
    })

    //Step 7
    this.layerElements.add(tr);

    this.allElements[id].objectWidth = Math.floor(groupElements.getClientRect().width);
    this.allElements[id].objectHeight = Math.floor(groupElements.getClientRect().height);

    if(this.allElements[id].xNotSmallerZ == undefined) {
      this.allElements[id].xNotSmallerZ = 0;
    }
    if(this.allElements[id].xNotBiggerZ == undefined) {
      this.allElements[id].xNotBiggerZ = this.widthStage - objWidth;
    }
    if(this.allElements[id].yNotSmallerZ == undefined) {
      this.allElements[id].yNotSmallerZ = 0;
    }
    if(this.allElements[id].yNotBiggerZ == undefined) {
      this.allElements[id].yNotBiggerZ = this.heightStage - objHeight;
    }

    //Step 8
    let tooltip = new Konva.Text({
      text: this.allElements[id].element + ' ' + (this.allElements[id].elementid + 1),
      fontFamily: 'Calibri',
      fontSize: 14,
      padding: 5,
      textFill: 'white',
      fill: 'black',
      alpha: 0.75,
      visible: false,
    });

    groupElements.add(tooltip);

    if(id == this.currentId) { /* important */

      if(this.allElements[id].element != 'desk') {
        tr.rotateEnabled(false);

        if(platzierung == 'links') {
          circle.x(this.meterInPixel * .12)
        } else if(platzierung == 'rechts') {
          circle.y(this.meterInPixel * 2)
          circle.x(this.meterInPixel * .12)
        } else if(platzierung == 'vorne') {
          circle.x(this.meterInPixel * .12)
        } else if(platzierung == 'hinten') {
          circle.x(this.meterInPixel * .12)
          circle.y(this.meterInPixel * 2)
        }
      }
      tr.nodes([groupElements]) // this function will be soon deleted and replaced with attachTo
      tr.add(circle);
    }

    //
    groupElements.on('mouseenter', (e: any) => {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'move';
      tooltip.position({
        x: 0,
        y: 0,
      });
      if(this.allElements[id].element != 'desk' && (this.allElements[id].platzierung == 'links' || this.allElements[id].platzierung == 'rechts')) {
        tooltip.rotation(90)
        tooltip.x(40)
      } else if(this.allElements[id].element != 'desk' && this.allElements[id].platzierung == 'vorne') {
        tooltip.rotation(270)
        tooltip.x(16)
        tooltip.y(objHeight)
      } else if(this.allElements[id].element != 'desk' && this.allElements[id].platzierung == 'hinten') {
        tooltip.rotation(90)
        tooltip.x(40)
      }
      tooltip.show();
    });

    //
    groupElements.on('mouseout', (e: any) => {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'default';
      tooltip.hide();
    });

    //
    groupElements.on('click', () => {

      this.currentId = id;

      for(let j=0; j<this.allElements.length; j++) {
        if(this.allElements[j].roomId == this.currentRoomId) {
          let idElementr: any = 'elr' + this.allElements[j].id;
          let elemr: any = document.getElementById(idElementr);
          elemr.parentElement.parentElement.style.backgroundColor = ''
          elemr.parentElement.parentElement.classList.remove('blink')
        }
      }

      for(let i=0; i<this.allElements.length; i++) {

        if (this.allElements[i].id == id) {

          let idElementr: any = 'elr' + id;
          let elemr: any = document.getElementById(idElementr);
          elemr.parentElement.parentElement.classList.add('blink')

          if (this.allElements[i].element === 'desk') {
            elemr.parentElement.parentElement.style.backgroundColor = '#8DD8F5'
            let element: any = document.getElementById('desks-container')
            element.scrollTo({
              top: 80 * this.allElements[i].elementid,
              left: 0,
              behavior: 'smooth'
            });
          } else if (this.allElements[i].element === 'door') {
            elemr.parentElement.parentElement.style.backgroundColor = '#ddd'
            let element: any = document.getElementById('doors-container')
            element.scrollTo({
              top: 80 * this.allElements[i].elementid,
              left: 0,
              behavior: 'smooth'
            });
          } else if (this.allElements[i].element === 'window') {
            elemr.parentElement.parentElement.style.backgroundColor = '#ddd'
            let element: any = document.getElementById('windows-container')
            element.scrollTo({
              top: 80 * this.allElements[i].elementid,
              left: 0,
              behavior: 'smooth'
            });
          } else if (this.allElements[i].element === 'board') {
            elemr.parentElement.parentElement.style.backgroundColor = '#ddd'
            let element: any = document.getElementById('boards-container')
            element.scrollTo({
              top: 80 * this.allElements[i].elementid,
              left: 0,
              behavior: 'smooth'
            });
          }
        }

      }

      this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);

    });

    //
    groupElements.on('transform dragmove', () => {
      if(this.allElements[id].element != 'desk') {
        if(platzierung == 'links') {
          let idElementy = 'ely'+id;
          let elemy: any = document.getElementById(idElementy);
          elemy.value = Math.floor(groupElements.y());
        } else if(platzierung == 'rechts') {
          let idElementy = 'ely'+id;
          let elemy: any = document.getElementById(idElementy);
          elemy.value = Math.floor(groupElements.y() - (this.meterInPixel * 2));
        } else if(platzierung == 'vorne') {
          let idElementx = 'elx'+id;
          let elemx: any = document.getElementById(idElementx);
          elemx.value = Math.floor(groupElements.x() - (this.meterInPixel * 2));
        } else if(platzierung == 'hinten') {
          let idElementx = 'elx'+id;
          let elemx: any = document.getElementById(idElementx);
          elemx.value = Math.floor(groupElements.x());
        }
      } else {
          let idElementr = 'elr'+id;
          let elemr: any = document.getElementById(idElementr);
          elemr.value = Math.floor(groupElements.rotation());
          let idElementx = 'elx'+id;
          let elemx: any = document.getElementById(idElementx);
          elemx.value = Math.floor(groupElements.x());
          let idElementy = 'ely'+id;
          let elemy: any = document.getElementById(idElementy);
          elemy.value = Math.floor(groupElements.y());
      }
    });

    //
    groupElements.on('transformend dragend', () => {
      if (this.allElements[id].element != 'desk') {
        let idY = 'ely'+id;
        let elemtY: any = document.getElementById(idY);
        let idX = 'elx'+id;
        let elemtX: any = document.getElementById(idX);
        switch (platzierung) {
          case "links" :
            if ((groupElements.getClientRect().y) < 0) {
              elemtY.value =  0
            } else if ((groupElements.getClientRect().y) > (this.heightStage - groupElements.getClientRect().height)) {
              elemtY.value =  this.heightStage - groupElements.getClientRect().height
            }
            break;
          case "rechts" :
            if ((groupElements.getClientRect().y) < 0) {
              elemtY.value =  0
            } else if ((groupElements.getClientRect().y) > (this.heightStage - groupElements.getClientRect().height)) {
              elemtY.value =  this.heightStage - groupElements.getClientRect().height
            }
            break;
          case "vorne" :
            if ((groupElements.getClientRect().x) < 0) {
              elemtX.value =  0
            } else if ((groupElements.getClientRect().x) > (this.widthStage - groupElements.getClientRect().width)) {
              elemtX.value =  this.widthStage - groupElements.getClientRect().width
            }
            break;
          case "hinten" :
            if ((groupElements.getClientRect().x) < 0) {
              elemtX.value =  0
            } else if ((groupElements.getClientRect().x) > (this.widthStage - groupElements.getClientRect().width)) {
              elemtX.value =  this.widthStage - groupElements.getClientRect().width
            }
            break;
        }

      } else if (this.allElements[id].element == 'desk'){

        let idX = 'elx'+id;
        let elementX: any = document.getElementById(idX);
        let idY = 'ely'+id;
        let elementY: any = document.getElementById(idY);

        let xOver: number;
        let yOver: number;
        let rotation: number = Math.floor(groupElements.getAbsoluteRotation());
        let deg: number;
        let xNotSmaller: number;
        let xNotBigger: number;
        let yNotSmaller: number;
        let yNotBigger: number;

        if (rotation >= 0 && rotation <= 90) {

          deg = rotation;
          deg = (deg * Math.PI) / 180.0;
          yOver = 0;
          xOver = Math.ceil(objHeight * Math.sin(deg));
          xNotSmaller = xOver;
          xNotBigger = this.widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = this.heightStage - (groupElements.getClientRect().height - yOver);

          if (elementX.value < xNotSmaller) {
            elementX.value = xNotSmaller;
          } else if(elementX.value > xNotBigger) {
            elementX.value = xNotBigger;
          }

          if (elementY.value < yNotSmaller) {
            elementY.value = yNotSmaller;
          } else if(elementY.value > yNotBigger) {
            elementY.value = yNotBigger;
          }

        } else if (rotation >= 90 && rotation <= 180) {
          deg = rotation - 90;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(objHeight * Math.sin(deg));
          xOver = Math.ceil(groupElements.getClientRect().width);
          xNotSmaller = xOver;
          xNotBigger = this.widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = this.heightStage - (groupElements.getClientRect().height - yOver);

          if (elementX.value < xNotSmaller) {
            elementX.value = xNotSmaller;
          } else if(elementX.value > xNotBigger) {
            elementX.value = xNotBigger;
          }

          if (elementY.value < yNotSmaller) {
            elementY.value = yNotSmaller;
          } else if(elementY.value > yNotBigger) {
            elementY.value = yNotBigger;
          }

        } else if (rotation >= -180 && rotation <= -90) {
          deg = (rotation * -1) - 90;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(groupElements.getClientRect().height);
          xOver = Math.ceil(objWidth * Math.sin(deg));
          xNotSmaller = xOver;
          xNotBigger = this.widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = this.heightStage - (groupElements.getClientRect().height - yOver);

          if (elementX.value < xNotSmaller) {
            elementX.value = xNotSmaller;
          } else if(elementX.value > xNotBigger) {
            elementX.value = xNotBigger;
          }

          if (elementY.value < yNotSmaller) {
            elementY.value = yNotSmaller;
          } else if(elementY.value > yNotBigger) {
            elementY.value = yNotBigger;
          }

        } else if (rotation >= -90 && rotation < 0) {
          deg = rotation * -1;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(objWidth * Math.sin(deg));
          xOver = 0;
          xNotSmaller = xOver;
          xNotBigger = this.widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = this.heightStage - (groupElements.getClientRect().height - yOver);

          if (elementX.value < xNotSmaller) {
            elementX.value = xNotSmaller;
          } else if(elementX.value > xNotBigger) {
            elementX.value = xNotBigger;
          }

          if (elementY.value < yNotSmaller) {
            elementY.value = yNotSmaller;
          } else if(elementY.value > yNotBigger) {
            elementY.value = yNotBigger;
          }

        }

        // @ts-ignore
        this.allElements[id].xNotSmallerZ = xNotSmaller
        // @ts-ignore
        this.allElements[id].xNotBiggerZ = xNotBigger
        // @ts-ignore
        this.allElements[id].yNotSmallerZ = yNotSmaller
        // @ts-ignore
        this.allElements[id].yNotBiggerZ = yNotBigger

      }

      this.updateElementsObject(id, platzierung);

    });

    //
    circle.on('click', (event) => {
      this.currentId = id;
      this.isToDelete = true;
    });

  }

  // save pdf with room title and picture of stage
  savePdf() {
    let d: any = document.querySelector('#roomvisualiser');
    html2canvas(d, {
      allowTaint:true,
      useCORS: true,
      scale: 1
    }).then(canvas => {
      let img = canvas.toDataURL("image/png");
      let pdf = new jsPDF();
      pdf.setFont('Arial');
      pdf.text(this.roomname,30,12);
      pdf.setFontSize(50);
      pdf.addImage(img, 'PNG',6,20,200,200);
      pdf.save('room.pdf');
    })
  }

  // save image of stage
  downloadAsImage() {
    let dataURL = this.stage.toDataURL({ pixelRatio: 3 });
    let link: any = document.createElement('a');
    link.download = this.roomname;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.download;
  }

  // Set initial rooms
  reset(): void {
    this.allElements = JSON.parse(JSON.stringify(objectsData));
    this.standardRooms[0].width = 8;
    this.standardRooms[0].height = 8;
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
    this.isRoomSaved = false;
    let c: any = document.getElementById('standardRoomsChanger');
    c.style.display = 'flex';
    c.style.alignItems = 'center';
    c.style.gap = '10px';
    c.style.visibility = 'visible';
    this.setButtonsStyle();
    sessionStorage.removeItem('room');
    sessionStorage.removeItem('roomDimension');
  }

  // Set roomelement and elementsnumber
  makeRoomDetailsReady() {
    this.roomElements = [];
    this.elementsNumber[0].number = 0;
    this.elementsNumber[1].number = 0;
    this.elementsNumber[2].number = 0;
    this.elementsNumber[3].number = 0;

    for(let elem of this.allElements) {
      if(elem.roomId === this.currentRoomId) {

        let x = new Object();
        x = elem;
        this.roomElements.push(x);

        if(elem.element == 'desk'){
          this.elementsNumber[0].number++;
        }
        if(elem.element == 'door'){
          this.elementsNumber[1].number++;
        }
        if(elem.element == 'window'){
          this.elementsNumber[2].number++;
        }
        if(elem.element == 'board'){
          this.elementsNumber[3].number++;
        }
      }
    }
  }

  // Save room in localstorage
  saveRoom() {
    this.route.navigate(['mainmenu']);

    for(let i = 0; i < this.roomElements.length; i++) {
      this.allElements[i].id = i;
      this.roomElements[i].roomId = 0;
    }

    sessionStorage.setItem("room", JSON.stringify(this.roomElements));
    let roomStage: any = {
      "width": this.standardRooms[this.currentRoomId].width,
      "height":  this.standardRooms[this.currentRoomId].height,
      "stageWidthInPixel" : this.widthStage,
      "stageHeightInPixel" : this.heightStage
    }
    sessionStorage.setItem("roomDimension", JSON.stringify(roomStage));
  }

  // Set primarycolor
  changeColor($event: ColorEvent): void {
    this.primaryColor = $event.color.hex;
    let element: any = document.getElementById('colorPickerTrigger');
    element.style.backgroundColor = this.primaryColor;
  }

  // Pass primarycolor to object
  handleAccept(): void {
    this.showPicker = false;
    // Property color for the specific object is to change
    if(this.currentId !== undefined) {
      this.allElements[this.currentId].bgClr = this.primaryColor;
      this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
      this.currentId = undefined;
    }
  }

  // Hide colorpicker
  handleCancel(): void {
    this.showPicker = false;
    //
  }

  // Export csv file
  ExportAsCsv(){
    this.makeRoomDetailsReady();

    for(let element of this.roomElements) {
      element.roomId = 0;
    }
    let roomStage: any = {
      "width": this.standardRooms[this.currentRoomId].width,
      "height":  this.standardRooms[this.currentRoomId].height,
    }

      let options = {
        fieldSeparator: ',',
        quoteStrings: '',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: false,
        headers: ["RoomInfos"]
    };
    //Error message for if room is empty
    if (this.roomElements.length == 0 || this.roomElements ==[]){
      this.isRoomEmpty = true;
    }
    else {
      this.roomElements.push(roomStage)
      new ngxCsv(this.roomElements, "Room", options);
    }
    }
}
