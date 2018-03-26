import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  public storeData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getData(key: string) {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) == key) {
        return JSON.parse(localStorage.getItem(localStorage.key(i)));
      }
    };
  }

}
