import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    `
      div {
        height: 150px;
        margin: 0;
        width : 100%;
      }
    `
  ]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input('lngLat') lngLat    : [number, number] = [0, 0]
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    
    const map = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: 15,
      interactive: false
    });
    
    const marker = new mapboxgl.Marker({
      
    })
      .setLngLat(this.lngLat)
      .addTo(map)
      
  }

}
