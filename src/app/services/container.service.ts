import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor() {
    this.containerEl = document.querySelector('.container');
  }s

  private containerEl: Element;

  scrollToTop(): void {
    this.containerEl.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
