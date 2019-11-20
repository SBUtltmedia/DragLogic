
$(function() {

 // makeAxioms()


proof=new Proof("~(((P-Q)-Q)-~P)", axioms)

 // makeModusPonensPanel()
proofUI=new dropUI($("#proof"), proof, "proof");
 proofUI.makeSentenceLetters()
proofUI.makeProof()
wffStation=new Proof("(A-B)", ["~A","(A-B)"])
wffUI=new dropUI($("#wffConstructor"), wffStation, "wffStation");
wffUI.makeProof()

inferenceRules=new InferenceRules(proofUI, proof)
inferenceRules.makeModusPonens()

})
