import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .mapa-container {
    height: 100%;
    width: 100%;
  }

  .row{
    background-color: white;
    border-radius: 0.5rem;
    bottom: 5rem;
    left: 5rem;
    padding: 1rem;
    position: fixed;
    z-index: 999;
    width: 40rem;
  }
`]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map; //!: => siempre habra algo
  zoomLevel: number = 12;
  center: [number, number] = [-90.51781935984253, 14.62318186534125]

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=> { });
    this.mapa.off('zoomEnd', ()=> { });
    this.mapa.off('move', ()=> { });
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center, //longitud, latitud
      zoom: this.zoomLevel
    });

    //Zoom del mapa
    this.mapa.on('zoom', 
      (ev) => {
        this.zoomLevel = this.mapa.getZoom();
      }
    );

    //Limite maximo
    this.mapa.on('zoomEnd', 
      (ev) => {
        if (this.mapa.getZoom() > 18) {
          this.mapa.zoomTo(18);
        }
      }
    );

    //Movimiento del mapa
    this.mapa.on('move',
      (event) => {
        //const target = event.target;
        const { lng, lat} = event.target.getCenter();
        this.center[0] = lng;
        this.center[1] = lat;
      }
    )
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  zoomOut(){
      this.mapa.zoomOut();
  }

  zoomChange(value: string) {
    this.mapa.zoomTo( Number(value) );
  }

}
