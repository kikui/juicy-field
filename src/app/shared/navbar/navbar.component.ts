import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navbarRef') private navbarRef?: ElementRef<HTMLElement>;
  @Output() ref = new EventEmitter();

  constructor() {}

  ngAfterViewInit() {
    this.ref.emit(this.navbarRef);
  }

}