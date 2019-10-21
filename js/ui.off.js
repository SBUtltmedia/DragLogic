$(function() {
  // $( "#draggable2" ).draggable({ snap: ".ui-widget-header" });
  // $( "#draggable3" ).draggable({ snap: ".ui-widget-header" });
  init();
});

function makeSubstitutionStations() {

  var container = $('<div/>', {
    class: "substitutionStationContainer"
  });


  axioms.forEach((axiom) => {
    makeSubstitutionStation(renderWff(axiom), container)
  })
  container.append($('<div/>', {
    class: "substitutionStationOutput"
  }))
  $('body').append(container)


}




function makeSubstitutionStation(wff, el) {
  var container = $('<div/>', {
    class: "substitutionStation station"
  });

  [...wff].forEach((char) => {

    var span = $("<span/>", {
      html: char
    })

    if (meta.includes(char)) {
      span.addClass("stationDroppable").droppable({
        drop: function(event, ui) {

          var wffIndex = $(event.target).parent().index();

          var subIn = $(ui.draggable).html()
          var subOut = $(event.target).html()
          console.log(subIn, subOut, axioms[wffIndex])
          makeSubstitutionStation( renderWff(substitution(subIn, subOut, axioms[wffIndex])),$('.substitutionStationOutput'));
        //  $('.substitutionStationOutput').html(makeDraggable(renderWff(substitution(subIn, subOut, axioms[wffIndex])))).addClass("substitutionStation station")
          // $(this)
          //   .addClass("ui-state-highlight")

        }
      });
    } else {
      span.addClass("stationOther")

    }
      container.append(span)
  })
  $(el).append(container);
}

function makeDraggable(el)
{
  var drag = $("<span/>", {
    html: el,
    class: "stationDraggable"
  }).draggable({
    cursor: "move",
    cursorAt: { top: 5, left: 5 },
    helper: function( event ) {
      return $( '<div/> ').append(el);
    },
    revert: true
    // helper: "clone"
  });
return drag;


}
function makeSubstitutionTerminal(atoms, el) {
  var container = $('<div/>', {
    class: "substitutionTerminal terminal"
  });

  atoms.forEach((atom) => {

  container.append(makeDraggable(atom))

  });
  $(el).append(container);
}

function renderWff(wff) {
  newWff = wff
  operators.forEach((operator) => {
    newWff = newWff.replace(new RegExp(operator.shorthandSymbol, "g"), operator.char);
  });
  return newWff;
}

function init() {
  makeSubstitutionStations();
  makeSubstitutionTerminal(atomic, $("body"));
}
