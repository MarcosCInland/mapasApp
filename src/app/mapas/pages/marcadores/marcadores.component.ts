import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado {
  color   : string,
  marker  ?: mapboxgl.Marker;
  center  ?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .mapa-container {
    height: 100%;
    width: 100%;
    }
    .list-group{
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 99;

    }
    li{
      cursor: pointer;
    }
  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map; //!: => siempre habra algo
  zoomLevel: number = 12;
  center: [number, number] = [-90.51781935984253, 14.62318186534125];
  marcadores: MarcadorPersonalizado[] = [];


  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center, //longitud, latitud
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

    /* Marcador quemado
      const marker = new mapboxgl.Marker()
      .setLngLat(this.center)
      .addTo(this.mapa);*/
  }

  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo(
      {
        center: [marker.getLngLat().lng, marker.getLngLat().lat]
      }
    )
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));  //Funcion para generar color en hexa aleatorio
    const newMarker = new mapboxgl.Marker(
      {
        draggable: true,  //Para moverlo
        color
      }
    )
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.marcadores.push(
      {
        color,
        marker: newMarker
      }
    );
    this.guardarMarcadoresLocalStorage();

    newMarker.on('dragend', ()=>{
      this.guardarMarcadoresLocalStorage();
    })
  }

  borrarMarcador(index: number){
    //  1. Borrar mapa
    this.marcadores[index].marker?.remove();

    //  2. Eliminar del arreglo
    this.marcadores.splice(index, 1);

    //  3. Actualizar local storage
    this.guardarMarcadoresLocalStorage();
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr: MarcadorPersonalizado[] = [];

    this.marcadores.forEach((m: MarcadorPersonalizado) => {
      const lng = m.marker!.getLngLat().lng;
      const lat = m.marker!.getLngLat().lat;
      lngLatArr.push({
        color: m.color,
        center: [lng, lat]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(){
    if ( !localStorage.getItem('marcadores') ) {
      return;
    }
    const lngLatArr: MarcadorPersonalizado[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach((m: MarcadorPersonalizado) => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
        .setLngLat(m.center!)
        .addTo(this.mapa);
      
      this.marcadores.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', ()=>{
        this.guardarMarcadoresLocalStorage();
      });
    })
  }

}
