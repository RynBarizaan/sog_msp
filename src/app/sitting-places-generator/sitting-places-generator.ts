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
  Türnähe: Array<any> = [];
  Fensternähe: Array<any> = [];
  Frontal: Array<any> = [];
  Tafelnähe: Array<any> = [];
  VorneImRaum: Array<any> = [];
  HintenImRaum: Array<any> = [];
  TürnäheUndHintenImRaum: Array<any> = [];
  TürnäheUndVorneImRaum: Array<any> = [];
  FensternäheUndHintenImRaum: Array<any> = [];
  FensternäheUndVorneImRaum: Array<any> = [];
  TafelnäheUndHintenImRaum: Array<any> = [];
  TafelnäheUndVorneImRaum: Array<any> = [];
  PepoelWithoutProperties: Array<any> = [];
  width?: number;
  height?: number;
  heightOFTable?: number;
  widthOFTable?: number;
  oneMeterInPX?: number;

  allElements?: any[];
  stage: any;
  roomName: string = 'Mein Raumname';

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
        let xChair1: any = this.radiusBigDesk - (this.widthChair / 2);
        // @ts-ignore
        let xChair2: any = this.radiusBigDesk - (this.widthChair / 2);
        let yChair1: any = 0;
        // @ts-ignore
        let yChair2: any = (this.radiusBigDesk * 2) + this.widthChair + (this.widthChair - this.heightChair);
        let xDesk: any = radiusBigDesk;
        // @ts-ignore
        let yDesk: any = this.radiusBigDesk + this.widthChair;

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
          allElements[i].x = allElements[i].x;
        }
        if(allElements[i].x > allElements[i].xNotBiggerZ){
          allElements[i].x = allElements[i].xNotBiggerZ;
          allElements[i].x = allElements[i].x;
        }
        if(allElements[i].y < allElements[i].yNotSmallerZ){
          allElements[i].y = allElements[i].yNotSmallerZ;
          allElements[i].y = allElements[i].y;
        }
        if(allElements[i].y > allElements[i].yNotBiggerZ){
          allElements[i].y = allElements[i].yNotBiggerZ;
          allElements[i].y = allElements[i].y;
        }
        groupElements.x(allElements[i].x);
        groupElements.y(allElements[i].y);
      }

      allElements[i].objectWidth = Math.floor(groupElements.getClientRect().width);
      allElements[i].objectHeight = Math.floor(groupElements.getClientRect().height);

      //Step 8
      let tooltip:any;

      if(allElements[i].firstname1 == 'Vorname') {
        tooltip = new Konva.Text({
          text: '',
        });
      } else {
        tooltip = new Konva.Text({
          text: allElements[i].id + '       ' + allElements[i].firstname1,
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
      let img = canvas.toDataURL("image/png");
      let pdf = new jsPDF();
      pdf.setFont('Arial');
      pdf.text(this.roomName,30,12);
      pdf.setFontSize(50);
      pdf.addImage(img, 'PNG',6,20,200,200);
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
      else if (this.listOfContacts[x]["Türnähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TürnäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Türnähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TürnäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.FensternäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.FensternäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"] && this.listOfContacts[x]["VorneImRaum"]){
        this.TafelnäheUndVorneImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"] && this.listOfContacts[x]["HintenImRaum"]){
        this.TafelnäheUndHintenImRaum.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Türnähe"]){
        this.Türnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Fensternähe"]){
        this.Fensternähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
      }
      else if (this.listOfContacts[x]["Tafelnähe"]){
        this.Tafelnähe.push(this.listOfContacts[x]["Vorname"]+" "+this.listOfContacts[x]["Nachname"]);
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
    this.shuffle(this.TürnäheUndVorneImRaum);
    this.shuffle(this.TürnäheUndHintenImRaum);
    this.shuffle(this.FensternäheUndVorneImRaum);
    this.shuffle(this.FensternäheUndHintenImRaum);
    this.shuffle(this.TafelnäheUndVorneImRaum);
    this.shuffle(this.TafelnäheUndHintenImRaum);
    this.shuffle(this.Türnähe);
    this.shuffle(this.Fensternähe);
    this.shuffle(this.VorneImRaum);
    this.shuffle(this.HintenImRaum);
    this.shuffle(this.Tafelnähe);
  }
//////// calculate the Area of Room from Meter to PX //////
  CalculateRoomArea(){
    // @ts-ignore
    let heightAndwidth: any = JSON.parse(sessionStorage.getItem("roomDimension"));
    let width = heightAndwidth.width;
    let height = heightAndwidth.height;
    this.heightOFTable = this.listOfTables[0].objectHeight;
    this.widthOFTable = this.listOfTables[0].objectWidth;
    console.log(this.heightOFTable+","+this.widthOFTable);
    try {
      if (width > height){
        this.width = 700;
        this.height = 700/(width/height);
        this.oneMeterInPX = this.width/width;
        console.log(this.height+","+this.width);
      }
      else if(width <height){
        this.height=700;
        this.width= 700/(height/width);
        this.oneMeterInPX = this.height/height;
        console.log(this.height+","+this.width);
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
      console.log(this.listOfTables);
    }
    catch (Exception){
      console.log(Exception);
    }


  }



  /////// Analyse location of Table with Algorithms condition ///////
  setTypesOfTables(){

    for (var x=0; x< this.listOfTables.length; x++) {
      if (this.listOfTables[x].element == "desk") {
        /////// check if the Table Frontal ///
        // @ts-ignore
        if ((this.listOfTables[x].y < this.height / 3 - this.heightOFTable) && (this.listOfTables[x].x > this.width / 3) && (this.listOfTables[x].x < 2 * (this.width / 3) - this.widthOFTable)) {
          this.statusOfTables[x].Frontal = true;
        }

          /////// check if the Table behind of Room ///
        // @ts-ignore
        else if (this.listOfTables[x].y > (this.height / 3) * 2) {
          this.statusOfTables[x].HintenImRaum = true;
        }
          /////// check if the Table in front of Room ///
        // @ts-ignore
        else if (this.listOfTables[x].y < (this.height / 3) - this.heightOFTable) {
          this.statusOfTables[x].VorneImRaum = true;

        }
      }
      /////// check if there are any Table beside the door ///
      else if (this.listOfTables[x].element == "door") {
        if (this.listOfTables[x].platzierung == "rechts") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Türnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "links") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Türnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;

              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "vorne") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;
              }

              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Türnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung == "hinten") {
          for (var y = 0; y < this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Türnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Türnähe= true;
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
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }

              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Fensternähe= true;
              }
            }
          }
        }

        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Fensternähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Fensternähe= true;
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
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && ((this.listOfTables[y].y < this.listOfTables[x].y + (3 * this.oneMeterInPX)) && ((this.listOfTables[y].x) + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && ((this.listOfTables[y].x + this.widthOFTable) > (this.width - this.oneMeterInPX))) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="links"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].y > this.listOfTables[x].y) && (this.listOfTables[y].y < this.listOfTables[x].y + 3 * this.oneMeterInPX) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y < this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX) && ((this.listOfTables[y].y + this.oneMeterInPX + this.heightOFTable) > this.listOfTables[x].y)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].y == this.listOfTables[x].y) && (this.listOfTables[y].x < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="vorne"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;

              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y < this.oneMeterInPX)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
        else if (this.listOfTables[x].platzierung =="hinten"){
          for (var y=0; y< this.listOfTables.length; y++) {
            if (this.listOfTables[y].element == "desk") {
              // @ts-ignore
              if ((this.listOfTables[y].x > this.listOfTables[x].x) && (this.listOfTables[y].x < this.listOfTables[x].x + 3 * this.oneMeterInPX) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x < this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable) && ((this.listOfTables[y].x + this.oneMeterInPX + this.widthOFTable) > this.listOfTables[x].x)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
              // @ts-ignore
              else if ((this.listOfTables[y].x == this.listOfTables[x].x) && (this.listOfTables[y].y > this.height - this.oneMeterInPX - this.heightOFTable)) {
                this.statusOfTables[y].Tafelnähe= true;
              }
            }
          }
        }
      }
    }
    this.setPesronToTable();
  }
///////// push the right Person(person with properties or not) in the right place(Table) ////////
  setPesronToTable(){
    for (var x=0; x<this.statusOfTables.length; x++){
      if ((this.statusOfTables[x].Frontal)&&(this.Frontal.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Frontal.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Türnähe)&&this.TürnäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname"){
          var theRemovedElement = this.TürnäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Türnähe)&&(this.TürnäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.TürnäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Tafelnähe)&&(this.TafelnäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.TafelnäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Tafelnähe)&&(this.TafelnäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") ){
          var theRemovedElement = this.TafelnäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum && this.statusOfTables[x].Fensternähe)&&(this.FensternäheUndVorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.FensternäheUndVorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum && this.statusOfTables[x].Fensternähe)&&(this.FensternäheUndHintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname") ){
          var theRemovedElement = this.FensternäheUndHintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Türnähe)&&(this.Türnähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Türnähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Tafelnähe)&&(this.Tafelnähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Tafelnähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].Fensternähe)&&(this.Fensternähe.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.Fensternähe.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].VorneImRaum)&&(this.VorneImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.VorneImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
      else if ((this.statusOfTables[x].HintenImRaum)&&(this.HintenImRaum.length != 0 && this.listOfTables[x].firstname1 == "Vorname")){
          var theRemovedElement = this.HintenImRaum.shift();
          this.listOfTables[x].firstname1 = theRemovedElement;
      }
    }

    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Türnähe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Fensternähe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Frontal);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.Tafelnähe);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.VorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.HintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TürnäheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TürnäheUndVorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.FensternäheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.FensternäheUndVorneImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TafelnäheUndHintenImRaum);
    Array.prototype.push.apply(this.PepoelWithoutProperties, this.TafelnäheUndVorneImRaum);
    console.log(this.PepoelWithoutProperties);
    this.shuffle(this.PepoelWithoutProperties);
    for (var x=0; x<this.statusOfTables.length; x++){
      if (this.PepoelWithoutProperties.length != 0 && this.listOfTables[x].firstname1 == "Vorname"){
        var theRemovedElement = this.PepoelWithoutProperties.shift();
        this.listOfTables[x].firstname1 = theRemovedElement;
      }
    }

  }



}
