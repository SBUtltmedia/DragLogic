var proof;
var proofUI;
$(function() {

 // makeAxioms()

 makeSentenceLetters()
proof=new Proof("~(((P-Q)-Q)-~P)", axioms)
 // makeModusPonensPanel()
proofUI=new ProofUI($("#proof"), proof);
proofUI.makeProof()
wffStation=new Proof("(A-B)", ["~A","(A-B)"])
wffUI=new ProofUI($("#wffConstructor"), wffStation);
wffUI.makeProof()
})






function makeSentenceLetters(){
  atomic.forEach(function(letter){
  $("#sentenceLetters").append(makeInteractive(letter,true, false))
  })
}



function renderOperator(wff) {
  newWff = wff
  connectives.forEach((connective) => {
    newWff = newWff.replace(new RegExp(connective.shorthandSymbol, "g"), connective.char);
  });
  return newWff;
}

function makeModusPonensPanel(){
  var panel = $("<div/>",{class:"panel"});
  ["conditional", "antecedent"].forEach(function(elem){
  var elemDiv = $("<div/>",{class:`${elem} inferenceDrop`})
  panel.append(elemDiv)
  makeDroppableModusPonens(elemDiv, elem)
});
  // panel.children().on("mouseenter",function(event){
  //   console.log(event);
  // });

 $('#inferenceRules').append(panel)

}




function makeInteractive(wff, isDraggable=true,isDroppable=true) {
  var interactiveContainer = $('<div/>', {
    class: "formula"
  });
  interactiveContainer.append(makeTree(wff));
  if (isDraggable){
  interactiveContainer.find('span').draggable({
    cursor: "move",
    cursorAt: {
      top: -12,
      left: -20
    },
    start: function(event, ui) {
      // if($(this).parent().hasClass('formula')){
      //   $(this).addClass("isFormula")
      //   console.log($(this))
      //

    //  var grabbedWffText=toShorthand($(this).text())
      var closestFormulaDiv = $(this).closest('.formula');

      var formula = makeInteractive(findClosestFormula($(this)),isDraggable,isDroppable)
           closestFormulaDiv.replaceWith(formula)
     },
    revertDuration: 0,
    revert: true,
    appendTo: 'body',
    refreshPositions: true,
    helper: "clone"
  });
}
  // requestAnimationFrame(function(){makeDroppable($('.meta_atomic'))});
  if(isDroppable){interactiveContainer.find('.meta_atomic').each(function(item){ makeDroppableSubstitution($(this))});
}

  return interactiveContainer;
}

function makeDroppableSubstitution(elem){

 makeDroppable(elem,dropSubstitution)

}

function makeDroppableModusPonens(elem,accept){

 makeDroppable(elem,dropModusPonens, modusPonensOver,undefined ,accept)
}

function makeDroppableWff(elem,accept){

 makeDroppable(elem, dropModusPonens, undefined,undefined ,accept)
}

function modusPonensOver(event, ui){

  var isTautology = $(ui.draggable).hasClass("isTautology")
  var isAntecedent = $(ui.draggable).hasClass("isAntecedent")
  var dropIsConditional = $(event.target).hasClass("conditional")
  var dropIsAntecedent = $(event.target).hasClass("antecedent")
  console.log({isTautology, isAntecedent, dropIsConditional, dropIsAntecedent});
}

function makeDroppable(elem, callback, over=()=>null,accept="*"){
  elem.droppable({
        accept:accept,
         hoverClass: "active",
         tolerance: 'pointer',
         drop:  callback,
         over: over
       })
}


function dropSubstitution(ui, event) {

  var lineNumber=$(ui.target).closest('.line').find('.number').html()-1;
  console.log(lineNumber)
  var uid=proof.findLineUid(lineNumber)
  console.log(uid);
  proof.addLine(uiSubstitution(ui,event),{rule:"subsitution",lines:[lineNumber]});
  proofUI.makeProof();
  //  substitution(subIn, subOut, wff)
}

function uiSubstitution(ui,event){

  var subIn = toShorthand($(event.draggable).text())
  var subOut = toShorthand($(ui.target).text())
  var wff = findClosestFormula($(ui.target))
  return  substitution(subIn,subOut,wff)

}

function dropModusPonens(ui, event) {
  if($(event.draggable).hasClass("isFormula")){
    console.log($(event.target));
}

//  substitution(subIn, subOut, wff)

//makeProof();

}

function findClosestFormula(el){
  return toShorthand(el.closest('.formula').text());
}

function makeTree(wff) {
  if (wff.length == 1) return `<span class="meta_atomic">${wff}</span>`;
  else {
    var [left, mid, right] = splitFromMainConnective(wff)
    if (left == "~") {
      return `<span>${renderOperator(left)}${makeTree(right)}</span>`
    } else {

      return `<span>(${makeTree(left)}${renderOperator(mid)}${makeTree(right)})</span>`
    }
  }
}
