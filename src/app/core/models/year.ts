export interface Mounth {
  name: string;
  nbDay: number;
  position: number;
}

export var oneYear: Array<Mounth> = [
  { name: "Janvier", nbDay: 31, position: 1 },
  { name: "Février", nbDay: 28, position: 2 },
  { name: "Mars", nbDay: 31, position: 3 },
  { name: "Avril", nbDay: 30, position: 4 },
  { name: "Mai", nbDay: 31, position: 5 },
  { name: "Juin", nbDay: 30, position: 6 },
  { name: "Juillet", nbDay: 31, position: 7 },
  { name: "Aout", nbDay: 31, position: 8 },
  { name: "Septembre", nbDay: 30, position: 9 },
  { name: "Octobre", nbDay: 31, position: 10 },
  { name: "Novembre", nbDay: 30, position: 11 },
  { name: "Decembre", nbDay: 31, position: 12 },
]