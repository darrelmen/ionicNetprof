//import { StringIterator } from "lodash";
// the item case should match with the one comming from the http request response 
// ex. Topic should be Topic and not topic

export class Item{
	id:string;
	fl:string;
	tl:string;
	en:string;
	ct:string;
	ctid:string;
	ctr:string;
	ctmref:string;
	ctfref:string;
	ref:string;
	mrr:string;
	msr:string;
	frr:string;
	fsr:string;
	lesson:string
	lessonId:string
	sublesson:string
	sublessonId:string
	Topic:string
	inputValue:string
	subtopic:string
	Grammar:string
	Dialect:string
	searchTopic:string
	selectedSlow:boolean=false
    selectedCtr:boolean=false
	timeRecord:string
	//check if it recording or not
	isRecord:boolean=false
	isRecordCtx:boolean=false
	isRecordNew:boolean=false
	isPlay:boolean=false
	playIconMale='male'
	playIconFemale='female'
	isAddPlaylist=false
	//not in use right now
	isActiveM:boolean=true
	isActiveF:boolean=true
	color:string="primary"
	duration:string
	completed:boolean=false
	isScored:boolean
	progress=0
	playing:boolean=false

	//from scores json
	s:string="0"
	scores=[]
	h=[];
	scoreJson=[]
}