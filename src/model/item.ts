//import { StringIterator } from "lodash";
export class Item{
	id:string;
	fl:string;
	tl:string;
	en:string;
	ct:string;
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
	topic:string
	inputValue:string
	subtopic:string
	searchTopic:string
	selectedSlow:boolean=false
	selectedCtr:boolean=false
	//check if it recording or not
	isRecord:boolean=false
	isPlay:boolean=false
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