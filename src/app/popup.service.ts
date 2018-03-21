import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {NgElement} from '@angular/elements';

import {PopupComponent} from './popup.component';

@Injectable()
export class PopupService {
  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  /**
   * Instructions to dynamically create a component as per the instructions in
   * https://angular.io/guide/dynamic-component-loader
   */
  showAsComponent(message: string) {
    // Create element
    const popup = document.createElement('popup-component');

    // Create the component and wire it up with the element
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
    const popupComponentRef = factory.create(this.injector, [], popup);

    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(popupComponentRef.hostView);

    // Listen to the close event
    popupComponentRef.instance.closed.subscribe(() => {
      document.body.removeChild(popup);
      this.applicationRef.detachView(popupComponentRef.hostView);
    });

    // Set the message
    popupComponentRef.instance.message = message;

    // Add to the DOM
    document.body.appendChild(popup);
  }

  /** New way to create components using web components. */
  showAsElement(message: string) {
    // Create element
    const popupEl = document.createElement('popup-element') as (NgElement & {message: string});

    // Listen to the close event
    popupEl.addEventListener('closed', () => document.body.removeChild(popupEl));

    // Set the message
    popupEl.message = message;

    // Add to the DOM
    document.body.appendChild(popupEl);
  }
}
