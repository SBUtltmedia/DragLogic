var proof;
var proofUI;
$(function() {

 // makeAxioms()


proof=new Proof("~(((P-Q)-Q)-~P)", axioms)

 // makeModusPonensPanel()
proofUI=new ProofUI($("#proof"), proof);
 proofUI.makeSentenceLetters()
proofUI.makeProof()
wffStation=new Proof("(A-B)", ["~A","(A-B)"])
wffUI=new ProofUI($("#wffConstructor"), wffStation);
wffUI.makeProof()
})
