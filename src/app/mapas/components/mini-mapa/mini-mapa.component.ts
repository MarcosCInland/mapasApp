import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [`
    div{
      width : 100%;
      height: 15rem;
      margin: 0;
    }
  `]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lng: number = 0;
  @Input() lat: number = 0;
  @ViewChild('mapa') divMapa!: ElementRef;
  constructor() { }

  ngAfterViewInit(): void {
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat], //longitud, latitud
      zoom: 10
    });

    new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat]!)
      .addTo(mapa)
    //  EL ORDEN IMPORTA. PRIMERO SETEAR LNG & LAT
      
  }

}
