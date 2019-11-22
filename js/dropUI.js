class dropUI{

  constructor(el, proof, type){
this.lineNumber=1;
this.el=el;
this.proof=proof;
this.type=type
  }




makeProof(){
  this.lineNumber=1;
  this.el.find(".line").remove()
  if(this.proof.show)  {this.el.append(this.makeLine("",this.makeInteractive(this.proof.show,false,false),{rule:"show",lines:[]}))}
// this.proof.lines.forEach((axiom) => {
// console.log(axiom)
// this.el.append( this.makeLine(this.lineNumber++,  makeInteractive(axiom.wff,true,true),{rule:"premise",lines:axiom.justificationLines}))
// })



this.proof.lines.forEach((line)=>{
  this.el.append(this.makeLine(this.lineNumber++,this.makeInteractive(line.wff,true,true),  {rule:line.justification,lines:line.justificationLines}))
});

this.el.find(".number").on("click",evt=>{

console.log(this.proof.deleteLine(this.proof.findLineUid($(evt.currentTarget).text()-1)))
this.makeProof()


})

}




makeLine(lineNumber,wff,justification){
var showLines=justification.lines.map((line)=>this.proof.findLineNumber(line)+1)

return $('<div/>',{class:"line"}).append(
  $('<div/>',{class:"number",html:lineNumber}),
wff,
  $('<div/>',{class:"justification"}).append(
                                    $('<div/>',{class:"rule",html:justification.rule}),
                                    $('<div/>',{class:"lines",html: showLines.join(",")})
                                            )
                                    );



}

 makeSentenceLetters(){
  atomic.forEach((letter)=>{
  $("#sentenceLetters").append(this.makeInteractive(letter,true, false))
  })
}



 renderOperator(wff) {
  var newWff = wff
  connectives.forEach((connective) => {
    newWff = newWff.replace(new RegExp(connective.shorthandSymbol, "g"), connective.char);
  });
  return newWff;
}

 makeModusPonensPanel(){
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




 makeInteractive(wff, isDraggable=true,isDroppable=true) {
   var _this=this;
  var interactiveContainer = $('<div/>', {
    class: "formula"
  });
  interactiveContainer.append(this.makeTree(wff));
  if (isDraggable){
  interactiveContainer.find('span').draggable({
    cursor: "move",
    cursorAt: {
      top: -12,
      left: -20
    },
    start: (event, ui)=> {
      // if($(this).parent().hasClass('formula')){
         $(event.currentTarget).attr("data-type",this.type)

      //

    //  var grabbedWffText=toShorthand($(this).text())
     var closestFormulaDiv = $(event.currentTarget).closest('.formula');

     var lineNumber = closestFormulaDiv.parent().find('.number').text();

      $(event.currentTarget).attr("data-number",lineNumber )
     var  closestFormula = this.findClosestFormula($(event.currentTarget));
     var grabbedFormula= toShorthand($(event.currentTarget).text())
        $(event.currentTarget).attr("data-iswholeformula",closestFormula==grabbedFormula)


     var formula = this.makeInteractive(closestFormula,isDraggable,isDroppable)

          closestFormulaDiv.replaceWith(formula)
     },
    revertDuration: 0,
    revert: true,
    appendTo: 'body',
    refreshPositions: true,
    helper: "clone",
    scroll: false
  });
}
  // requestAnimationFrame(function(){makeDroppable($('.meta_atomic'))});
  if(isDroppable){
    var meta_atomic =interactiveContainer.find('.meta_atomic')

  meta_atomic.each((item)=>{
    this.makeDroppableSubstitution($(meta_atomic[item]))
  }
);
}

  return interactiveContainer;
}

 makeDroppableSubstitution(elem){
 this.makeDroppable(elem,this.dropSubstitution)

}

 makeDroppableModusPonens(elem,accept){

 makeDroppable(elem,dropModusPonens, modusPonensOver,undefined ,accept)
}

 makeDroppableWff(elem,accept){

 makeDroppable(elem, dropModusPonens, undefined,undefined ,accept)
}

 modusPonensOver(event, ui){

  var isTautology = $(ui.draggable).hasClass("isTautology")
  var isAntecedent = $(ui.draggable).hasClass("isAntecedent")
  var dropIsConditional = $(event.target).hasClass("conditional")
  var dropIsAntecedent = $(event.target).hasClass("antecedent")
}

 makeDroppable(elem, callback=()=>null, over=()=>null,accept="*"){

  elem.droppable({
        accept:accept,
         hoverClass: "active",
         tolerance: 'pointer',
         drop:  (ui,event)=>callback(ui,event,this),
         over: over
       })
}


 uiSubstitution(ui,event){

 var subIn = toShorthand($(event.draggable).text())
 var subOut = toShorthand($(ui.target).text())
 var wff = this.findClosestFormula($(ui.target))
 return  substitution(subIn,subOut,wff)

}


 dropSubstitution(ui, event,_this) {
  var lineNumber=$(ui.target).closest('.line').find('.number').html()-1;

  var uid=_this.proof.findLineUid(lineNumber)

  _this.proof.addLine(_this.uiSubstitution(ui,event),{rule:"subsitution",lines:[lineNumber]});
  _this.makeProof();
  //  substitution(subIn, subOut, wff)


}



 dropModusPonens(ui, event) {
  if($(event.draggable).hasClass("isFormula")){
    console.log($(event.target));
}

//  substitution(subIn, subOut, wff)

//makeProof();

}

 findClosestFormula(el){
  return toShorthand(el.closest('.formula').text());
}

 makeTree(wff) {
  if (wff.length == 1) return `<span class="meta_atomic">${wff}</span>`;
  else {
    var [left, mid, right] = splitFromMainConnective(wff)
    if (left == "~") {
      return `<span>${this.renderOperator(left)}${this.makeTree(right)}</span>`
    } else {

      return `<span>(${this.makeTree(left)}${this.renderOperator(mid)}${this.makeTree(right)})</span>`
    }
  }
}


}
