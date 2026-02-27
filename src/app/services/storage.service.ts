import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async set(namespace: string, key: string, value: any) {
    return this.storage.set(`${namespace}:${key}`, value);
  }

  async get(namespace: string, key: string) {
    return this.storage.get(`${namespace}:${key}`);
  }

  async remove(namespace: string, key: string) {
    return this.storage.remove(`${namespace}:${key}`);
  }
}
