import { Injectable } from '@angular/core'; 
import {Storage} from '@ionic/storage';
@Injectable() 
export class DBProvider { 
    
    constructor(public storage:Storage) { storage.ready().then(() => {
});} 
    get(key: string) { 
        return this.storage.get(key)
    } 
    getJson(key: string) { 
        return new Promise((resolve, reject) => { 
            this.storage.get(key).then((success) => { 
                resolve(JSON.stringify(success)); }, (err) => { 
                    reject(err); }); }); 
    }

    set(key: string, value: any) { 
                        return this.storage.set(key, value); 
    } 

    setJson(key: string, value: any) { 
        return this.storage.set(key, JSON.stringify(value)); 
    } 

    remove(key: string) { 
        return this.storage.remove(key); 
    } 
}
