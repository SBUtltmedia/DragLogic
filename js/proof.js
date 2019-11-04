


class Proof{

constructor(show, premises){

  this.show=show

  this.premises=premises
  this.lines=this.premises.map((premise)=>new Line(premise, "premise", []));

}

  addLine(wff,  justificationLines, justification){

var uidLines=justificationLines.map((justificationLine)=>this.findLineUid(justificationLine))

this.lines.push(new Line(wff, justification, uidLines))

  }



findLineUid(lineNumber){

  return this.lines[lineNumber].uid
}

findLineNumber(uid){

return this.lines.indexOf(this.lines.find((line)=>line.uid==uid))

}

showLines(){
return this.lines

}


}



class Line{

  constructor(wff, justification, justificationLines){

    this.uid=window.performance.now()+Math.random()
    this.wff=wff
    this.justification=justification
    this.justificationLines=justificationLines

  }
  getJustificationLines() {
         return this.justificationLines
     }




  }
