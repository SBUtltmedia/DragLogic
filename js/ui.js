$(function() {
  axioms.forEach((axiom) => {




    makeInteractive(axiom)


  });


})




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
    helper: "clone"
    // start: function(event, ui) {
    //   var $this = $(this);
    //   //Instead of helper: 'clone'
    //   var $newElem = $this.clone().addClass("clonedElem");
    //   $this.css("z-index", 1000); //make sure draggable is on top of all elements
    //   $this.css("position", "absolute").after($newElem); //Keep original space
    //   makeDroppable($newElem.find("div").addBack());
    // },
    // stop: function(event, ui) {
    //   $(this).css("position", "relative") //restore original positioning
    //     .css("z-index", "auto"); //restore original z-index
    //   $(".clonedElem").remove(); //remove cloned element
    // }
  });

  setTimeout(function() {
    $('.meta_atomic').droppable({
      hoverClass: "active",
      drop: interactiveDrop,
      tolerance: 'pointer'
    })
  }, 2000);

  $("body").append(interactiveContainer);
}


function interactiveDrop(ui, event) {
  var subIn = toShorthand($(event.draggable).text())
  var subOut = toShorthand($(ui.target).text())
  var wff = toShorthand($(ui.target).closest('.formula').text())

  substitution(subIn, subOut, wff)

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
