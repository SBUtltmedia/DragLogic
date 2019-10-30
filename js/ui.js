$(function() {

 // makeAxioms()
 makeWffPanel()
 makeSentenceLetters()
 makeProof()
 // makeModusPonensPanel()

})



function  makeWffPanel(){




}



function makeSentenceLetters(){
  atomic.forEach(function(letter){
  $("#wffConstructor").append(makeInteractive(letter,true, false))
  })
}

function makeProof(){
    $("#proof").html("")
var lineNumber=1
    if(proof.axioms){
      proof.axioms.forEach((axiom) => {

  $("#proof").append( makeLine(lineNumber++,axiom,{rule:"axiom",lines:[]}))
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
  makeInteractive(wff,true,true),
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

// function makeWffPanel(connector){
// var elemDiv;
//   var panel = $("<div/>",{class:"panel"});
//   ["left", "right"].forEach(function(elem){
//    elemDiv = $("<div/>",{class:`${elem} inferenceDrop`})
// makeDroppableWff(elemDiv, elem)
//     panel.append(elemDiv)
//
// });
//
// panel.find('.left').after($("<div/>",{class:"connector",html:renderOperator("-")}))
// elemDiv=elemDiv.before($("<div/>",{html:"("})).after($("<div/>",{html:")"}))
//
//
//   // panel.children().on("mouseenter",function(event){
//   //   console.log(event);
//   // });
//
//  $('#wffConstructor').append(panel)
//
// }






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

      var formula = makeInteractive(findClosestFormula($(this)))
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

  var lineNumber=$(ui.target).closest('.line').find('.number').html();
  proof.lines.push({wff:uiSubstitution(ui,event),justification:{rule:"subsitution",lines:[lineNumber]}})
  makeProof();
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
