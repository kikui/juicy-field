import { Component, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {
  title = 'juicy-field';
  constructor(updates: SwUpdate) {
    updates.versionUpdates.subscribe(event => {
      if (event.type == "VERSION_DETECTED") {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
