
$(function() {

 // makeAxioms()

var show =  location.hash.split("#")[1]||"(((P-Q)-P)-P)"
save= new Save()
proof=new Proof(show, axioms, save)

 // makeModusPonensPanel()
proofUI=new dropUI($("#proof"), proof, "proof");

proofUI.makeProof()
wffStation=new Proof("", ["~A","(A-B)"])
wffUI=new dropUI($("#wffConstructor"), wffStation, "wffStation");
wffUI.makeProof()

inferenceRules=new InferenceRules(proofUI, proof)
inferenceRules.makeModusPonens()
 proofUI.makeSentenceLetters()
makeTooltips()
setTimeout(()=>{
introJs().setOption("disableInteraction", "true");
  introJs().start();},1)
})
function makeTooltips(){
var tooltips=[{"selector":"#proof","text":"The proof will be displayed here as it is constructed.", "position":'bottom left'},
{"selector":"#sentenceLetters","text":"Sentence letters can be dragged from this box onto the WFF Constructor to create new WFFs, or substituted in for letters in the proof.", "postion":'bottom right'},
{"selector":"#wffConstructor","text":"This tool can be used to create new well-formed formulas, also known as WFFs.", "position":'right top'},
{"selector":"#inferenceRules","text":"This tool takes a condtional in the first box and its antecendent in the second box. It returns the consequent of the conditional by using Modus Ponens.", "postion":'bottom right'}];
tooltips.forEach((tooltip)=>$(tooltip.selector).qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: tooltip.text
    }, position: {
        my: 'top left',  // Position my top left...
        at: tooltip.position, // at the bottom right of...
        // target: $('.selector') // my target
    }
}))


}
