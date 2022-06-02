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
  elementtyp: string;
  place: number;
  factory: string;
  x: number;
  y: number;
  degRotation: number;
  bgClr: string,
  firstname1?: string;
  lastname1?: string;
  firstname2?: string | "Vorname2";
  lastname2?: string | "Nachname2";
}
import {Router} from "@angular/router";

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
  ]
   elementsNumber: any = [
     {
        'typ': 'desk',
        'number': 0,
     },
     {
       'typ': 'door',
       'number': 0,
     },{
       'typ': 'window',
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
  widthMeter: number = this.standardRooms[this.currentRoomId].width;
  heightMeter: number = this.standardRooms[this.currentRoomId].height;
  // Elements
  stage?: any;
  layerElements: any = new Konva.Layer();
  widthSmallDesk?: number;
  heightSmallDesk?: number;
  radiusSmallDesk?: number;
  radiusBigDesk?: number;
  widthBigDesk?: number;
  heightBigDesk?: number;
  widthChair?: number;
  heightChair?: number;
  positionXDeleteIcon?: number;
  positionXDeleteIcon2?: number;
  positionYDeleteIcon?: number;
  radiusDeleteIcon?: number;
  radiusSmallTriangle?: number;
  // initial color and change color
  primaryColor = '#777777';
  showPicker: boolean = false;
  // room saved then switch elements in visualisation
  isRoomSaved: boolean = false;
  // Add Element
  isToAddDesk: boolean = false;
  isToAddDoor: boolean = false;
  isToAddWindow: boolean = false;
  isToSaveRoom: boolean = false;
  // Delete Element
  isToDelete: boolean = false;
  currentId?: any;
  // Link dimension
  islinked: boolean = false;

  // Pre elements to add
  deskToAdd: {elementtyp: string, place: number, x:number, y: number, degRotation: number, bgClr: string} =
    {
      "elementtyp": "eckig",
      "place": 1,
      "x": 0,
      "y": 0,
      "degRotation": 0,
      "bgClr": '#777777'
    };

  doorToAdd: {elementtyp: string, x:number, y: number, degRotation: number, bgClr: string} =
    {
      "elementtyp": "left",
      "x": 0,
      "y": 0,
      "degRotation": 0,
      "bgClr": '#777777'
    };

  windowToAdd: {elementtyp: string, x:number, y: number, degRotation: number, bgClr: string} =
    {
      "elementtyp": "middle",
      "x": 0,
      "y": 0,
      "degRotation": 0,
      "bgClr": '#777777'
    };

  // zooming stage
  zoomValue: number = 5;
  // saving room
  roomElements: any = [];
  roomToSaveInfos: any = [];

  ngOnInit() {

    let room = JSON.parse(<string>sessionStorage.getItem("room"));
    let roomDimension = JSON.parse(<string>sessionStorage.getItem("roomDimension"));
    if(room != null) {
      this.allElements = room;
      this.isRoomSaved = true;
      this.standardRooms[0].width = roomDimension.width;
      this.standardRooms[0].height = roomDimension.height;
    } else {
      this.isRoomSaved = false;
      let c: any = document.getElementById('standardRoomsChanger');
      c.style.display = 'flex';
      c.style.alignItems = 'center';
      c.style.gap = '20px';
      c.style.visibility = 'visible';
      this.setButtons();
    }

    this.stage = new Konva.Stage({
      container: 'roomvisualiser',
      width: this.widthStage,
      height: this.heightStage,
      draggable: false,
    });
    this.calculateMeter(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
    this.calculateElements();
    let backgroundLayer = new Konva.Layer();
    for (let i = 0; i < this.standardRooms[this.currentRoomId].width; i++) {
      for (let j = 0; j < this.standardRooms[this.currentRoomId].height; j++) {
        let rect = new Konva.Rect({
          x: i * this.meterInPixel,
          y: j * this.meterInPixel,
          width: this.meterInPixel,
          height: this.meterInPixel,
          fill: '#e2e2e2',
          stroke: '#000',
          strokeWidth: .2
        });
        backgroundLayer.add(rect);
      }
    }
    this.stage.add(backgroundLayer);

    this.drawElements();
    this.zoomStage();
    this.changeStageScale();
    this.makeRoomDetailsReady();
  }

  addDesk(elementtyp: string, place: number, x: number, y: number, rotation: number, bgClr: string): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'desk',
      "elementtyp": elementtyp,
      "place": place,
      "factory": this.factoryCodeConstructor(elementtyp, place, this.allElements.length),
      "x": x,
      "y": y,
      "degRotation": rotation,
      "bgClr": bgClr,
      "firstname1": 'Vorname',
      "lastname1": 'Nachname',
      "firstname2": 'Vorname-2',
      "lastname3": 'Nachname-2',
    }

    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }
  addDoor(elementtyp: string, x: number, y: number, rotation: number, bgClr: string): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'door',
      "elementtyp": elementtyp,
      "factory": elementtyp.split(/[a-z]/,1).toString().toLowerCase(),
      "x": x,
      "y": y,
      "degRotation": rotation,
      "bgClr": bgClr,
    }

    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }
  addWindow(elementtyp: string, x: number, y: number, rotation: number, bgClr: string): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'window',
      "elementtyp": elementtyp,
      "factory": elementtyp.split(/[a-z]/,1).toString().toLowerCase(),
      "x": x,
      "y": y,
      "degRotation": rotation,
      "bgClr": bgClr,
    }

    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }

  factoryCodeConstructor(elementtyp: string, place: number, id: number) : string {
    let factCode: string = '';
    if(elementtyp == 'eckig') {
      factCode += 's-'
    } else if (elementtyp == 'rund') {
      factCode += 'r-'
    } else if (elementtyp == 'dreieckig') {
      factCode += 't-'
    }
    if(place == 1) {
      factCode += 's-';
    } else if(place == 2) {
      factCode += 'b-';
    }
    factCode += id;
    return factCode;
  }

  updateElements(id: number): void {
    let idx = 'elx'+id;
    let x : any = document.getElementById(idx);
    this.allElements[id].x = x.valueAsNumber;
    let idy = 'ely'+id;
    let y : any = document.getElementById(idy);
    this.allElements[id].y = y.valueAsNumber;
    let idr = 'elr'+id;
    let r : any = document.getElementById(idr);
    this.allElements[id].degRotation = r.valueAsNumber;
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height)
  }

  setButtons(): void {
    for(let i=0;i<4;i++){
      let v: any = 'btn'+i;
      let ele: any = document.getElementById(v);
      if(i === this.currentRoomId){
        ele.style.backgroundColor = '#0088ff';
        ele.style.color = 'white';
      } else {
        ele.style.backgroundColor = '#777';
        ele.style.color = 'white';
      }
    }
  }

  zoomStage(): void {
    let scaleBy: number = 1.1;
    this.stage.on('wheel', (data: any) =>  {
      // stop default scrolling
      data.evt.preventDefault();

      let oldScale = this.stage.scaleX();
      let pointer = this.stage.getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = data.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (data.evt.ctrlKey) {
        direction = -direction;
      }

      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      this.stage.scale({ x: newScale, y: newScale });

      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.stage.position(newPos);
    })
  }

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

    // if stage scaled draggable
    if(this.zoomValue !== 5) {
      this.stage.draggable(true);
    } else if (this.zoomValue === 5) {
      this.stage.draggable(false);
      this.stage.x(0);
      this.stage.y(0);
    }


  }

  drawElements(): void {
    for (let i = 0; i < this.allElements.length; i++) {
      if(this.allElements[i].roomId == this.currentRoomId){
        this.drawElement(this.allElements[i].element, this.allElements[i].elementtyp, this.allElements[i].place, this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].bgClr)
      }
    }
  }

  updateVisualisation(width: number, height: number): void {

    this.setButtons();

    if (width >= this.minWidth && width <= this.maxWidth && height >= this.minHeight && height <= this.maxHeight) {
      this.widthMeter = width;
      this.heightMeter = height;
      this.stage = new Konva.Stage({
        container: 'roomvisualiser',   // id of container <div>
        width: this.widthStage,
        height: this.heightStage,
      });
      this.calculateMeter(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
      let backgroundLayer = new Konva.Layer();
      for (let i = 0; i < this.standardRooms[this.currentRoomId].width; i++) {
        for (let j = 0; j < this.standardRooms[this.currentRoomId].height; j++) {
          let rect = new Konva.Rect({
            x: i * this.meterInPixel,
            y: j * this.meterInPixel,
            width: this.meterInPixel,
            height: this.meterInPixel,
            fill: '#e2e2e2',
            stroke: '#000',
            strokeWidth: .2
          });
          backgroundLayer.add(rect);
        }
      }
      this.stage.add(backgroundLayer);
    }
    this.calculateElements();
    this.layerElements = new Konva.Layer();
    this.drawElements();
    this.zoomStage();
    this.changeStageScale();
  }

  calculateMeter(width: number, height: number): void {
    if(width > height) {
      this.meterInPixel = Math.floor(this.widthStage / width);
    } else {
      this.meterInPixel = Math.floor(this.widthStage / height);
    }
  }

  calculateElements(): void {
    this.widthSmallDesk = this.meterInPixel * 1.2;
    this.heightSmallDesk = this.meterInPixel * .7;
    this.widthBigDesk = (this.meterInPixel * 2) * 1.2;
    this.heightBigDesk = (this.meterInPixel) * .7;
    this.widthChair = this.meterInPixel * .4;
    this.heightChair = this.meterInPixel * .3;
    this.positionXDeleteIcon = this.widthSmallDesk * .9;
    this.positionXDeleteIcon2 = (this.widthSmallDesk * 2) * .95;
    this.positionYDeleteIcon = this.widthSmallDesk * .1;
    this.radiusDeleteIcon = this.widthSmallDesk * .06;
    this.radiusSmallDesk = Math.floor((this.meterInPixel * 1.2) / 2);
    this.radiusBigDesk = Math.floor((this.meterInPixel * 1.2) / 1.5);
    this.radiusSmallTriangle = Math.floor(this.meterInPixel / 2) * 1.2;
  }

  deleteElem(): void {
    console.log(this.currentId)
    this.allElements.splice(this.currentId,1);

    for(let i = 0; i < this.allElements.length; i++) {
      this.allElements[i].id = i;
    }
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height)
  }

  drawElement(element: string, elementtyp: string, place: number, id: number, x: number, y: number, rotation: number, bgClr: string): void {

    //Step 1
    this.stage.add(this.layerElements);

    //Step 2
    let elemente: any[] = [];

    // If the object is a small square desk
    if(element == 'desk' && elementtyp == 'eckig' && place == 1){
      let desktop = new Konva.Rect({
        width: this.widthSmallDesk,
        height: this.heightSmallDesk,
        fill: bgClr,
      })
      let chair = new Konva.Rect({
        x: this.meterInPixel * 0.4,
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
      });
      elemente.push(desktop)
      elemente.push(chair)
    }
    // If the object is a big square desk
    else if(element == 'desk' && elementtyp == 'eckig' && place == 2) {
      let desk = new Konva.Rect({
        width: this.widthBigDesk,
        height: this.heightBigDesk,
        fill: bgClr,
      })
      let chair1 = new Konva.Rect({
        x: this.meterInPixel * .4,
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
      });
      let chair2 = new Konva.Rect({
        x: (this.meterInPixel * .4) + (this.meterInPixel * 1.2),
        y: this.meterInPixel * 0.75,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
      });
      elemente.push(desk)
      elemente.push(chair1)
      elemente.push(chair2)
    }
    // If the object is a small round desk
    else if(element == 'desk' && elementtyp == 'rund' && place == 1) {
      let desk = new Konva.Circle({
        x: this.radiusSmallDesk,
        y: this.radiusSmallDesk,
        radius: this.radiusSmallDesk,
        fill: bgClr,
      })
      let chair = new Konva.Rect({
        x: this.meterInPixel * 0.4,
        y: this.meterInPixel * 1.25,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
      });
      elemente.push(desk)
      elemente.push(chair)
    }
    // If the object is a big round desk
    else if(element == 'desk' && elementtyp == 'rund' && place == 2) {
      let desk = new Konva.Circle({
        x: this.radiusBigDesk,
        y: this.radiusBigDesk,
        radius: this.radiusBigDesk,
        fill: bgClr,
      })
      let chair1 = new Konva.Rect({
        x: 0,
        y: this.meterInPixel * 1.25,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        rotation: 45,
      });
      let chair2 = new Konva.Rect({
        x: this.meterInPixel * 1.5,
        y: -this.meterInPixel * .2,
        width: this.widthChair,
        height: this.heightChair,
        fill: bgClr,
        rotation: 45,
      });
      elemente.push(desk)
      elemente.push(chair1)
      elemente.push(chair2)
    }
    // If the object is a left oriented door
    else if(element == 'door' && elementtyp == 'left') {
      let door1 = new Konva.Rect({
        width: this.meterInPixel * 0.06,
        height: this.meterInPixel,
        fill: bgClr,
      })
      let door2 = new Konva.Rect({
        width: this.meterInPixel * 0.03,
        height: this.meterInPixel,
        fill: bgClr,
        rotation:-this.meterInPixel * 0.1,
      })
      elemente.push(door1)
      elemente.push(door2)
    }
    // If the object is a right oriented door
    else if(element == 'door' && elementtyp == 'right') {
      let door1 = new Konva.Rect({
        width: this.meterInPixel * 0.06,
        height: this.meterInPixel,
        fill: bgClr,
      })
      let door2 = new Konva.Rect({
        x:this.meterInPixel * 0.22,
        width: this.meterInPixel * 0.03,
        height: this.meterInPixel,
        fill: bgClr,
        rotation:this.meterInPixel * 0.1,
      })
      elemente.push(door1)
      elemente.push(door2)
    }
    // If the object is a middle oriented door
    else if(element == 'door' && elementtyp == 'middle') {
      let door = new Konva.Rect({
        width: this.meterInPixel * 0.06,
        height: this.meterInPixel,
        fill: bgClr,
      })
      let door1 = new Konva.Rect({
        x:this.meterInPixel * 0.02,
        width: this.meterInPixel * 0.03,
        height: this.meterInPixel*.5,
        fill: bgClr,
        rotation:-this.meterInPixel * 0.1,
      })
      let door2 = new Konva.Rect({
        x:this.meterInPixel * 0.12,
        y:this.meterInPixel*.5,
        width: this.meterInPixel * 0.03,
        height: this.meterInPixel*.5,
        fill: bgClr,
        rotation:this.meterInPixel * 0.1,
      })
      elemente.push(door)
      elemente.push(door1)
      elemente.push(door2)
    }
    // If the object is a left window
    else if(element == 'window' && elementtyp == 'left') {
      let window1 = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.meterInPixel * .1,
        height: this.meterInPixel * 2,
        fill: bgClr,
        cornerRadius: this.meterInPixel * .01,
        stroke: '#777',
        strokeWidth: 1,
      });
      let window2 = new Konva.Rect({
        x: -this.meterInPixel * .15,
        y: this.meterInPixel * .05,
        width: this.meterInPixel * .05,
        height: this.meterInPixel * 1.9,
        fill: bgClr,
        cornerRadius: this.meterInPixel * .01,
        stroke: '#777',
        strokeWidth: 1,
        rotation: -6
      });
      elemente.push(window1)
      elemente.push(window2)
    }
    // If the object is a right window
    else if(element == 'window' && elementtyp == 'right') {
      let window1 = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.meterInPixel * .1,
        height: this.meterInPixel * 2,
        fill: bgClr,
      });
      let window2 = new Konva.Rect({
        x: this.meterInPixel * .05,
        y: this.meterInPixel * .05,
        width: this.meterInPixel * .05,
        height: this.meterInPixel * 1.9,
        fill: bgClr,
        rotation: 6
      });
      elemente.push(window1)
      elemente.push(window2)
    }
    // If the object is a middle window
    else if(element == 'window' && elementtyp == 'middle') {
      let window1 = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.meterInPixel * .1,
        height: this.meterInPixel * 2,
        fill: bgClr,
      });
      let window2 = new Konva.Rect({
        x: 0,
        y: this.meterInPixel * .05,
        width: this.meterInPixel * .05,
        height: this.meterInPixel * .9,
        fill: bgClr,
        rotation: 10
      });
      let window3 = new Konva.Rect({
        x: - this.meterInPixel * .15,
        y: this.meterInPixel * 1.05,
        width: this.meterInPixel * .05,
        height: this.meterInPixel * .9,
        fill: bgClr,
        rotation: 350
      });
      elemente.push(window1)
      elemente.push(window2)
      elemente.push(window3)
    }
    let circle = new Konva.Circle({
      radius: this.meterInPixel * 0.1,
      fill: 'red',
    });

    //Step 3
    let groupElements = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
    })

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
    })

    //Step 7
    this.layerElements.add(tr);

    //Step 8
    groupElements.on('mouseenter', function () {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'move';
    });

    groupElements.on('mouseout', function () {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'default';
    });

    groupElements.on('click', (e) => {
      tr.nodes([groupElements]);
      this.currentId = id;
      tr.add(circle);
    });

    groupElements.on('mouseenter', function () {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'move';
    });

    groupElements.on('mouseout', function () {
      let x: any = groupElements.getStage();
      x.container().style.cursor = 'default';
    });

    groupElements.on('transform dragmove', (data) => {
      groupElements.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupElements.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupElements.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupElements.y());
    });

    groupElements.on('transformend dragend', (data) => {

      let idX = 'elx'+id;
      let elemtX: any = document.getElementById(idX);
      //elemtX.value = 0;



      let stageWidth = this.widthStage
      let objWidth: number = Math.floor(groupElements.getClientRect().width);
      let xPos: number = Math.floor(groupElements.getClientRect().x);
      let objectEnd: number = xPos + objWidth;
      let xEndController: number = stageWidth - objectEnd;

      if(xEndController < 0){
        xEndController *= -1;

        elemtX.value = (stageWidth - (objWidth))

      } else {

      }





      this.updateElements(id);

      //console.log(groupElements.getClientRect().x)
    });

    circle.on('click', (event) => {
      this.isToDelete = true;
      this.currentId = id;
    });
  }

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
      pdf.text('Klasse AC12 | KW 12',30,12);
      pdf.setFontSize(50);
      pdf.addImage(img, 'PNG',6,20,200,200);
      pdf.save('room.pdf');
    })
  }

  downloadAsImage() {
    let dataURL = this.stage.toDataURL({ pixelRatio: 3 });
    let link: any = document.createElement('a');
    link.download = 'myroom';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.download;
  }

  reset(): void {
    this.allElements = JSON.parse(JSON.stringify(objectsData));
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
    this.isRoomSaved = false;
    let c: any = document.getElementById('standardRoomsChanger');
    c.style.display = 'flex';
    c.style.alignItems = 'center';
    c.style.gap = '20px';
    c.style.visibility = 'visible';
    this.setButtons();
    sessionStorage.removeItem('room');
    sessionStorage.removeItem('roomDimension');
  }

  makeRoomDetailsReady() {
    this.roomElements = [];
    let roomId: number = this.currentRoomId;
    this.elementsNumber[0].number = 0;
    this.elementsNumber[1].number = 0;
    this.elementsNumber[2].number = 0;

    for(let elem of this.allElements) {
      if(elem.roomId === roomId) {
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
      }
    }
  }

  saveRoom() {

    this.route.navigate(['mainmenu']);

    for(let element of this.roomElements) {
      element.roomId = 0;
    }

    sessionStorage.setItem("room", JSON.stringify(this.roomElements));
    console.log(this.roomElements)
    let roomStage: any = {
      "width": this.standardRooms[this.currentRoomId].width,
      "height":  this.standardRooms[this.currentRoomId].height,
    }
    console.log(roomStage)
    sessionStorage.setItem("roomDimension", JSON.stringify(roomStage));

  }

  changeColor($event: ColorEvent): void {
    this.primaryColor = $event.color.hex;
    let element: any = document.getElementById('colorPickerTrigger');
    element.style.backgroundColor = this.primaryColor;
  }

  handleAccept(): void {
    this.showPicker = false;
    // Property color for the specific object is to change
    if(this.currentId !== undefined) {
      this.allElements[this.currentId].bgClr = this.primaryColor;
      this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
      this.currentId = undefined;
    }
  }

  handleCancel(): void {
    this.showPicker = false;
    //
  }

  //Export room as CSV File

  ExportAsCsv(){
    this.makeRoomDetailsReady();

    for(let element of this.roomElements) {
      element.roomId = 0;
    }
    let roomStage: any = {
      "width": this.standardRooms[this.currentRoomId].width,
      "height":  this.standardRooms[this.currentRoomId].height,
    }

     this.roomElements.push(roomStage)
     console.log(this.roomElements)

      var options = {
        fieldSeparator: ',',
        quoteStrings: '',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: false,
        headers: ["RoomInfos"]
    };
       new ngxCsv(this.roomElements, "Room", options);
    }

}
