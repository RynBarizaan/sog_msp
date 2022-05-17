import {Component, OnInit, SimpleChanges} from '@angular/core';
import Konva from 'konva';
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas";
import objectsData from './objects.json';
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
  firstname1?: string;
  lastname1?: string;
  firstname2?: string | "Vorname2";
  lastname2?: string | "Nachname2";
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor() {
  }

  standardRooms: {"id": number, "name": string, "width": number, "height": number}[] = [
    {
      "id": 0,
      "name": "Unterricht",
      "width": 6,
      "height": 6
    },
    {
      "id": 1,
      "name": "Konferenz",
      "width": 12,
      "height": 12
    },
    {
      "id": 2,
      "name": "Workshop",
      "width": 15,
      "height": 15
    },
    {
      "id": 3,
      "name": "Customised Room",
      "width": 6,
      "height": 6
    }
  ]

  // Elements for all standard rooms
  allElementsKopie: Object[] = JSON.parse(JSON.stringify(objectsData));
  allElements: Object[] = JSON.parse(JSON.stringify(objectsData));

  // Stage
  currentRoomId: number = 0;
  widthStage: number = 700;
  heightStage: number = 700;
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

  // Add Element
  isToAddDesk: boolean = false;
  isToAddDoor: boolean = false;
  isToAddWindow: boolean = false;
  // Delete Element
  isToDelete: boolean = false;
  currentId?: any;
  // Units
  units: string[] = ['m', 'cm', 'mm'];
  vorselectedUnit: string = 'm';
  selectedUnit: string = 'm';
  // Link dimension
  islinked: boolean = false;
  // Min and max stage in meter
  minWidth: number = 5;
  maxWidth: number = 30;
  minHeight: number = 5;
  maxHeight: number = 30;
  // Pre elements to add
  deskToAdd: {elementtyp: string, place: number, x:number, y: number, degRotation: number} =
    {
      "elementtyp": "eckig",
      "place": 1,
      "x": 0,
      "y": 0,
      "degRotation": 0,
    };

  doorToAdd: {elementtyp: string, x:number, y: number, degRotation: number} =
    {
      "elementtyp": "linksöffnend",
      "x": 0,
      "y": 0,
      "degRotation": 0,
    };

  windowToAdd: {elementtyp: string, x:number, y: number, degRotation: number} =
    {
      "elementtyp": "middle",
      "x": 0,
      "y": 0,
      "degRotation": 0,
    };

  // zooming stage
  zoomValue: number = 5;


  addDesk(elementtyp: string, place: number, x: number, y: number, rotation: number): void {
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
      "firstname1": 'Vorname',
      "lastname1": 'Nachname',
      "firstname2": 'Vorname-2',
      "lastname3": 'Nachname-2',
    }

    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }
  addDoor(elementtyp: string, x: number, y: number, rotation: number): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'door',
      "elementtyp": elementtyp,
      "factory": elementtyp.split(/[a-z]/,1).toString().toLowerCase(),
      "x": x,
      "y": y,
      "degRotation": rotation,
    }

    this.allElements.push(desk);
    this.layerElements.destroy();
    this.drawElements();
  }
  addWindow(elementtyp: string, x: number, y: number, rotation: number): void {
    let desk: any = {
      "id": this.allElements.length,
      "roomId": this.currentRoomId,
      "element": 'window',
      "elementtyp": elementtyp,
      "factory": elementtyp.split(/[a-z]/,1).toString().toLowerCase(),
      "x": x,
      "y": y,
      "degRotation": rotation,
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

  ngOnInit() {

    this.isToDelete = true;
    this.isToDelete = false;
    this.setButtons();

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
          fill: '#dedede',
          stroke: '#fff',
          strokeWidth: 1
        });
        backgroundLayer.add(rect);
      }
    }
    this.stage.add(backgroundLayer);
    this.drawElements();
    this.zoomStage();



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
      if(this.allElements[i].element == "desk"){
        if(this.allElements[i].roomId == this.currentRoomId) {
          let splittedFactory: any[] = this.allElements[i].factory.split("-");
          for (let l = 0; l < 1; l++) {
            switch (splittedFactory[l]) {
              case ('s'): {
                if(splittedFactory[l+1] === 's') {
                  this.deskSquareSmall(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1);
                } else {
                  this.deskSquareBig(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1, this.allElements[i].firstname2, this.allElements[i].lastname2);
                }
                break;
              }
              case ('r'): {
                if(splittedFactory[l+1] === 's') {
                  this.deskRoundSmall(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1);
                } else {
                  this.deskRoundBig(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1, this.allElements[i].firstname2, this.allElements[i].lastname2);
                }
                break;
              }
              case ('t'): {
                if(splittedFactory[l+1] === 's') {
                  this.deskTriangleSmall(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1);
                } else {
                  this.deskTriangleBig(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation, this.allElements[i].firstname1, this.allElements[i].lastname1, this.allElements[i].firstname2, this.allElements[i].lastname2);
                }
                break;
              }
              default:
                break;
            }
          }
        }
      } else if (this.allElements[i].element == "door") {
        if(this.allElements[i].roomId == this.currentRoomId) {
          for (let l = 0; l < 1; l++) {
            switch (this.allElements[i].factory) {
              case ('l'): {
                this.doorLeft(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              case ('r'): {
                this.doorRight(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              case ('m'): {
                this.doorMiddle(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              default:
                break;
            }
          }
        }
      } else if (this.allElements[i].element == "window") {
        if(this.allElements[i].roomId == this.currentRoomId) {
          for (let l = 0; l < 1; l++) {
            switch (this.allElements[i].factory) {
              case ('l'): {
                this.windowLeft(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              case ('r'): {
                this.windowRight(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              case ('m'): {
                this.windowMiddle(this.allElements[i].id, this.allElements[i].x, this.allElements[i].y, this.allElements[i].degRotation);
                break;
              }
              default:
                break;
            }
          }
        }
      }
    }
  }

  updateVisualisation(width: number, height: number): void {

    this.isToDelete = true;
    this.isToDelete = false;

    this.setButtons();

    if (width >= this.minWidth && width <= this.maxWidth && height >= this.minHeight && height <= this.maxHeight) {
      this.widthMeter = width;
      this.heightMeter = height;
      this.stage = new Konva.Stage({
        container: 'roomvisualiser',   // id of container <div>
        width: this.widthStage,
        height: this.heightStage
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
            fill: '#ddd',
            stroke: '#fff',
            strokeWidth: 1
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
    this.allElements.splice(this.currentId,1);
    for(let i = 0; i < this.allElements.length; i++) {
      this.allElements[i].id = i;
    }
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height)
  }

  // Desks Factory
  deskRoundSmall(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string): void {
    this.stage.add(this.layerElements);
    let desktop = new Konva.Circle({
      x: this.radiusSmallDesk,
      y: this.radiusSmallDesk,
      radius: this.radiusSmallDesk,
      fill: 'white',
      stroke: '#777',
      strokeWidth: 1
    })
    let chair = new Konva.Rect({
      x: this.meterInPixel * 0.4,
      y: this.meterInPixel * 1.25,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    });
    let circle = new Konva.Circle({
      x: this.positionXDeleteIcon,
      y: this.positionYDeleteIcon,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
    });
    let text = new Konva.Text({
      x: this.meterInPixel * 0.1,
      y: this.meterInPixel * 0.35,
      //text: `${id}\n${firstname1}\n${lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let groupSmallDesk = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      rotation: rotation
    })
    groupSmallDesk.add(desktop);
    groupSmallDesk.add(chair);
    groupSmallDesk.add(text);
    this.layerElements.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupSmallDesk.on('click', (e) => {
      tr.nodes([groupSmallDesk]);
      tr.add(circle);
    });

    groupSmallDesk.on('mouseenter', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'move';
    });

    groupSmallDesk.on('mouseout', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'default';
    });

    groupSmallDesk.on('transform dragmove', function (data): void {
      groupSmallDesk.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupSmallDesk.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupSmallDesk.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupSmallDesk.y());
    });


    circle.on('click', function (event) {
      groupSmallDesk.destroy();
      tr.destroy();
    });
  }
  deskRoundBig(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string, firstname2?: string, lastname2?: string): void {
    this.stage.add(this.layerElements);
    let desktop = new Konva.Circle({
      x: this.radiusBigDesk,
      y: this.radiusBigDesk,
      radius: this.radiusBigDesk,
      fill: 'white',
      stroke: '#777',
      strokeWidth: 1
    })
    let chair1 = new Konva.Rect({
      x: 0,
      y: this.meterInPixel * 1.25,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1,
      rotation: 45,
    });
    let chair2 = new Konva.Rect({
      x: this.meterInPixel * 1.5,
      y: -this.meterInPixel * .2,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1,
      rotation: 45,
    });
    let circle = new Konva.Circle({
      x: this.meterInPixel * 1.68,
      y: -this.meterInPixel * .1,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
    });
    let text1 = new Konva.Text({
      x: this.meterInPixel * 0.3,
      y: this.meterInPixel * 0.2,
      //text: `${this.allElements[id].id}\n${this.allElements[id].firstname1}\n${this.allElements[id].lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let text2 = new Konva.Text({
      x: this.meterInPixel * 0.3,
      y: this.meterInPixel * 0.85,
      //text: `${this.allElements[id].id}\n${this.allElements[id].firstname2}\n${this.allElements[id].lastname2}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let groupSmallDesk = new Konva.Group({
      x: x + (this.meterInPixel * .23),
      y: y + (this.meterInPixel * .22),
      draggable: true,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      rotation: rotation
    })
    groupSmallDesk.add(desktop);
    groupSmallDesk.add(chair1);
    groupSmallDesk.add(chair2);
    groupSmallDesk.add(text1);
    groupSmallDesk.add(text2);
    this.layerElements.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupSmallDesk.on('click', (e) => {
      tr.nodes([groupSmallDesk]);
      tr.add(circle);
    });

    groupSmallDesk.on('mouseenter', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'move';
    });

    groupSmallDesk.on('mouseout', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'default';
    });

    groupSmallDesk.on('transform dragmove', function (data): void {
      groupSmallDesk.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupSmallDesk.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupSmallDesk.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupSmallDesk.y());
    });


    circle.on('click', function (event) {
      groupSmallDesk.destroy();
      tr.destroy();
    });
  }
  deskSquareSmall(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string): void {
    this.stage.add(this.layerElements);
    let desktop = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.widthSmallDesk,
      height: this.heightSmallDesk,
      fill: 'white',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    })
    let chair = new Konva.Rect({
      x: this.meterInPixel * 0.4,
      y: this.meterInPixel * 0.75,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    });
    let circle = new Konva.Circle({
      x: this.positionXDeleteIcon,
      y: -20,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });
    let text = new Konva.Text({
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      //text: `${firstname1}\n${lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let groupSmallDesk = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      rotation: rotation,
      name: `${id}`,
    })
    groupSmallDesk.add(desktop);
    groupSmallDesk.add(chair);
    groupSmallDesk.add(text);

    this.layerElements.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredRotation: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupSmallDesk.on('mouseenter', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'move';
    });

    groupSmallDesk.on('mouseout', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'default';
    });


    groupSmallDesk.on('click', (e) => {
      tr.nodes([groupSmallDesk]);
      tr.add(circle);
    });

    groupSmallDesk.on('mouseenter', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'move';
    });

    groupSmallDesk.on('mouseout', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'default';
    });

    groupSmallDesk.on('transform dragmove', (data) => {
      groupSmallDesk.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupSmallDesk.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupSmallDesk.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupSmallDesk.y());
    });

    groupSmallDesk.on('transformend dragend', (data) => {
      let iddesk: number = parseInt(data.target.name());
      this.updateElements(iddesk);
    });

    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }
  deskSquareBig(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string, firstname2?: string, lastname2?: string): void {
    this.stage.add(this.layerElements);
    let desk = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.widthBigDesk,
      height: this.heightBigDesk,
      fill: 'white',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    })
    let chair1 = new Konva.Rect({
      x: this.meterInPixel * .4,
      y: this.meterInPixel * 0.75,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    });
    let chair2 = new Konva.Rect({
      x: (this.meterInPixel * .4) + (this.meterInPixel * 1.2),
      y: this.meterInPixel * 0.75,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: this.meterInPixel * .05,
      stroke: '#777',
      strokeWidth: 1
    });
    let text1 = new Konva.Text({
      x: this.meterInPixel * 0.05 + (this.meterInPixel * 1.2),
      y: this.meterInPixel * 0.05,
      //text: `${id}\n${firstname1}\n${lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let text2 = new Konva.Text({
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      //text: `${this.allElements[id].id}\n${this.allElements[id].firstname2}\n${this.allElements[id].lastname2}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let circle = new Konva.Circle({
      x: this.positionXDeleteIcon2,
      y: this.positionYDeleteIcon,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
    });
    let groupSmallDesk = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      rotation: rotation
    })
    groupSmallDesk.add(desk);
    groupSmallDesk.add(chair1);
    groupSmallDesk.add(chair2);
    groupSmallDesk.add(text1);
    groupSmallDesk.add(text2);
    this.layerElements.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupSmallDesk.on('click', (e) => {
      tr.nodes([groupSmallDesk]);
      tr.add(circle);
    });

    groupSmallDesk.on('mouseenter', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'move';
    });

    groupSmallDesk.on('mouseout', function () {
      let x: any = groupSmallDesk.getStage();
      x.container().style.cursor = 'default';
    });

    groupSmallDesk.on('transform dragmove', function (data): void {
      groupSmallDesk.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupSmallDesk.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupSmallDesk.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupSmallDesk.y());
    });
    circle.on('click', function (event) {
      groupSmallDesk.destroy();
      tr.destroy();
    });
  }
  deskTriangleSmall(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string): void {
    console.log('deskTriangleSmall')
  }
  deskTriangleBig(id: number, x: number, y: number, rotation: number, firstname1?: string, lastname1?: string, firstname2?: string, lastname2?: string): void {
    console.log('deskTriangleBig')
  }
  // Doors Factory
  doorLeft(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let door = new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1
    })
    let door1 = new Konva.Rect({
      x: 2,
      y: 5,
      width: 5,
      height: 90,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation:-10,
    })

    let circle = new Konva.Circle({
      x: 30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });

    let groupDoor = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })

    groupDoor.add(door1);
    groupDoor.add(door);
    this.layerElements.add(groupDoor);
    let tr = new Konva.Transformer({
      centeredRotation: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupDoor.on('click', (e) => {
      tr.nodes([groupDoor]);
        tr.add(circle);
    });

    groupDoor.on('transform dragmove', (data) => {
      groupDoor.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupDoor.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupDoor.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupDoor.y());
    });


    groupDoor.on('transformend dragend', (data) => {
      let iddesk: number = parseInt(data.target.name());
      this.updateElements(iddesk);
    });

    groupDoor.on('mouseenter', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'move';
    });

    groupDoor.on('mouseout', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'default';
    });


    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });




  }
  doorRight(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let door = new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1
    })
    let door1 = new Konva.Rect({
      x: 18,
      y: 5,
      width: 5,
      height: 90,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation:10,
    })

    let circle = new Konva.Circle({
      x: 30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });

    let groupDoor = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })

    groupDoor.add(door1);
    groupDoor.add(door);
    this.layerElements.add(groupDoor);
    let tr = new Konva.Transformer({
      centeredRotation: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupDoor.on('click', (e) => {
      tr.nodes([groupDoor]);
      tr.add(circle);
    });

    groupDoor.on('mouseenter', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'move';
    });

    groupDoor.on('mouseout', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'default';
    });

    groupDoor.on('transform dragmove', (data) => {
      groupDoor.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupDoor.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupDoor.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupDoor.y());
    });


    groupDoor.on('transformend dragend', (data) => {
      let iddesk: number = parseInt(data.target.name());
      this.updateElements(iddesk);
    });


    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }
  doorMiddle(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let door = new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1
    })
    let door1 = new Konva.Rect({
      x: 5,
      y: 5,
      width: 5,
      height: 45,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation:-25,
    })
    let door2 = new Konva.Rect({
      x: 24,
      y: 54,
      width: 5,
      height: 45,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation:25,
    })

    let circle = new Konva.Circle({
      x: 30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });

    let groupDoor = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })

    groupDoor.add(door1);
    groupDoor.add(door2);
    groupDoor.add(door);
    this.layerElements.add(groupDoor);
    let tr = new Konva.Transformer({
      centeredRotation: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    groupDoor.on('click', (e) => {
      tr.nodes([groupDoor]);
      tr.add(circle);
    });

    groupDoor.on('mouseenter', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'move';
    });

    groupDoor.on('mouseout', function () {
      let x: any = groupDoor.getStage();
      x.container().style.cursor = 'default';
    });

    groupDoor.on('transform dragmove', (data) => {
      groupDoor.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(groupDoor.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(groupDoor.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(groupDoor.y());
    });


    groupDoor.on('transformend dragend', (data) => {
      let iddesk: number = parseInt(data.target.name());
      this.updateElements(iddesk);
    });


    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }
  // Windows Factory
  windowLeft(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let window1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.meterInPixel * .1,
      height: this.meterInPixel * 2,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
    });
    let window2 = new Konva.Rect({
      x: -this.meterInPixel*.15,
      y: this.meterInPixel * .05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * 1.9,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation: -6
    });


    let circle = new Konva.Circle({
      x: -30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });
    let windowGroup = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })

    windowGroup.add(window2);
    windowGroup.add(window1);

    this.layerElements.add(windowGroup)
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    windowGroup.on('click', (e) => {
      tr.nodes([windowGroup]);
      tr.add(circle);
    });

    windowGroup.on('mouseenter', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'move';
    });

    windowGroup.on('mouseout', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'default';
    });

    windowGroup.on('transform dragmove', (data) => {
      windowGroup.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(windowGroup.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(windowGroup.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(windowGroup.y());
    });


    windowGroup.on('transformend dragend', (data) => {
      let idwindow: number = parseInt(data.target.name());
      this.updateElements(idwindow);
    });


    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }
  windowRight(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let window1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.meterInPixel * .1,
      height: this.meterInPixel * 2,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
    });
    let window2 = new Konva.Rect({
      x: this.meterInPixel * .05,
      y: this.meterInPixel * .05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * 1.9,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation: 6
    });


    let circle = new Konva.Circle({
      x: -30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });
    let windowGroup = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })

    windowGroup.add(window2);
    windowGroup.add(window1);

    this.layerElements.add(windowGroup)
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);

    windowGroup.on('click', (e) => {
      tr.nodes([windowGroup]);
      tr.add(circle);
    });

    windowGroup.on('mouseenter', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'move';
    });

    windowGroup.on('mouseout', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'default';
    });

    windowGroup.on('transform dragmove', (data) => {
      windowGroup.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(windowGroup.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(windowGroup.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(windowGroup.y());
    });


    windowGroup.on('transformend dragend', (data) => {
      let idwindow: number = parseInt(data.target.name());
      this.updateElements(idwindow);
    });


    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }
  windowMiddle(id: number, x: number, y: number, rotation: number): void {
    this.stage.add(this.layerElements);
    let window1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.meterInPixel * .1,
      height: this.meterInPixel * 2,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
    });
    let window2 = new Konva.Rect({
      x: 0,
      y: this.meterInPixel * .05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * .9,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation: 10
    });
    let window3 = new Konva.Rect({
      x: - this.meterInPixel * .15,
      y: this.meterInPixel * 1.05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * .9,
      fill: 'white',
      cornerRadius: this.meterInPixel * .01,
      stroke: '#777',
      strokeWidth: 1,
      rotation: 350
    });
    let circle = new Konva.Circle({
      x: -30,
      y: 0,
      radius: this.radiusDeleteIcon,
      fill: 'red',
      stroke: '#777',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 3,
      shadowOpacity: 0.5,
      name: `${id}`,
    });
    let windowGroup = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: rotation,
      name: `${id}`,
    })
    windowGroup.add(window3);
    windowGroup.add(window2);
    windowGroup.add(window1);
    this.layerElements.add(windowGroup)
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerElements.add(tr);
    windowGroup.on('click', (e) => {
      tr.nodes([windowGroup]);
      tr.add(circle);
    });
    windowGroup.on('mouseenter', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'move';
    });

    windowGroup.on('mouseout', function () {
      let x: any = windowGroup.getStage();
      x.container().style.cursor = 'default';
    });
    windowGroup.on('transform dragmove', (data) => {
      windowGroup.add(circle);
      let idElementr = 'elr'+id;
      let elemr: any = document.getElementById(idElementr);
      elemr.value = Math.floor(windowGroup.rotation());
      let idElementx = 'elx'+id;
      let elemx: any = document.getElementById(idElementx);
      elemx.value = Math.floor(windowGroup.x());
      let idElementy = 'ely'+id;
      let elemy: any = document.getElementById(idElementy);
      elemy.value = Math.floor(windowGroup.y());
    });
    windowGroup.on('transformend dragend', (data) => {
      let idwindow: number = parseInt(data.target.name());
      this.updateElements(idwindow);
    });
    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
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

  reset(): void {
    this.currentRoomId = 0;
    this.allElements = this.allElementsKopie;
    this.updateVisualisation(this.standardRooms[this.currentRoomId].width,this.standardRooms[this.currentRoomId].height);
  }

  changeUnit(): void {

    if(this.selectedUnit == 'cm') {
      this.minWidth = 500;
      this.maxWidth = 3000;
      this.minHeight = 500;
      this.maxHeight = 3000;
      if(this.vorselectedUnit == 'm'){
        this.standardRooms[0].width *= 100;
        this.standardRooms[0].height *= 100;
      } else if(this.vorselectedUnit == 'mm'){
        this.standardRooms[0].width /= 10;
        this.standardRooms[0].height /= 10;
      }
    }

    if(this.selectedUnit == 'mm') {
      this.minWidth = 5000;
      this.maxWidth = 30000;
      this.minHeight = 5000;
      this.maxHeight = 30000;
      if(this.vorselectedUnit == 'cm'){
        this.standardRooms[0].width *= 10;
        this.standardRooms[0].height *= 10;
      } else if(this.vorselectedUnit == 'm'){
        this.standardRooms[0].width *= 1000;
        this.standardRooms[0].height *= 1000;
      }
    }

    if(this.selectedUnit == 'm') {
      this.minWidth = 5;
      this.maxWidth = 30;
      this.minHeight = 5;
      this.maxHeight = 30;
      if(this.vorselectedUnit == 'cm'){
        this.standardRooms[0].width /= 100;
        this.standardRooms[0].height /= 100;
      } else if(this.vorselectedUnit == 'mm'){
        this.standardRooms[0].width /= 1000;
        this.standardRooms[0].height /= 1000;
      }
    }

    this.vorselectedUnit = this.selectedUnit;

  }




}
