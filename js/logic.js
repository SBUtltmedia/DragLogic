var axioms = ["((~A-~B)-(B-A))", "(A-(B-A))", "((A-(B-C))-((A-B)-(A-C)))"]
const largestAtomicCount = 15
const tautologyConst = tautology()
// const connectives = [ {name:"Conditional",shorthandSymbol:"-",char:"&#x2192;"},
//                     {name:"And",shorthandSymbol:"@",char:"&#x2227;"},
//                     {name:"Or",shorthandSymbol:"v",char:"&#x2228;"},
//                     {name:"Biconditional",shorthandSymbol:"=",char:"&#x2194;;"},
//                     {name:"Not",shorthandSymbol:"~",char:"&#x007E;"} ]

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
    char: "~" //"¬"
  }
]

function tautology() {
  return stringToBinary(Array(2 ** largestAtomicCount).fill(1).join(''))

}

function isTautology(wff) {
  return getTruthValue(wff) == tautologyConst
}

function isConditional(wff) {

  if (splitFromMainConnective(wff)[1] == "-") {
    return true
  } else {
    return false
  }

}

function getTruthValue(wff) {
  if (wff.length == 1) {
    var atomicIndex = wff.charCodeAt(0) - 64;
    if (atomicIndex > 15) {

      atomicIndex -= 15;
    }
    return stringToBinary(makeAtomicTruthString(atomicIndex))
  } else {
    var [left, mid, right] = splitFromMainConnective(wff)
    if (left == "~") {
      return tautologyConst - getTruthValue(right)
    } else {

      return tautologyConst - getTruthValue(left) | getTruthValue(right)
    }
  }
}




function makeAtomicTruthString(m = 1, n = largestAtomicCount) {
  var string = ""
  var reciprocal = 1 / 2 ** (m - 1)
  var numberOfRows = 2 ** (n + 1) / 2 ** m;

  while ((numberOfRows -= reciprocal)) {
    string += Math.floor(numberOfRows) % 2
  }
  string += Math.floor(numberOfRows) % 2
  return string
}

function stringToBinary(str) {
  var start = BigInt(0)
  str = "*" + str
  while (str = str.slice(1)) {
    start += BigInt(2) ** BigInt(str.length - 1) * BigInt(parseInt(str.charAt(0)))
  }
  return start
}


// {
// tmp=power;
// while(tmp--){
// if(tmp%(2**mm){print }
//
// //make this do something
//
// }
//
// }
//
//
// }





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
    return [not, "", wff.slice(1)]
  } else {
    return [deParenthesize(wff).slice(0, findMainConnectorPos(wff) - 1), wff.charAt(findMainConnectorPos(wff)), deParenthesize(wff).slice(findMainConnectorPos(wff))]
  }
}

function modusPonens(p1, p2) {
  var [antecedent, connective, consequent] = splitFromMainConnective(p1)
  if (p2 == antecedent && findMainConnective(p1) == connectives.find(item => item.name == "Conditional").shorthandSymbol)
    return consequent;
}
