
$(function() {

 // makeAxioms()


proof=new Proof("~(((P-Q)-Q)-~P)", axioms)

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
})
function makeTooltips(){
var tooltips=[{"selector":"#proof","text":"Proof text goes here", "position":'bottom left'}, {"selector":"#sentenceLetters","text":"Sentence letter text goes here", "postion":'bottom right'},
{"selector":"#wffConstructor","text":"WFF Constructor text goes here", "postion":'bottom right'}, {"selector":"#inferenceRules","text":"Modus Ponens text goes here", "postion":'bottom right'}];
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
