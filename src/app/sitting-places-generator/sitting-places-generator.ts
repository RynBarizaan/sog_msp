import { Component, OnInit } from '@angular/core';
import {Person} from "../model/person";
import Konva from "konva";
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas";

@Component({
  selector: 'app-sitting-places-generator',
  templateUrl: './sitting-places-generator.html',
  styleUrls: ['./sitting-places-generator.css']
})
export class SittingPlacesGenerator implements OnInit {
  // @ts-ignore
  listOfContacts: Array<any> = JSON.parse(sessionStorage.getItem("person"));
  // @ts-ignore
  listOfTables: Array<any> = JSON.parse(sessionStorage.getItem("room"));
  statusOfTables: Array<any> = [];
  nighbore:Array<any>=[];
  Tuernaehe: Array<any> = [];
  Fensternaehe: Array<any> = [];
  Frontal: Array<any> = [];
  Tafelnaehe: Array<any> = [];
  VorneImRaum: Array<any> = [];
  HintenImRaum: Array<any> = [];
  TuernaeheUndHintenImRaum: Array<any> = [];
  TuernaeheUndVorneImRaum: Array<any> = [];
  FensternaeheUndHintenImRaum: Array<any> = [];
  FensternaeheUndVorneImRaum: Array<any> = [];
  TafelnaeheUndHintenImRaum: Array<any> = [];
  TafelnaeheUndVorneImRaum: Array<any> = [];
  PepoelWithoutProperties: Array<any> = [];
  listePersonen: Array<any> = [];
  edited : boolean = false;
  currentId?: number;
  width?: number;
  height?: number;
  heightOFTable?: number;
  widthOFTable?: number;
  oneMeterInPX?: number;
  rotation:number=0;
  oldx:number=0;
  oldy:number=0;
  newx:number=0;
  newy:number=0;
  showLoader: boolean = true;
  allElements?: any[];
  stage: any;
  roomName: string = 'Mein Raumname';
  groupToString: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.CalculateRoomArea();
    this.drawRoom();
  }

  drawRoom(): void {
    // Declaring and Initiate variable with local stored room and dimension of it
    let allElements = this.listOfTables;
    let roomDimension = JSON.parse(<string>sessionStorage.getItem("roomDimension"));
    let width: number = roomDimension.width;
    let height: number = roomDimension.height;
    let widthStage: number = 0;
    let heightStage: number = 0;
    let meterInPixel: number = 0;

    // Get dimension of html container and give it to the stage
    let stageContainer: any = document.getElementById('container-visualiser');

    if (width > height) {
      widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      heightStage = Math.ceil(height * (widthStage / width));
    } else if (height > width) {
      heightStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      widthStage = Math.ceil(width * (heightStage / height));
    } else if (width = height) {
      widthStage = Math.ceil(stageContainer.getBoundingClientRect().width * .8);
      heightStage = widthStage;
    }

    // Initiate stage with given dimension from html container

    this.stage = new Konva.Stage({
      container: 'roomvisualiser',
      width: widthStage,
      height: heightStage,
      draggable: false,
    });

    //
    if (width > height) {
      meterInPixel = widthStage / width;
    } else if (height > width) {
      meterInPixel = heightStage / height;
    } else if (width == height) {
      meterInPixel = widthStage / width;
    }

    let widthSmallDesk = meterInPixel * 1.2;
    let widthBigDesk = (meterInPixel * 1.2) * 2;
    let heightDesk = meterInPixel * .7;
    let widthChair = meterInPixel * .4;
    let heightChair = meterInPixel * .3;
    let radiusSmallDesk = Math.floor((meterInPixel * 1.2) / 2);
    let radiusBigDesk = Math.floor((meterInPixel * 1.2) / 1.5);

    let backgroundLayer = new Konva.Layer();
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let rect = new Konva.Rect({
          x: i * meterInPixel,
          y: j * meterInPixel,
          width: meterInPixel,
          height: meterInPixel,
          fill: '#e2e2e2',
          stroke: '#777',
          strokeWidth: 1
        });
        backgroundLayer.add(rect);
      }
    }
    this.stage.add(backgroundLayer);

    let layerElements = new Konva.Layer();

    this.stage.add(layerElements);
    for (let i = 0; i < allElements.length; i++) {

      //Step 1
      let objWidth: any;
      let objHeight: any;

      //Step 2
      let elemente: any[] = [];

      // If the object is a small square desk
      if(allElements[i].element == 'desk' && allElements[i].elementtyp == 'eckig' && allElements[i].place == 1){
        let desktop = new Konva.Rect({
          width: widthSmallDesk,
          height: heightDesk,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
          cornerRadius: meterInPixel * .08,
        })
        let chair = new Konva.Rect({
          x: meterInPixel * 0.4,
          y: meterInPixel * 0.75,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
          cornerRadius: meterInPixel * .03,
        });
        elemente.push(desktop)
        elemente.push(chair)

        objWidth = widthSmallDesk;
        // @ts-ignore
        objHeight = heightDesk + ((meterInPixel * 0.75) - heightDesk) + heightChair;
      }

      // If the object is a big square desk
      else if(allElements[i].element == 'desk' && allElements[i].elementtyp == 'eckig' && allElements[i].place == 2) {
        let desk = new Konva.Rect({
          width: widthBigDesk,
          height: heightDesk,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
          cornerRadius: meterInPixel * .08,
        })
        let chair1 = new Konva.Rect({
          x: meterInPixel * .4,
          y: meterInPixel * 0.75,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
          cornerRadius: meterInPixel * .03,
        });
        let chair2 = new Konva.Rect({
          x: (meterInPixel * .4) + (meterInPixel * 1.2),
          y: meterInPixel * 0.75,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
          cornerRadius: meterInPixel * .03,
        });
        elemente.push(desk)
        elemente.push(chair1)
        elemente.push(chair2)


        objWidth = widthBigDesk;
        // @ts-ignore
        objHeight = heightDesk + ((meterInPixel * 0.75) - heightDesk) + heightChair;
      }
      // If the object is a small round desk
      else if(allElements[i].element == 'desk' && allElements[i].elementtyp == 'rund' && allElements[i].place == 1) {
        let desk = new Konva.Circle({
          x: radiusSmallDesk,
          y: radiusSmallDesk,
          radius: radiusSmallDesk,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        })
        let chair = new Konva.Rect({
          x: meterInPixel * 0.4,
          y: meterInPixel * 1.25,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        elemente.push(desk)
        elemente.push(chair)

        // @ts-ignore
        objWidth = radiusSmallDesk * 2;
        // @ts-ignore
        objHeight = meterInPixel * 1.25 + heightChair;
      }
      // If the object is a big round desk
      else if(allElements[i].element == 'desk' && allElements[i].elementtyp == 'rund' && allElements[i].place == 2) {
        // @ts-ignore
        let xChair1: any = radiusBigDesk - (widthChair / 2);
        // @ts-ignore
        let xChair2: any = radiusBigDesk - (widthChair / 2);
        let yChair1: any = 0;
        // @ts-ignore
        let yChair2: any = (radiusBigDesk * 2) + widthChair + (widthChair - heightChair);
        let xDesk: any = radiusBigDesk;
        // @ts-ignore
        let yDesk: any = radiusBigDesk + widthChair;

        let desk = new Konva.Circle({
          x: xDesk,
          y: yDesk,
          radius: radiusBigDesk,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        })
        let chair1 = new Konva.Rect({
          x: xChair1,
          y: yChair1,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        let chair2 = new Konva.Rect({
          x: xChair2,
          y: yChair2,
          width: widthChair,
          height: heightChair,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        elemente.push(desk)
        elemente.push(chair1)
        elemente.push(chair2)

        // @ts-ignore
        objWidth = radiusBigDesk * 2;
        // @ts-ignore
        objHeight = yChair2 + heightChair;
      }
      // If the object is a door
      else if(allElements[i].element == 'door') {
        let door1 = new Konva.Rect({
          width: meterInPixel * 0.08,
          height: meterInPixel * 2,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        })
        let door2 = new Konva.Rect({
          x: meterInPixel * 0.08,
          y: meterInPixel * 0.1,
          width: meterInPixel * 0.04,
          height: meterInPixel * 1.8,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        })
        elemente.push(door1)
        elemente.push(door2)

        objWidth = (meterInPixel * 0.08) + (meterInPixel * 0.04);
        objHeight = meterInPixel * 2;
      }
      // If the object is a window
      else if(allElements[i].element == 'window') {
        let window1 = new Konva.Rect({
          x: 0,
          y: 0,
          width: meterInPixel * 0.08,
          height: meterInPixel * 2,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        let window2 = new Konva.Rect({
          x: meterInPixel * .08,
          y: meterInPixel * .05,
          width: meterInPixel * 0.04,
          height: meterInPixel * .9,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        let window3 = new Konva.Rect({
          x: meterInPixel * .08,
          y: meterInPixel * 1.05,
          width: meterInPixel * 0.04,
          height: meterInPixel * .9,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        });
        elemente.push(window1)
        elemente.push(window2)
        elemente.push(window3)

        objWidth = (meterInPixel * 0.08) + (meterInPixel * 0.04);
        objHeight = meterInPixel * 2;
      }

      // If the object is a board
      else if(allElements[i].element == 'board') {
        let board = new Konva.Rect({
          x: 0,
          y: 0,
          width: meterInPixel * 0.12,
          height: meterInPixel * 2,
          fill: allElements[i].bgClr,
          stroke: 'black',
          strokeWidth: 1,
        })
        elemente.push(board)

        objWidth = (meterInPixel * 0.08) + (meterInPixel * 0.04);
        objHeight = meterInPixel * 2;
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
      let groupElements = new Konva.Group();

      for(let e of elemente) {
        groupElements.add(e)
      }

      groupElements.draggable(false);

      //Step 5
      layerElements.add(groupElements);

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
      layerElements.add(tr);

      if(allElements[i].element == 'door' || allElements[i].element == 'window' || allElements[i].element == 'board') {

          allElements[i].xNotSmallerZ = 0;
          allElements[i].xNotBiggerZ = widthStage - objWidth;
          allElements[i].yNotSmallerZ = 0;
          allElements[i].yNotBiggerZ = heightStage - objHeight;

        if((allElements[i].platzierung == 'hinten') || (allElements[i].platzierung == 'vorne')) {
          allElements[i].xNotBiggerZ = widthStage - objHeight;
        }


        if(allElements[i].x < allElements[i].xNotSmallerZ){
          if(allElements[i].platzierung == 'vorne') {
            allElements[i].x = allElements[i].xNotSmallerZ;
            allElements[i].x = allElements[i].x;
          }
          if(allElements[i].platzierung == 'hinten') {
            allElements[i].x = allElements[i].xNotSmallerZ;
            allElements[i].x = allElements[i].x;
          }
        }

        if(allElements[i].x > allElements[i].xNotBiggerZ){
          if(allElements[i].platzierung == 'vorne') {
            allElements[i].x = allElements[i].xNotBiggerZ;
            allElements[i].x = allElements[i].x;
          }
          if(allElements[i].platzierung == 'hinten') {
            allElements[i].x = allElements[i].xNotBiggerZ;
            allElements[i].x = allElements[i].x;
          }
        }

        if(allElements[i].y < allElements[i].yNotSmallerZ){
          if(allElements[i].platzierung == 'links') {
            allElements[i].y = allElements[i].yNotSmallerZ;
            allElements[i].y = allElements[i].y;
          }
          if(allElements[i].platzierung == 'rechts') {
            allElements[i].y = allElements[i].yNotSmallerZ;
            allElements[i].y = allElements[i].y;
          }
        }
        if(allElements[i].y > allElements[i].yNotBiggerZ){
          if(allElements[i].platzierung == 'links') {
            allElements[i].y = allElements[i].yNotBiggerZ;
            allElements[i].y = allElements[i].y;
          }
          if(allElements[i].platzierung == 'rechts') {
            allElements[i].y = allElements[i].yNotBiggerZ;
            allElements[i].y = allElements[i].y;
          }
        }

        switch (allElements[i].platzierung) {
          case "links" :
            groupElements.x(0);
            groupElements.y(allElements[i].y);
            groupElements.rotation(0);
            break;
          case "hinten" :
            groupElements.x(allElements[i].x);
            groupElements.y(heightStage);
            groupElements.rotation(-90);
            break;
          case "rechts" :
            groupElements.x(widthStage);
            groupElements.y((allElements[i].y + (meterInPixel * 2)));
            groupElements.rotation(180);
            break;
          case "vorne" :
            groupElements.x(( allElements[i].x + objHeight));
            groupElements.y(0);
            groupElements.rotation(90);
            break;
        }
      } else {

        groupElements.rotation(allElements[i].degRotation);

        let xOver: number;
        let yOver: number;
        let rot: number = Math.floor(groupElements.getAbsoluteRotation());
        let deg: number;
        let xNotSmaller: number;
        let xNotBigger: number;
        let yNotSmaller: number;
        let yNotBigger: number;

        if (rot >= 0 && rot <= 90) {
          deg = rot;
          deg = (deg * Math.PI) / 180.0;
          yOver = 0;
          xOver = Math.ceil(objHeight * Math.sin(deg));
          xNotSmaller = xOver;
          xNotBigger = widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = heightStage - (groupElements.getClientRect().height - yOver);
          allElements[i].xNotSmallerZ = xNotSmaller;
          allElements[i].xNotBiggerZ = xNotBigger;
          allElements[i].yNotSmallerZ = yNotSmaller;
          allElements[i].yNotBiggerZ = yNotBigger;
        }else if (rot >= 90 && rot <= 180) {
          deg = rot - 90;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(objHeight * Math.sin(deg));
          xOver = Math.ceil(groupElements.getClientRect().width);
          xNotSmaller = xOver;
          xNotBigger = widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = heightStage - (groupElements.getClientRect().height - yOver);
          allElements[i].xNotSmallerZ = xNotSmaller;
          allElements[i].xNotBiggerZ = xNotBigger;
          allElements[i].yNotSmallerZ = yNotSmaller;
          allElements[i].yNotBiggerZ = yNotBigger;
        } else if (rot >= -180 && rot <= -90) {
          deg = (rot * -1) - 90;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(groupElements.getClientRect().height);
          xOver = Math.ceil(objWidth * Math.sin(deg));
          xNotSmaller = xOver;
          xNotBigger = widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = heightStage - (groupElements.getClientRect().height - yOver);
          allElements[i].xNotSmallerZ = xNotSmaller;
          allElements[i].xNotBiggerZ = xNotBigger;
          allElements[i].yNotSmallerZ = yNotSmaller;
          allElements[i].yNotBiggerZ = yNotBigger;
        } else if (rot >= -90 && rot < 0) {
          deg = rot * -1;
          deg = (deg * Math.PI) / 180.0;
          yOver = Math.ceil(objWidth * Math.sin(deg));
          xOver = 0;
          xNotSmaller = xOver;
          xNotBigger = widthStage - (groupElements.getClientRect().width - xOver);
          yNotSmaller = yOver;
          yNotBigger = heightStage - (groupElements.getClientRect().height - yOver);
          allElements[i].xNotSmallerZ = xNotSmaller;
          allElements[i].xNotBiggerZ = xNotBigger;
          allElements[i].yNotSmallerZ = yNotSmaller;
          allElements[i].yNotBiggerZ = yNotBigger;
        }

        if(allElements[i].x < allElements[i].xNotSmallerZ){
          allElements[i].x = allElements[i].xNotSmallerZ;
          //allElements[i].x = allElements[i].x;
        }
        if(allElements[i].x > allElements[i].xNotBiggerZ){
          allElements[i].x = allElements[i].xNotBiggerZ;
          //allElements[i].x = allElements[i].x;
        }
        if(allElements[i].y < allElements[i].yNotSmallerZ){
          allElements[i].y = allElements[i].yNotSmallerZ;
          //allElements[i].y = allElements[i].y;
        }
        if(allElements[i].y > allElements[i].yNotBiggerZ){
          allElements[i].y = allElements[i].yNotBiggerZ;
          //allElements[i].y = allElements[i].y;
        }
        groupElements.x(allElements[i].x);
        groupElements.y(allElements[i].y);
      }

      allElements[i].objectWidth = Math.floor(groupElements.getClientRect().width);
      allElements[i].objectHeight = Math.floor(groupElements.getClientRect().height);

      //Step 8
      let tooltip:any;

      if(allElements[i].firstname1 == 'Vorname' || allElements[i].firstname1 == undefined) {
        tooltip = new Konva.Text({
          text: allElements[i].id,
          fontFamily: 'Segoe UI',
          fontSize: objWidth*.15,
          y:objHeight*.03,
          x:objWidth*.1,
          padding: 5,
          letterSpacing:1,
          textFill: 'white',
          width: objWidth*.9,
          fill: '#777',
          alpha: 0.75,
          visible: true,
        });
      } else if (allElements[i].firstname1 != 'Vorname' && allElements[i].lastname1 != 'Nachname' && allElements[i].firstname1 != undefined && allElements[i].lastname1 != undefined){
        tooltip = new Konva.Text({
          text: 'Nummer ' + (allElements[i].id+1) + '\n' + allElements[i].firstname1 + '\n' + allElements[i].lastname1,
          fontFamily: 'Segoe UI',
          fontStyle: 'Bold',
          fontSize: objWidth*.15,
          y:0,
          x:objWidth*.1,
          padding: 5,
          letterSpacing:1,
          fill: '#fff',
          width: objWidth*.9,
          alpha: 0.75,
          visible: true,
          shadowBlur: 3,
          shadowColor: '#000',
          shadowOffset: {x: 1, y: 1},
        });
      } else if (allElements[i].firstname1 != 'Vorname' && allElements[i].firstname1 != undefined && (allElements[i].lastname1 == 'Nachname' || allElements[i].lastname1 == undefined)){
        tooltip = new Konva.Text({
          text: 'Nummer ' + (allElements[i].id+1) + '\n' + allElements[i].firstname1,
          fontFamily: 'Segoe UI',
          fontStyle: 'Bold',
          fontSize: objWidth*.15,
          y:0,
          x:objWidth*.1,
          padding: 5,
          letterSpacing:1,
          fill: '#fff',
          width: objWidth*.9,
          alpha: 0.75,
          visible: true,
          shadowBlur: 3,
          shadowColor: '#000',
          shadowOffset: {x: 1, y: 1},
        });
      }
      groupElements.add(tooltip);
      }


    //sessionStorage.setItem("room", JSON.stringify(allElements));

  }

  // save pdf with room title and picture of stage
  savePdf() {
    let d: any = document.querySelector('#roomvisualiser');
    html2canvas(d, {
      allowTaint:true,
      useCORS: true,
      scale: 1
    }).then(canvas => {
      let img = this.stage.toDataURL({ pixelRatio: 3 });
      let pdf = new jsPDF();
      pdf.setFontSize(20);
      pdf.setTextColor('#494949');
      pdf.text(this.roomName,10,15);
      for(let p of this.listOfTables) {
        if(p.firstname1 != 'Vorname' && p.firstname1 != undefined) {
          let text: string = 'Name : ' + p.firstname1 + ', Tischnummer : ' + p.id.toString();
          pdf.setFontSize(12);
          pdf.setTextColor('#494949');
          pdf.text(text,8,(p.id+5) * 6);
        }
      }
      pdf.addImage(img, 'PNG',93,10,110,110);
      pdf.save(this.roomName+'.pdf');
    })
  }

  // save image of stage
  savePng() {
    let dataURL = this.stage.toDataURL({ pixelRatio: 3 });
    let link: any = document.createElement('a');
    link.download = this.roomName;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.download;
  }

  /////// the Method to mix the Values //////
   shuffle(a:any) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
/////// set the Person in Array variables with specific properties //////
  customizeTheGroupThroughProperties(){

    for(var x=0; x<this.listOfContacts.length; x++){
      if (this.listOfContacts[x]["Frontal"]){
        this.Frontal.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tuernaehe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TuernaeheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tuernaehe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TuernaeheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternaehe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.FensternaeheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternaehe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.FensternaeheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnaehe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TafelnaeheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnaehe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TafelnaeheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tuernaehe"]){
        this.Tuernaehe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternaehe"]){
        this.Fensternaehe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnaehe"]){
        this.Tafelnaehe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["VorneImRaum"]){
        this.VorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["HintenImRaum"]){
        this.HintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else {
    this.PepoelWithoutProperties.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
    }
    this.shuffle(this.Frontal);
    this.shuffle(this.TuernaeheUndVorneImRaum);
    this.shuffle(this.TuernaeheUndHintenImRaum);
    this.shuffle(this.FensternaeheUndVorneImRaum);
    this.shuffle(this.FensternaeheUndHintenImRaum);
    this.shuffle(this.TafelnaeheUndVorneImRaum);
    this.shuffle(this.TafelnaeheUndHintenImRaum);
    this.shuffle(this.Tuernaehe);
    this.shuffle(this.Fensternaehe);
    this.shuffle(this.VorneImRaum);
    this.shuffle(this.HintenImRaum);
    this.shuffle(this.Tafelnaehe);
  }
//////// calculate the Area of Room from Meter to PX //////
  CalculateRoomArea(){
    // @ts-ignore
    let heightAndwidth: any = JSON.parse(sessionStorage.getItem("roomDimension"));
    let width = heightAndwidth.width;
    let height = heightAndwidth.height;
    try {
      if (width > height){
        this.width = 700;
        this.height = 700/(width/height);
        this.oneMeterInPX = this.width/width;
      }
      else if(width <height){
        this.height=700;
        this.width= 700/(height/width);
        this.oneMeterInPX = this.height/height;
      }
      else if(width = height){
        this.height = 700;
        this.width = 700;
        this.oneMeterInPX = this.height/height;
      }
      if (this.listOfTables.length !=0){
        for (var x=0; x<this.listOfTables.length ; x++){
          this.statusOfTables.push(new Person("","",false,false,false,false,false,false,[],[]));
        }
      }
      this.customizeTheGroupThroughProperties();
      this.setTypesOfTables();
      this.listePerson();
    }
    catch (Exception){
      console.log(Exception);
    }


  }

  //////// set x and y after Rotation ////////
setXAndYAfterRotation(indexOfElement: number){
  this.rotation = this.listOfTables[indexOfElement].degRotation;
  this.oldx= this.listOfTables[indexOfElement].x;
  this.oldy=this.listOfTables[indexOfElement].y;
  this.heightOFTable = this.listOfTables[indexOfElement].objectHeight;
  this.widthOFTable = this.listOfTables[indexOfElement].objectWidth;
  if (this.rotation >=0 && this.rotation <= 45 ){
    this.newx = (this.oldx-this.rotation )-this.rotation /9;
    this.newy= (this.oldy+this.rotation )-(this.rotation /4.4);
  }
  else if (this.rotation >=46 && this.rotation <= 67 ){
    this.newx = (this.oldx-this.rotation )-this.rotation /9;
    this.newy= this.oldy+(this.rotation /2.24);
  }
  else if (this.rotation >=68 && this.rotation <= 90 ){
    this.newx = (this.oldx-this.rotation )-this.rotation /9;
    this.newy= this.oldy+(this.rotation /5.4);
  }
  else if (this.rotation>= 91 && this.rotation<=111){
    this.newx = (this.oldx-this.rotation)+this.rotation/16
    this.newy= this.oldy-(this.rotation/25.25);
  }
  else if (this.rotation>= 112 && this.rotation<=135){
    this.newx = (this.oldx-this.rotation)+this.rotation/16
    this.newy= this.oldy-(this.rotation/4.24);
  }
  else if(this.rotation>= 136 && this.rotation<=157){
    // @ts-ignore
    this.newx= (this.oldx-this.widthOFTable)-17
    this.newy= this.oldy-(this.rotation/2.56);
  }
  else if (this.rotation>= 158 && this.rotation<=180){
    // @ts-ignore
    this.newx = (this.oldx-this.widthOFTable)-8;
    this.newy= this.oldy-(this.rotation/2);
  }

  else if(this.rotation <= 0 && this.rotation>=-45) {
    this.newx = this.oldx-(this.rotation/1.46);
    this.newy= this.oldy+this.rotation
  }
  else if(this.rotation <= -46 && this.rotation>=-67) {
    this.newx = this.oldx-(this.rotation/3.5);
    this.newy= (this.oldy+this.rotation)+(this.rotation/6.09);
  }
  else if(this.rotation <= -68 && this.rotation>=-90) {
    this.newx = this.oldx-(this.rotation/40.2);
    this.newy= (this.oldy+this.rotation)+(this.rotation/6.09);
  }
  else if(this.rotation <= -91 && this.rotation>=-135) {
    this.newx = this.oldx+(this.rotation/2.860);
    this.newy= (this.oldy+this.rotation)-(this.rotation/56);
  }
  else if(this.rotation <= -136 && this.rotation>=-157) {
    this.newx = this.oldx+(this.rotation/1.91);
    this.newy= (this.oldy+this.rotation)-(this.rotation/4.9);
  }
  else if(this.rotation <= -158 && this.rotation>=-180) {
    this.newx = this.oldx+(this.rotation/1.91);
    this.newy= (this.oldy+this.rotation)-(this.rotation/2.640);
  }


}


  /////// Analyse location of Table with Algorithms condition ///////
  setTypesOfTables(){

    for (var x=0; x< this.listOfTables.length; x++) {
      if (this.listOfTables[x].element == "desk") {
        this.setXAndYAfterRotation(x);
        this.heightOFTable = this.listOfTables[x].objectHeight;
        this.widthOFTable = this.listOfTables[x].objectWidth;
        /////// check if the Table Frontal ///
        // @ts-ignore
        if ((this.newy < (this.height) / 2.8 - this.heightOFTable) && (this.newx > this.width / 3) && (this.newx < 2 * (this.width / 3) - this.widthOFTable)) {
          this.statusOfTables[x].Frontal = true;

        }
          /////// check if the Table behind of Room ///
        // @ts-ignore
        else if (this.newy > (this.height / 3) * 2) {
          this.statusOfTables[x].HintenImRaum = true;
        }
          /////// check if the Table in front of Room ///
        // @ts-ignore
        else if (this.newy < (this.height / 2.8) - this.heightOFTable) {
          this.statusOfTables[x].VorneImRaum = true;

        }
      }
      /////// check if there are any Table beside the door ///
      else if (this.listOfTables[x].element == "door") {
        if (this.listOfTables[x].platzierung == "rechts") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && ((this.newy < this.listOfTables[x].y + (3 * this.oneMeterInPX)) &&(this.newx + (this.widthOFTable)) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tuernaehe= true;
              }

              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tuernaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "links") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && (this.newy < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && (this.newx < this.oneMeterInPX) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Tuernaehe= true;

              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "vorne") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy < this.oneMeterInPX)) {
                this.statusOfTables[y].Tuernaehe= true;
              }

              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy < this.oneMeterInPX) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy < this.oneMeterInPX)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "hinten") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tuernaehe= true;
              }
            }
          }
        }
      }
      /////// check if there are any Table beside the window ///
      else if (this.listOfTables[x].element =="window"){
        if (this.listOfTables[x].platzierung =="rechts"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && ((this.newy < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.newx) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && (this.newy < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && (this.newx < this.oneMeterInPX) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternaehe= true;
              }

              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy < this.oneMeterInPX) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
            }
          }
        }

        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternaehe= true;
              }
            }
          }
        }
      }
      /////// check if there are any Table beside the board ///
      else if (this.listOfTables[x].element=="board"){
        if (this.listOfTables[x].platzierung =="rechts"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && ((this.newy < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.newx) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && ((this.newx + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newy > this.listOfTables[x].y) && (this.newy < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newy < this.listOfTables[x].y) && (this.newx < this.oneMeterInPX) && ((this.newy + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newy == this.listOfTables[x].y) && (this.newx < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy < this.oneMeterInPX*2)) {
                this.statusOfTables[y].Tafelnaehe= true;

              }
              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy < this.oneMeterInPX*2) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy < this.oneMeterInPX*2)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              this.setXAndYAfterRotation(y);
              // @ts-ignore
              if ((this.newx > this.listOfTables[x].x) && (this.newx < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newx < this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.newx + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
              // @ts-ignore
              else if ((this.newx == this.listOfTables[x].x) && (this.newy > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnaehe= true;
              }
            }
          }
        }
      }
    }
    this.setPesronToTable();
  }


  //////////// set the Person to all beside Table to check it letter if he/she is a Neighbor band  ///////
  setPersonNameToNighbore(myTableIndex: number,myName:string){
    for (var x=0; x< this.listOfTables.length; x++) {

      //////1
      if ((this.listOfTables[myTableIndex].x > this.listOfTables[x].x || this.listOfTables[myTableIndex].x == this.listOfTables[x].x) && this.listOfTables[myTableIndex].y > this.listOfTables[x].y) {
        if ((this.listOfTables[myTableIndex].x < this.listOfTables[x].x + this.oneMeterInPX + this.listOfTables[x].objectWidth) && (this.listOfTables[myTableIndex].y < this.listOfTables[x].y + this.oneMeterInPX + this.listOfTables[x].objectHeight)) {
          this.nighbore = this.listOfContacts.filter(p => p.Vorname + " " + p.Nachname == myName);
          if (this.nighbore[0]["AusnahmenVonNachbern"][0] != null){
            this.statusOfTables[x].AusnahmenVonNachbern=this.nighbore[0]["AusnahmenVonNachbern"];
          }
        }

      }
      ///////2
      if ((this.listOfTables[myTableIndex].x > this.listOfTables[x].x ||this.listOfTables[myTableIndex].x == this.listOfTables[x].x) && this.listOfTables[myTableIndex].y < this.listOfTables[x].y){

        if ((this.listOfTables[myTableIndex].x<this.listOfTables[x].x+this.oneMeterInPX+this.listOfTables[x].objectWidth)&&(this.listOfTables[myTableIndex].y>this.listOfTables[x].y-(this.oneMeterInPX+this.listOfTables[x].objectHeight))){
          this.nighbore = this.listOfContacts.filter(p => p.Vorname + " " + p.Nachname == myName);
          if (this.nighbore[0]["AusnahmenVonNachbern"][0] != null){
            this.statusOfTables[x].AusnahmenVonNachbern=this.nighbore[0]["AusnahmenVonNachbern"]
          }
        }
      }
      if (this.listOfTables[myTableIndex].x < this.listOfTables[x].x && (this.listOfTables[myTableIndex].y > this.listOfTables[x].y || this.listOfTables[myTableIndex].y == this.listOfTables[x].y)){

        if ((this.listOfTables[myTableIndex].x>this.listOfTables[x].x-(this.oneMeterInPX+this.listOfTables[x].objectWidth))&&(this.listOfTables[myTableIndex].y<this.listOfTables[x].y+this.oneMeterInPX+this.listOfTables[x].objectHeight)){
          this.nighbore = this.listOfContacts.filter(p => p.Vorname + " " + p.Nachname == myName);
          if (this.nighbore[0]["AusnahmenVonNachbern"][0] != null){
            this.statusOfTables[x].AusnahmenVonNachbern=this.nighbore[0]["AusnahmenVonNachbern"]
          }
        }
      }
      ///////////4
      if (this.listOfTables[myTableIndex].x < this.listOfTables[x].x && (this.listOfTables[myTableIndex].y < this.listOfTables[x].y|| this.listOfTables[myTableIndex].y == this.listOfTables[x].y)){

        if ((this.listOfTables[myTableIndex].x>this.listOfTables[x].x-(this.oneMeterInPX+this.listOfTables[x].objectWidth))&&(this.listOfTables[myTableIndex].y>this.listOfTables[x].y-(this.oneMeterInPX+this.listOfTables[x].objectHeight))){
          this.nighbore = this.listOfContacts.filter(p => p.Vorname + " " + p.Nachname == myName);
          if (this.nighbore[0]["AusnahmenVonNachbern"][0] != null){
            this.statusOfTables[x].AusnahmenVonNachbern=this.nighbore[0]["AusnahmenVonNachbern"]
          }
        }
      }
    }
  }



///////// push the right Person(person with properties or not) in the right place(Table) ////////
  setPesronToTable(){
    for (var x=0; x<this.statusOfTables.length; x++){
      if ((this.statusOfTables[x].Frontal)&&(this.Frontal.length != 0 )){
        if ( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.Frontal.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
          else if (this.listOfTables[x].place == 2 ){
            if (this.listOfTables[x].firstname1 == "Vorname" && this.Frontal.length != 0 ){
              var theRemovedElement = this.Frontal.shift();
              this.listOfTables[x].firstname1 = theRemovedElement;
            }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.Frontal.length != 0 ){
            var theRemovedElement = this.Frontal.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
          }
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Tuernaehe)&&this.TuernaeheUndVorneImRaum.length != 0){
        if ( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.TuernaeheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.TuernaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.TuernaeheUndVorneImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.TuernaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.TuernaeheUndVorneImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }

      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Tuernaehe)&&(this.TuernaeheUndHintenImRaum.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.TuernaeheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.TuernaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.TuernaeheUndHintenImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.TuernaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.TuernaeheUndHintenImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Tafelnaehe)&&(this.TafelnaeheUndVorneImRaum.length != 0)){
        if(this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.TafelnaeheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.TafelnaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.TafelnaeheUndVorneImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.TafelnaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.TafelnaeheUndVorneImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Tafelnaehe)&&(this.TafelnaeheUndHintenImRaum.length != 0)){
        if(this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.TafelnaeheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.TafelnaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.TafelnaeheUndHintenImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.TafelnaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.TafelnaeheUndHintenImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Fensternaehe)&&(this.FensternaeheUndVorneImRaum.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.FensternaeheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.FensternaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.FensternaeheUndVorneImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.FensternaeheUndVorneImRaum.length != 0 ){
            var theRemovedElement = this.FensternaeheUndVorneImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Fensternaehe)&&(this.FensternaeheUndHintenImRaum.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.FensternaeheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.FensternaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.FensternaeheUndHintenImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.FensternaeheUndHintenImRaum.length != 0 ){
            var theRemovedElement = this.FensternaeheUndHintenImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].Tuernaehe)&&(this.Tuernaehe.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.Tuernaehe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.Tuernaehe.length != 0 ){
            var theRemovedElement = this.Tuernaehe.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.Tuernaehe.length != 0 ){
            var theRemovedElement = this.Tuernaehe.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].Tafelnaehe)&&(this.Tafelnaehe.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.Tafelnaehe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.Tafelnaehe.length != 0 ){
            var theRemovedElement = this.Tafelnaehe.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.Tafelnaehe.length != 0 ){
            var theRemovedElement = this.Tafelnaehe.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].Fensternaehe)&&(this.Fensternaehe.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.Fensternaehe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.Fensternaehe.length != 0 ){
            var theRemovedElement = this.Fensternaehe.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.Fensternaehe.length != 0 ){
            var theRemovedElement = this.Fensternaehe.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].VorneImRaum)&&(this.VorneImRaum.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.VorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.VorneImRaum.length != 0 ){
            var theRemovedElement = this.VorneImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.VorneImRaum.length != 0 ){
            var theRemovedElement = this.VorneImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
      else if ((this.statusOfTables[x].HintenImRaum)&&(this.HintenImRaum.length != 0)){
        if( this.listOfTables[x].firstname1 == "Vorname" && this.listOfTables[x].place == 1){
          var theRemovedElement = this.HintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
        }
        else if (this.listOfTables[x].place == 2 ){
          if (this.listOfTables[x].firstname1 == "Vorname" && this.HintenImRaum.length != 0 ){
            var theRemovedElement = this.HintenImRaum.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.listOfTables[x].lastname1 == "Nachname" && this.HintenImRaum.length != 0 ){
            var theRemovedElement = this.HintenImRaum.shift();
            this.listOfTables[x].lastname1 = theRemovedElement;
          }
        }
      }
    }

    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Tuernaehe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Fensternaehe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Frontal);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Tafelnaehe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.VorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.HintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TuernaeheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TuernaeheUndVorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.FensternaeheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.FensternaeheUndVorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TafelnaeheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TafelnaeheUndVorneImRaum);
    this.shuffle(this.PepoelWithoutProperties);
    for (var x=0; x<this.statusOfTables.length; x++){
        if (this.listOfTables[x].place == 1) {
          if (this.listOfTables[x].firstname1 == "Vorname" && this.PepoelWithoutProperties.length != 0) {
              var theRemovedElement = this.PepoelWithoutProperties.shift();
            this.setPersonNameToNighbore(x,theRemovedElement);
            if (this.statusOfTables[x].AusnahmenVonNachbern.length != 0 ){
              for (var k=0; k<this.statusOfTables[x].AusnahmenVonNachbern.length; k++){
                if (this.statusOfTables[x].AusnahmenVonNachbern[k] == theRemovedElement){
                for(var d=this.statusOfTables.length-1; d>=0; d--){
                  if (this.listOfTables[d].firstname1 == "Vorname" && theRemovedElement != null ) {
                    this.listOfTables[d].firstname1 = theRemovedElement;
                    theRemovedElement=null;
                  }

                }
                }
                else {
                  this.PepoelWithoutProperties.push(theRemovedElement);
                }
              }
            }
            else {
              this.listOfTables[x].firstname1 = theRemovedElement;
            }
          }
          if (x == this.statusOfTables.length-1){
            for(var x1=0; x1<this.statusOfTables.length; x1++){
              if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x1].firstname1 == "Vorname") {
                var theRemovedElement = this.PepoelWithoutProperties.shift();
                this.listOfTables[x1].firstname1 = theRemovedElement;
              }
            }
          }

        }


        else if (this.listOfTables[x].place == 2){
          if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x].firstname1 == "Vorname") {
            var theRemovedElement = this.PepoelWithoutProperties.shift();
            this.listOfTables[x].firstname1 = theRemovedElement;
          }
          if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x].lastname1 == "Nachname") {
            var theRemovedElement = this.PepoelWithoutProperties.shift();
            this.nighbore = this.listOfContacts.filter(p => p.Vorname + " " + p.Nachname == theRemovedElement);
            for (var l = 0; l < this.nighbore[0]["AusnahmenVonNachbern"].length; l++) {
              var theFirstNameOfTable = this.listOfTables[x].firstname1
              if (this.nighbore[0]["AusnahmenVonNachbern"][l] != theFirstNameOfTable) {
                this.listOfTables[x].lastname1 = theRemovedElement;
              }
              else if (this.nighbore[0]["AusnahmenVonNachbern"][l] == theFirstNameOfTable) {
                for (var d = this.statusOfTables.length - 1; d >= 0; d--) {
                  if (this.listOfTables[d].firstname1 == "Vorname" && theRemovedElement != null) {
                    this.listOfTables[d].firstname1 = theRemovedElement;
                  }
                  else {
                    this.PepoelWithoutProperties.push(theRemovedElement);
                  }


                }
              }
              else {
                this.PepoelWithoutProperties.push(theRemovedElement);
              }

            }
            if (x == this.statusOfTables.length - 1) {
            for (var x2 = 0; x2 < this.statusOfTables.length*2; x2++) {
              if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x2].lastname1 == "Nachname") {
                var theRemovedElement = this.PepoelWithoutProperties.shift();
                this.listOfTables[x2].lastname1 = theRemovedElement;
                if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x2].firstname1 == "Vorname") {
                  var theRemovedElement = this.PepoelWithoutProperties.shift();
                  this.listOfTables[x2].firstname1 = theRemovedElement;
                }
              }
            }
          }
          }
        }
      }
     }


  newGenerator(){
    // @ts-ignore
    this.listOfContacts= JSON.parse(sessionStorage.getItem("person"));
    // @ts-ignore
    this.listOfTables= JSON.parse(sessionStorage.getItem("room"));
    this.statusOfTables= [];
    this.Tuernaehe = [];
    this.Fensternaehe = [];
    this.Frontal = [];
    this.Tafelnaehe= [];
    this.VorneImRaum= [];
    this.HintenImRaum= [];
    this.TuernaeheUndHintenImRaum= [];
    this.TuernaeheUndVorneImRaum = [];
    this.FensternaeheUndHintenImRaum= [];
    this.FensternaeheUndVorneImRaum= [];
    this.TafelnaeheUndHintenImRaum = [];
    this.TafelnaeheUndVorneImRaum = [];
    this.PepoelWithoutProperties = [];
    this.CalculateRoomArea();
    this.drawRoom();
    let loader: any = document.getElementById('loader');
    loader.style.visibility = 'visible';
    setTimeout((): any =>{
      let loader: any = document.getElementById('loader');
      loader.style.visibility = 'hidden';
      this.showLoader = false;},400);
  }

  listePerson () {
    let contacts = this.listOfContacts.map(subject => {
      let tables = this.listOfTables.find(element => element.firstname1 === subject.Vorname + " "+ subject.Nachname)
      return { ...subject, ...tables }
    });
    this.listePersonen = contacts;
  }
  show = new Array(this.listePersonen.length).fill(false);
  toggleDisplay(index: string | number) {
    // @ts-ignore
    this.show[index] = !this.show[index];
  }
}
