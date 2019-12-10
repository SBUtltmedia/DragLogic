class Proof {

  constructor(show, premises) {

    this.show = show

    this.premises = premises
    this.lines = this.premises.map((premise) => new Line(premise, "premise", []));

  }

  addLine(wff, justification) {
    if (wff) {
      var uidLines = justification.lines.map((justificationLine) => this.findLineUid(justificationLine))

      this.lines.push(new Line(wff, justification.rule, uidLines))
    }
  }

  deleteLine(uid) {
    var currentLine = this.lines.find(item => item.uid == uid)
    console.log(currentLine.justification)
    if (currentLine.justification !== "premise") {
      this.lines = this.lines.filter(item => item.uid !== uid)

      var dependants = this.lines.filter((line) =>
        line.justificationLines.includes(uid)
      )
      console.log(uid, dependants)

      dependants.forEach((line) => {
        this.deleteLine(line.uid)

      })
    }
  }

  findLineUid(lineNumber) {


    return this.lines[lineNumber].uid
  }

  findLineNumber(uid) {

    return this.lines.indexOf(this.lines.find((line) => line.uid == uid))

  }

  showLines() {
    return this.lines

  }


}



class Line {

  constructor(wff, justification, justificationLines) {

    this.uid = window.performance.now() + Math.random()
    this.wff = wff
    this.justification = justification
    this.justificationLines = justificationLines

  }
  getJustificationLines() {
    return this.justificationLines
  }




}
