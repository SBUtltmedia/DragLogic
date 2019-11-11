class ProofUI{

  constructor(el, proof){
this.lineNumber=1;
this.el=el;
this.proof=proof;

  }




makeProof(){
  this.lineNumber=1;
  this.el.html("")
    this.el.append(this.makeLine("",makeInteractive(this.proof.show,false,false),{rule:"show",lines:[]}))
// this.proof.lines.forEach((axiom) => {
// console.log(axiom)
// this.el.append( this.makeLine(this.lineNumber++,  makeInteractive(axiom.wff,true,true),{rule:"premise",lines:axiom.justificationLines}))
// })



this.proof.lines.forEach((line)=>{
  this.el.append(this.makeLine(this.lineNumber++,makeInteractive(line.wff,true,true),  {rule:line.justification,lines:line.justificationLines}))
});

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




}
