class InferenceRules {
  constructor(ui, proof) {
    this.ui = ui;
    this.proof = proof;
    this.conditionalLine = 0;
    this.antecedentLine = 0;
  }

  makeModusPonens() {

    var conditional = $('<div/>', {
      class: "conditional inferenceDrop"
    });
    this.ui.makeDroppable(conditional, (event, ui) => this.isConditional(event, ui))
    var antecedent = $('<div/>', {
      class: "antecedent inferenceDrop grayed"
    });
    this.ui.makeDroppable(antecedent, (event, ui) => this.isAntecedent(event, ui))
    $('#inferenceRules').append([conditional, antecedent])
  }
  isConditional(event, ui) {

    console.log(ui.draggable.data("iswholeformula"))
    this.conditionalLine = ui.draggable.data("number") - 1
    var type = ui.draggable.data("type")
    var wff = ui.draggable.text()
    var wffShorthand = toShorthand(wff)

    if (isConditional(wffShorthand)) {
      if (ui.draggable.data("iswholeformula")==true) {
        console.log(splitFromMainConnective(wffShorthand))
        $('.antecedent').html(splitFromMainConnective(wffShorthand)[0])
        $('.conditional').html(wff)
      }
    }
    //   console.log(wff)
    // console.log(event, ui.draggable)

  }
  isAntecedent(event, ui) {

    var droppedItem = toShorthand(ui.draggable.text())
    var expectedValue = $('.antecedent').html()

    if (droppedItem == expectedValue) {
      this.antecedentLine = ui.draggable.data("number") - 1
      var consequent = splitFromMainConnective(toShorthand($('.conditional').html()))[2]
      this.proof.addLine(consequent, {
        rule: "modus ponens",
        lines: [this.conditionalLine, this.antecedentLine]
      });
      this.ui.makeProof();
    }
    //   $('.antecedent').html
    //
    // }
  }
}
