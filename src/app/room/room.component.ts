import {Component, OnInit, SimpleChanges} from '@angular/core';
import Konva from "konva";

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
      "width": 8,
      "height": 8
    }
  ]

  roomDesks: {id: number, desktyp: string, place: number, factory: string, x: number, y: number, degRotation: number, firstname1: string, lastname1: string, firstname2?: string, lastname2?: string}[] = [
    {"id": 0, "desktyp": "eckig", "place": 1, "factory": "s-s-1", "x": 150, "y": 200, "degRotation": 0, "firstname1": "Salim", "lastname1": "Laghrari"},
    {"id": 1, "desktyp": "eckig", "place": 1, "factory": "s-s-2", "x": 450, "y": 200, "degRotation": 0, "firstname1": "Lucas", "lastname1": "Kleppek"},
    {"id": 2, "desktyp": "eckig", "place": 1, "factory": "s-s-3", "x": 150, "y": 350, "degRotation": 0, "firstname1": "Zakaria", "lastname1": "Sahibi"},
    {"id": 3, "desktyp": "eckig", "place": 1, "factory": "s-s-4", "x": 450, "y": 350, "degRotation": 0, "firstname1": "Haneef", "lastname1": "Aboush"},
    {"id": 4, "desktyp": "eckig", "place": 1, "factory": "s-s-5", "x": 150, "y": 500, "degRotation": 0, "firstname1": "Niklas", "lastname1": "Jochimiak"},
    {"id": 5, "desktyp": "eckig", "place": 1, "factory": "s-s-6", "x": 450, "y": 500, "degRotation": 0, "firstname1": "Sherzod", "lastname1": "Khakimov"},
    {"id": 6, "desktyp": "eckig", "place": 2, "factory": "s-b-7", "x": 245, "y": 60, "degRotation": 0, "firstname1": "Sören", "lastname1": "Schwerk", "firstname2": "Andre", "lastname2": "Quaß"},
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


  maximumWidth: number = 30;
  minimumWidth: number = 5;
  maximumHeight: number = 30;
  minimumHeight: number = 5;
  visualisedRoom: number = 0;
  widthStage: number = 700;
  heightStage: number = 700;
  meterInPixel: number = Math.floor(this.widthStage / this.standardRooms[this.visualisedRoom].width);
  widthMeter: number = this.standardRooms[0].width;
  heightMeter: number = this.standardRooms[0].height;
  widthSmallDesk?: number;
  heightSmallDesk?: number;
  widthBigDesk?: number;
  heightBigDesk?: number;
  widthChair?: number;
  heightChair?: number;
  positionXDeleteIcon?: number;
  positionYDeleteIcon?: number;
  radiusDeleteIcon?: number;



  stage?: any;
  layerDesks?: any;
  layerDoors?: any;
  layerWindows?: any;

  isPopup: boolean = false;
  currentId?: any;

  constructor() {
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

    if (width >= this.minimumWidth && width <= this.maximumWidth && height >= this.minimumHeight && height <= this.maximumHeight) {
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
    this.positionYDeleteIcon = this.widthSmallDesk * .1;
    this.radiusDeleteIcon = this.widthSmallDesk * .06;

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
  deskRoundSmall(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    console.log('deskRoundSmall')
  }
  deskRoundBig(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    console.log('deskRoundBig')
  }
  deskSquareSmall(id: number, x: number, y: number, rotation: number, firstname: string, lastname: string): void {
    this.stage.add(this.layerDesks);
    let desktop = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.widthSmallDesk,
      height: this.heightSmallDesk,
      fill: 'white',
      cornerRadius: 4,
      stroke: '#777',
      strokeWidth: 1
    })
    let chair = new Konva.Rect({
      x: this.meterInPixel * 0.4,
      y: this.heightSmallDesk,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: 2,
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
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      text: `${firstname}\n${lastname}`,
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



  deskSquareBig(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {

    let desk = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.widthBigDesk,
      height: this.heightBigDesk,
      fill: 'white',
      cornerRadius: 4,
      stroke: '#777',
      strokeWidth: 1
    })
    let chair1 = new Konva.Rect({
      x: this.meterInPixel * .4,
      y: this.meterInPixel * 0.75,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: 2,
      stroke: '#777',
      strokeWidth: 1
    });
    let chair2 = new Konva.Rect({
      x: (this.meterInPixel * .4) + (this.meterInPixel * 1.2),
      y: this.meterInPixel * 0.75,
      width: this.widthChair,
      height: this.heightChair,
      fill: '#999',
      cornerRadius: 2,
      stroke: '#777',
      strokeWidth: 1
    });
    let text1 = new Konva.Text({
      x: this.meterInPixel * 0.05 + (this.meterInPixel * 1.2),
      y: this.meterInPixel * 0.05,
      text: `${firstname1}\n${lastname1}`,
      fill: '#999',
      fontSize: this.meterInPixel * 0.18,
      fontFamily: 'arial',
    });
    let text2 = new Konva.Text({
      x: this.meterInPixel * 0.05,
      y: this.meterInPixel * 0.05,
      text: `${this.roomDesks[id].firstname2}\n${this.roomDesks[id].lastname2}`,
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
    groupSmallDesk.add(desk);
    groupSmallDesk.add(chair1);
    groupSmallDesk.add(chair2);
    groupSmallDesk.add(text1);
    groupSmallDesk.add(text2);
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


  }
  deskTriangleSmall(id: number, x: number, y: number, rotation: number, firstname1: string, lastname1: string): void {
    console.log('deskTriangleSmall')
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
    var tr3 = new Konva.Transformer({
      nodes: [windowGroup],
      centeredScaling: true,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      resizeEnabled: false,
    })
    this.layerWindows.add(tr3);
  }



}
