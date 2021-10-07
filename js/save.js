export default class Save {

  constructor() {

  }
saveProof(proof){
  $.post( "save.php", { data: JSON.stringify(proof)} );

}
}
