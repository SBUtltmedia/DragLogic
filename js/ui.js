$(function() {

 makeAxioms()

})

function makeAxioms(){
  $("#axioms").html("")
  axioms.forEach((axiom) => {




      $("#axioms").append(makeInteractive(axiom))


  });
}


function renderOperator(wff) {
  newWff = wff
  connectives.forEach((connective) => {
    newWff = newWff.replace(new RegExp(connective.shorthandSymbol, "g"), connective.char);
  });
  return newWff;
}


function makeInteractive(wff) {
  var interactiveContainer = $('<div/>', {
    class: "formula"
  });
  interactiveContainer.append(makeTree(wff));
  interactiveContainer.find('span').draggable({
    cursor: "move",
    cursorAt: {
      top: -12,
      left: -20
    },
    start: function(event, ui) {

      var closestFormulaDiv = $(this).closest('.formula');
      closestFormulaDiv.html(makeInteractive(findClosestFormula($(this))))
     },
    revertDuration: 0,
    revert: true,
    appendTo: 'body',
    refreshPositions: true,
    helper: "clone" // uncomment this if the create class block breaks
  });

  // original droppable block, uncomment if makeDroppable breaks
  // requestAnimationFrame(function(){makeDroppable($('.meta_atomic'))});
interactiveContainer.find('.meta_atomic').each(function(item){makeDroppable($(this))});
  return interactiveContainer;
}

function makeDroppable(elem){
  elem.droppable({
         // greedy: true,
         hoverClass: "active",
         tolerance: 'pointer',
         drop: interactiveDrop
       })
}


function interactiveDrop(ui, event) {
  var subIn = toShorthand($(event.draggable).text())
  var subOut = toShorthand($(ui.target).text())
  var wff = findClosestFormula($(ui.target))
  console.log(wff);
  substitution(subIn, subOut, wff)

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
