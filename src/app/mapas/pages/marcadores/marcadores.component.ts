import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


interface MarcadorColor {
  color: string,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
};

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      height: 100%;  
      width : 100%;
    }

    .list-group {
      position: fixed;
      top     : 20px;
      right   : 20px;
      z-index : 999;
    }
    
    li {
      cursor  : pointer;
    }
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('markermapa') divMapa!: ElementRef;
  zoomLevel: number = 15;
  mapa!: mapboxgl.Map;
  center: [number, number] = [-60.643429, -32.941836];

  // Arreglo marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage()
  }

  irMarcador(marcador: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marcador.getLngLat()
    });
  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage()

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach(m => {

      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr))

  }


  leerLocalStorage() {

    if (!localStorage.getItem('marcadores')) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
  
    lngLatArr.forEach(m => {

      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa)
      
      this.marcadores.push({
        marker: newMarker,
        color: m.color,
      });

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

    })
  }


  borrarMarcador(i: number) {

    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage()

  }
}
