export class Person{

  constructor(
    public Vorname: string,
    public Nachname: string,
    public Tuernaehe:boolean,
    public Fensternaehe:boolean,
    public Frontal:boolean,
    public Tafelnaehe:boolean,
    public VorneImRaum:boolean,
    public HintenImRaum:boolean,
    public AusnahmenVonNachbern:Array<any>,
    public AusnahmenVonNachbernAsBoolean:Array<any>,
  ){}
}
