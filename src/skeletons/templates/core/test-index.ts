import { it } from "@angular/core/testing";
import { provide, Injector, ReflectiveInjector } from "@angular/core";
import { ResponseOptions, Response, HTTP_PROVIDERS, XHRBackend } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { __PROJECT_NAME_CLASSIFY__Component } from '../src/__PROJECT_NAME__.component';
import { Observable } from "rxjs/Observable";

export function main () {
  const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({ body: response })));
  };

  describe('component name', () => {
    let injector: Injector;
    let backend: MockBackend;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.

    beforeEach(() => {
      injector = ReflectiveInjector.resolveAndCreate([
        HTTP_PROVIDERS,
        // Provide a mocked (fake) backend for Http
        { provide: XHRBackend, useClass: MockBackend }
      ]);
      backend = injector.get(XHRBackend);
      // sets the connection when someone tries to access the backend with an xhr request
      backend.connections.subscribe((c: MockConnection) => connection = c);
    });

    afterEach(() => {
      injector = undefined;
      backend = undefined;
      connection = undefined;
    });

    it('is defined', () => {
      expect(__PROJECT_NAME_CLASSIFY__Component).toBeDefined();
    });
  });
}
