import * as Logic from "./logic.js"
export default class InferenceRulesUI {
  constructor(ui, proof) {
    this.ui = ui;
    this.proof = proof;
    this.conditionalLine = 0;
    this.antecedentLine = 0;
  }


  isConditionalWholeFormula(event, ui) {

 
    this.conditionalLine = ui.draggable.data("number") - 1
    let type = ui.draggable.data("type")
    let wff = ui.draggable.text()
    let wffShorthand = Logic.toShorthand(wff)

    if (Logic.isConditional(wffShorthand)) {
      if (ui.draggable.data("iswholeformula")==true) {
       
        $('.antecedent').html(this.ui.makeTree(Logic.splitFromMainConnective(wffShorthand)[0]))
        $('.conditional').html(wff)
      }
    }
    //   console.log(wff)
    // console.log(event, ui.draggable)

  }
  isAntecedent(event, ui) {
    if (ui.draggable.data("iswholeformula")==true) {
    let droppedItem = Logic.toShorthand(ui.draggable.text())
    let expectedValue = Logic.toShorthand($('.antecedent').text())
    if (droppedItem == expectedValue) {
      this.antecedentLine = ui.draggable.data("number") - 1
      let consequent = Logic.splitFromMainConnective(Logic.toShorthand($('.conditional').html()))[2]
      this.proof.addLine(consequent, {
        rule: "modus ponens",
        lines: [this.conditionalLine, this.antecedentLine]
      });
      this.ui.makeProof();
    }
  }
    //   $('.antecedent').html
    //
    // }
  }
}
