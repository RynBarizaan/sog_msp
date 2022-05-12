import {Component, OnInit, SimpleChanges} from '@angular/core';
import Konva from 'konva';
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  standardRooms: {"id": number, "name": string, "width": number, "height": number}[] = [
    {
      "id": 0,
      "name": "Standard Room 1",
      "width": 9,
      "height": 9
    }
  ]

  roomDesks: {id: number, desktyp: string, place: number, factory: string, x: number, y: number, degRotation: number, firstname1: string, lastname1: string, firstname2?: string, lastname2?: string}[] = [
    {"id": 0, "desktyp": "eckig", "place": 1, "factory": "s-s-6", "x": 150, "y": 50, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 1, "desktyp": "eckig", "place": 1, "factory": "s-s-6", "x": 450, "y": 50, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 2, "desktyp": "eckig", "place": 1, "factory": "s-s-1", "x": 150, "y": 200, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 3, "desktyp": "eckig", "place": 1, "factory": "s-s-2", "x": 450, "y": 200, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 4, "desktyp": "eckig", "place": 1, "factory": "s-s-3", "x": 150, "y": 350, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 5, "desktyp": "eckig", "place": 1, "factory": "s-s-4", "x": 450, "y": 350, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 6, "desktyp": "eckig", "place": 1, "factory": "s-s-5", "x": 150, "y": 500, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
    {"id": 7, "desktyp": "eckig", "place": 1, "factory": "s-s-6", "x": 450, "y": 500, "degRotation": 0, "firstname1": "Vorname", "lastname1": "Nachname"},
  ]
  roomDoors: { id: number, "factory": string,  x: number, y: number, degRotation: number}[] = [
    {"id": 0, "factory": "l-1", "x": 0, "y": 0, "degRotation": 0},
    {"id": 1, "factory": "r-1", "x": 200, "y": 0, "degRotation": 0},
    {"id": 2, "factory": "m-1", "x": 400, "y": 0, "degRotation": 0},
  ]
  roomWindows: { id: number, "factory": string,  x: number, y: number, degRotation: number}[] = [
    {"id": 0, "factory": "l-1", "x": 100, "y": 600, "degRotation": 0},
    {"id": 1, "factory": "r-1", "x": 100, "y": 600, "degRotation": 0},
    {"id": 2, "factory": "m-1", "x": 100, "y": 600, "degRotation": 0},
  ]





  visualisedRoom: number = 0;
  widthStage: number = 700;
  heightStage: number = 700;
  meterInPixel: number = Math.floor(this.widthStage / this.standardRooms[this.visualisedRoom].width);
  widthMeter: number = this.standardRooms[0].width;
  heightMeter: number = this.standardRooms[0].height;
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
  stageWidthInMeter?: number;
  stageHeightInMeter?: number;

  units: string[] = ['m', 'cm', 'mm'];
  vorselectedUnit: string = 'm';
  selectedUnit: string = 'm';
  islinked: boolean = false;

  minWidth: number = 5;
  maxWidth: number = 30;
  minHeight: number = 5;
  maxHeight: number = 30;

  stage?: any;
  layerDesks?: any;
  layerDoors?: any;
  layerWindows?: any;

  isToDelete: boolean = false;
  isToAdd: boolean = false;
  currentId?: any;
  selectedElement?: number;

  deskToAdd: any =
    {
      "desktyp": 'eckig',
      "place": 1,
      "x": 0,
      "y": 0,
      "degRotation": 0,
    };

  constructor() {
  }

  addDesk(desktyp: string, place: number, x: number, y: number, rotation: number): void {
    let desk: any = {
      "id": this.roomDesks.length,
      "desktyp": desktyp,
      "place": place,
      "factory": this.factoryCodeConstructor(desktyp, place, this.roomDesks.length),
      "x": x,
      "y": y,
      "degRotation": rotation,
      "firstname1": 'Max',
      "lastname1": 'Mustermann',
      "firstname2": 'Max',
      "lastname2": 'Mustermann',
    }
    this.roomDesks.push(desk);
    this.layerDesks.destroy();
    this.drawDesks();
  }

  factoryCodeConstructor(desktyp: string, place: number, id: number) : string {
    console.log(place)
    console.log(desktyp)
    let factCode: string = '';
    if(desktyp == 'eckig') {
      factCode += 's-'
    } else if (desktyp == 'rund') {
      factCode += 'r-'
    } else if (desktyp == 'dreieckig') {
      factCode += 't-'
    }
    if(place == 1) {
      factCode += 's-';
    } else if(place == 2) {
      factCode += 'b-';
    }
    factCode += id;
    console.log(factCode)
    return factCode;
  }

  updateDesks(id: number): void {
    let idx = 'elx'+id;
    let x : any = document.getElementById(idx);
    this.roomDesks[id].x = x.valueAsNumber;
    let idy = 'ely'+id;
    let y : any = document.getElementById(idy);
    this.roomDesks[id].y = y.valueAsNumber;
    let idr = 'elr'+id;
    let r : any = document.getElementById(idr);
    this.roomDesks[id].degRotation = r.valueAsNumber;
    //console.log(this.roomDesks[id])
    this.layerDesks.destroy();
    this.drawDesks();
  }

  ngOnInit() {
    this.stage = new Konva.Stage({
      container: 'roomvisualiser',
      width: this.widthStage,
      height: this.heightStage,
    });

    this.calculateMeter(this.standardRooms[0].width,this.standardRooms[0].height);
    this.calculateElements();
    let backgroundLayer = new Konva.Layer();
    for (let i = 0; i < this.standardRooms[0].width; i++) {
      for (let j = 0; j < this.standardRooms[0].height; j++) {
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

    this.drawDesks();

  }

  drawDesks(): void {
    this.layerDesks = new Konva.Layer();
    for (let i = 0; i < this.roomDesks.length; i++) {
      let splittedFactory: any[] = this.roomDesks[i].factory.split("-");
      for (let l = 0; l < 1; l++) {
        switch (splittedFactory[l]) {
          case ('s'): {
            if(splittedFactory[l+1] === 's') {
              this.deskSquareSmall(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            } else {
              this.deskSquareBig(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            }
            break;
          }
          case ('r'): {
            if(splittedFactory[l+1] === 's') {
              this.deskRoundSmall(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            } else {
              this.deskRoundBig(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            }
            break;
          }
          case ('t'): {
            if(splittedFactory[l+1] === 's') {
              this.deskTriangleSmall(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            } else {
              this.deskTriangleBig(this.roomDesks[i].id, this.roomDesks[i].x, this.roomDesks[i].y, this.roomDesks[i].degRotation, this.roomDesks[i].firstname1, this.roomDesks[i].lastname1);
            }
            break;
          }
          default:
            break;
        }
      }
    }
  }




  updateVisualisation(width: number, height: number): void {

    if(this.selectedUnit == 'm'){
    } else if (this.selectedUnit == 'cm'){
      width /= 1000;
      height /= 1000;
    } else if (this.selectedUnit == 'mm'){
      width /= 10000;
      height /= 10000;
    }

    if (width >= this.minWidth && width <= this.maxWidth && height >= this.minHeight && height <= this.maxHeight) {
      this.widthMeter = width;
      this.heightMeter = height;
      this.stage = new Konva.Stage({
        container: 'roomvisualiser',   // id of container <div>
        width: this.widthStage,
        height: this.heightStage
      });
      this.calculateMeter(this.standardRooms[0].width,this.standardRooms[0].height);
      let backgroundLayer = new Konva.Layer();
      for (let i = 0; i < this.standardRooms[0].width; i++) {
        for (let j = 0; j < this.standardRooms[0].height; j++) {
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
    this.drawDesks();
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

  deleteDesk(): void {
    this.roomDesks.splice(this.currentId,1);
    for(let i = 0; i < this.roomDesks.length; i++) {
      this.roomDesks[i].id = i;
    }
    this.updateVisualisation(this.widthMeter, this.heightMeter);
    this.layerDesks.destroy();
    this.drawDesks();
  }


  // Desks Factory
  deskRoundSmall(id: number, x: number, y: number, rotation: number, firstname: string, lastname: string): void {
    this.stage.add(this.layerDesks);
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
      text: `${id}\n${firstname}\n${lastname}`,
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
    groupSmallDesk.add(circle);
    this.layerDesks.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDesks.add(tr);
    tr.nodes([groupSmallDesk]);

    groupSmallDesk.on('transform dragmove', function (data): void {
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
  deskRoundBig(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    this.stage.add(this.layerDesks);
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
      text: `${this.roomDesks[id].id}\n${this.roomDesks[id].firstname1}\n${this.roomDesks[id].lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let text2 = new Konva.Text({
      x: this.meterInPixel * 0.3,
      y: this.meterInPixel * 0.85,
      text: `${this.roomDesks[id].id}\n${this.roomDesks[id].firstname2}\n${this.roomDesks[id].lastname2}`,
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
    groupSmallDesk.add(circle);
    this.layerDesks.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDesks.add(tr);
    tr.nodes([groupSmallDesk]);

    groupSmallDesk.on('transform dragmove', function (data): void {
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
  deskSquareSmall(id: number, x: number, y: number, rotation: number, firstname: string, lastname: string): void {
    this.stage.add(this.layerDesks);
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
      name: `${id}`,
    });
    let text = new Konva.Text({
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      text: `${id}\n${firstname}\n${lastname}`,
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
    groupSmallDesk.add(circle);
    this.layerDesks.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      centeredRotation: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDesks.add(tr);



    groupSmallDesk.on('click', (e) => {
      tr.nodes([groupSmallDesk]);
    });

    groupSmallDesk.on('transform dragmove', (data) => {
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
      this.updateDesks(iddesk);
    });

    circle.on('click', (event) => {
      let id: any = event.target.name();
      this.currentId = id;
      this.isToDelete = true;
    });
  }

  deskSquareBig(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {

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
      text: `${id}\n${firstname1}\n${lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let text2 = new Konva.Text({
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      text: `${this.roomDesks[id].id}\n${this.roomDesks[id].firstname2}\n${this.roomDesks[id].lastname2}`,
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
    groupSmallDesk.add(circle);
    this.layerDesks.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDesks.add(tr);
    tr.nodes([groupSmallDesk]);

    groupSmallDesk.on('transform dragmove', function (data): void {
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
  deskTriangleSmall(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    this.stage.add(this.layerDesks);
    let desktop = new Konva.Star({
      x: 0,
      y: 0,
      numPoints: 3,
      innerRadius: 30,
      outerRadius: 60,
      fill: 'white',
      stroke: '#999',
      strokeWidth: 2,
      cornerRadius: 10,
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
    groupSmallDesk.add(circle);
    this.layerDesks.add(groupSmallDesk);
    let tr = new Konva.Transformer({
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDesks.add(tr);
    tr.nodes([groupSmallDesk]);

    groupSmallDesk.on('transform dragmove', function (data): void {
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
  deskTriangleBig(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    console.log('deskTriangleBig')
  }
  // Doors Factory
  doorLeft(id: number, x: number, y: number, rotation: number): void {
    this.layerDoors = new Konva.Layer();
    this.stage.add(this.layerDoors);
    let door1 = new Konva.Rect({
      x: 0,
      y: 0,
      width:this.meterInPixel * .1,
      height: this.meterInPixel * 1.2,
      fill: '#777',
    });
    let door2 = new Konva.Rect({
      x: this.meterInPixel * .05,
      y: this.meterInPixel * .05,
      width:this.meterInPixel * .05,
      height: this.meterInPixel * 1.1,
      rotation:350,
      fill: '#777',
    });
    let doorGroup = new Konva.Group({
      x: 0,
      y: this.meterInPixel * .5,
      draggable: true,
    })
    doorGroup.add(door1);
    doorGroup.add(door2);
    this.layerDoors.add(doorGroup)
    this.stage.add(this.layerDoors);
    var tr2 = new Konva.Transformer({
      nodes: [doorGroup],
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerDoors.add(tr2);
  }
  doorRight(id: number, x: number, y: number, rotation: number): void {

  }
  doorMiddle(id: number, x: number, y: number, rotation: number): void {

  }
  // Windows Factory
  windowLeft(id: number, x: number, y: number, rotation: number): void {

  }
  windowRight(id: number, x: number, y: number, rotation: number): void {

  }
  windowMiddle(id: number, x: number, y: number, rotation: number): void {
    this.layerWindows = new Konva.Layer();
    this.stage.add(this.layerWindows);
    let window1 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.meterInPixel * .1,
      height: this.meterInPixel * 2,
      fill: '#777',
    });
    let window2 = new Konva.Rect({
      x: 0,
      y: this.meterInPixel * .05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * .9,
      fill: '#777',
      rotation: 10
    });
    let window3 = new Konva.Rect({
      x: - this.meterInPixel * .15,
      y: this.meterInPixel * 1.05,
      width: this.meterInPixel * .05,
      height: this.meterInPixel * .9,
      fill: '#777',
      rotation: 350
    });
    let windowGroup = new Konva.Group({
      x: (this.meterInPixel * this.standardRooms[0].width) - (this.meterInPixel * 0.1),
      y: 150,
      draggable: true,
    })
    windowGroup.add(window1);
    windowGroup.add(window2);
    windowGroup.add(window3);
    this.layerWindows.add(windowGroup)
    this.stage.add(this.layerWindows);
    let tr3 = new Konva.Transformer({
      nodes: [windowGroup],
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerWindows.add(tr3);
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
