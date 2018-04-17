import { Pipe, PipeTransform} from '@angular/core';
import { Item } from '../../model/item'


@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform{
    
   transform(arr:Array<Item>,sortOrder:string){
    if(arr === undefined || arr===null || arr.length===0){return null;}
    //arr[1].completed=true
    console.log ("sorted array but not changing display")
    
    if (sortOrder=='A') {
        sortOrder='D'
        console.log ("sorted arrayD")
      arr.sort(function (a, b) {
        const genreA = a.fl.toUpperCase();
        const genreB = b.fl.toUpperCase();
      
        let comparison = 0;
        if (genreA < genreB) {
          comparison = 1;
        } else if (genreA > genreB) {
          comparison = -1;
        }
        return comparison;
     })
       }else {
        sortOrder='A'  
        console.log ("sorted arrayA")
        arr.sort(function (a, b) {
            const genreA = a.fl.toUpperCase();
            const genreB = b.fl.toUpperCase();
          
            let comparison = 0;
            if (genreA > genreB) {
              comparison = 1;
            } else if (genreA < genreB) {
              comparison = -1;
            }
            return comparison;
        })
     }
     console.log(" arr length " +  arr.length)
      
    return arr
   }

   
  
}