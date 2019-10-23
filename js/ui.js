$(function() {

 // makeAxioms()
 makeSentenceLetters()
 makeProof()
 makeModusPonensPanel()
})

function makeAxioms(){
  $("#axioms").html("")
  axioms.forEach((axiom) => {




      $("#axioms").append(makeInteractive(axiom, false))


  });
}

function makeSentenceLetters(){
  atomic.forEach(function(letter){
  $("#wffConstructor").append(makeInteractive(letter,true))
  })
}

function makeProof(){
    $("#proof").html("")
var lineNumber=1
    if(proof.axioms){
      proof.axioms.forEach((axiom) => {
        var line = makeLine(lineNumber++,axiom,{rule:"axiom",lines:[]})
  $("#proof").append(line)
  line.find(".formula").addClass("tautology")
})

    }
    $("#proof").append(makeLine(lineNumber++,proof.show,{rule:"show",lines:[]}))
    proof.lines.forEach((line)=>{
      $("#proof").append(makeLine(lineNumber++,line.wff,line.justification))
    });
}


function makeLine(lineNumber,wff,justification){
// console.log(justification)

return $('<div/>',{class:"line"}).append(
  $('<div/>',{class:"number",html:lineNumber}),
  makeInteractive(wff,true),
  $('<div/>',{class:"justification"}).append(
                                    $('<div/>',{class:"rule",html:justification.rule}),
                                    $('<div/>',{class:"lines",html:justification.lines.join(",")})
                                            )
                                    );



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



function makeInteractive(wff, isDraggable) {
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
      if($(this).parent().hasClass('tautology')){
          $(this).addClass("isTautology")
      }
      var grabbedWffText=toShorthand($(this).text())
      var closestFormulaDiv = $(this).closest('.formula');
      var formula = makeInteractive(findClosestFormula($(this)),true)
      console.log(toShorthand(formula.text()),grabbedWffText);
      if (grabbedWffText == splitFromMainConnective(toShorthand(formula.text()))[0]) {
        $(this).addClass("isAntecedent");
      }
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
  interactiveContainer.find('.meta_atomic').each(function(item){ makeDroppableSubstitution($(this))});
  return interactiveContainer;
}

function makeDroppableSubstitution(elem){

 makeDroppable(elem,dropSubstitution)

}

function makeDroppableModusPonens(elem,accept){

 makeDroppable(elem,dropModusPonens, modusPonensOver,undefined ,accept)
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
        accept:".isTautology",
         hoverClass: "active",
         tolerance: 'pointer',
         drop:  callback,
         over: over
       })
}


function dropSubstitution(ui, event) {
  var subIn = toShorthand($(event.draggable).text())
  var subOut = toShorthand($(ui.target).text())
  var wff = findClosestFormula($(ui.target))
  var wffOut = substitution(subIn,subOut,wff)
  var lineNumber=$(ui.target).closest('.line').find('.number').html();
  proof.lines.push({wff:wffOut,justification:{rule:"subsitution",lines:[lineNumber]}})
  makeProof();
  //  substitution(subIn, subOut, wff)
}



function dropModusPonens(ui, event) {
  if($(event.draggable).hasClass("isFormula")){
    console.log($(event.target));
}

//  substitution(subIn, subOut, wff)

makeProof();

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
