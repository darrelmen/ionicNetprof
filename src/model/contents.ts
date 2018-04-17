import {Item} from './item'
import {Child} from './child'

export class Contents {
    id:string;
    type:string;
    name:string;
    children:Array<Child>;
	items:Array<Item>;
}