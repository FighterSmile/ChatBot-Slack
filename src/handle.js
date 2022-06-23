
function formatting(text){
  if(text.constructor != String) return null
  let aMinus = text.replace(/[áàäâ]/g,'a');
  let eMinus = aMinus.replace(/[éèëê]/g,'e');
  let iMinus = eMinus.replace(/[íìïî]/g,'i');
  let oMinus = iMinus.replace(/[óòöô]/g,'o');
  let uMinus = oMinus.replace(/[úùüû]/g,'u');
  let enieMinus = uMinus.replace(/[ñ]/g,'n');
  let patron = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;
  return enieMinus.replace(patron, '');
}



module.exports = {formatting};