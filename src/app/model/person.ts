export class Person{

  constructor(
    public Vorname: string,
    public Nachname: string,
    public Türnähe:boolean,
    public Fensternähe:boolean,
    public Frontal:boolean,
    public Tafelnähe:boolean,
    public VorneImRaum:boolean,
    public HintenImRaum:boolean,
    public AusnahmenVonNachbern:Array<any>,
    public AusnahmenVonNachbernAsBoolean:Array<any>,
  ){}
}
