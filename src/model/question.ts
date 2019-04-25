import {Answer} from "../model/answer"
import {Item} from "../model/item"

export class Question{
    id:string;
	type:string;
    flashCardFront:string;
    flashCardBack:string;
    flashCardBackEng:string;
    flashCardAudio:string;
    flashCardFlipped:boolean=false;
    questionText:string;
    answers:Array<Answer>;
    wordsRightOrder:Array<Answer>;
    item:Item
    answer:string
}