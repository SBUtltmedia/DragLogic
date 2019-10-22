var axioms = ["((~A-~B)-(B-A))", "(A-(B-A))", "((A-(B-C))-((A-B)-(A-C)))"]
// const connectives = [ {name:"Conditional",shorthandSymbol:"-",char:"&#x2192;"},
//                     {name:"And",shorthandSymbol:"@",char:"&#x2227;"},
//                     {name:"Or",shorthandSymbol:"v",char:"&#x2228;"},
//                     {name:"Biconditional",shorthandSymbol:"=",char:"&#x2194;;"},
//                     {name:"Not",shorthandSymbol:"~",char:"&#x007E;"} ]
var proof = {axioms,show:"~(((P-Q)-Q)-~P)",lines:[]}
const connectives = [{
    name: "Conditional",
    shorthandSymbol: "-",
    char: "→"
  },
  {
    name: "And",
    shorthandSymbol: "&",
    char: "&"
  },
  {
    name: "Or",
    shorthandSymbol: "v",
    char: "∨"
  },
  {
    name: "Biconditional",
    shorthandSymbol: "=",
    char: "↔"
  },
  {
    name: "Not",
    shorthandSymbol: "~",
    char: "~"//"¬"
  }
]

const binaryConnectives = connectives.filter((item) => item.name != "Not");
const unaryConnectives = connectives.filter((item) => item.name == "Not");
const atomic = [...Array(11).keys()].map((i) => String.fromCharCode('P'.charCodeAt(0) + i));
const meta = [...Array(15).keys()].map((i) => String.fromCharCode('A'.charCodeAt(0) + i));
const shorthandBinaryConnectives = binaryConnectives.map((item) => item.shorthandSymbol)
const shorthandUnaryConnectives = unaryConnectives.map((item) => item.shorthandSymbol)
const shorthandConnectives = [...shorthandBinaryConnectives, ...shorthandUnaryConnectives]
const types = {
  atomic,
  meta,
  shorthandUnaryConnectives,
  shorthandBinaryConnectives,
  shorthandConnectives
}

function substitution(subIn, subOut, wff) {
  return wff.replace(new RegExp(subOut, "g"), subIn)
}

function isType(char, type) {

  return types[type].indexOf(char) != -1;
}

function toShorthand(wff) {
  var chars = [...wff];
  for (i in chars) {

    connective = connectives.find(connective => connective.char == chars[i])
    if (connective) {
      chars[i] = connective.shorthandSymbol

    }
  }
  return chars.join('');
}





function parenthesisCounter(char) {
  return (Math.abs([, , '(', ')'].indexOf(char))) % 3 - 1
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function findMainConnectorPos(wff) {

  var counter = 0;
  var mainConnectivePos = 0;
  var chars = [...wff];
  for (i in chars) {
    if (isType(chars[i], "shorthandUnaryConnectives") && counter == 0) {
      return i;
    } else if (isType(chars[i], "shorthandBinaryConnectives") && counter == 1) {
      return i;
    } else {

      counter += parenthesisCounter(chars[i]);
    }


  }
}

function findMainConnective(wff) {
  return wff.charAt(findMainConnectorPos(wff))
}

function deParenthesize(wff) {
  return wff.slice(1, -1);
}


function splitFromMainConnective(wff) {
  var not = connectives.find(item => item.name == "Not").shorthandSymbol
  if (findMainConnective(wff) == not) {
    return [ not, "", wff.slice(1)]
  } else {
    return [deParenthesize(wff).slice(0, findMainConnectorPos(wff) - 1), wff.charAt(findMainConnectorPos(wff)), deParenthesize(wff).slice(findMainConnectorPos(wff))]
  }
}

function modusPonens(p1, p2) {
  var [antecedent, consequent] = splitFromMainConnective(p1)
  if (p2 == antecedent && findMainConnective(p1) == connectives.find(item => item.name == "Conditional").shorthandSymbol)
    return consequent;
}
