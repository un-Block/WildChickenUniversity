const { PDFDocument, StandardFonts } = PDFLib;
const myDate = new Date();
async function fillForm(fname, lname, major) {
  // Fetch the PDF with form fields
  console.log(major)
  const formUrl = "https://cdn.jsdelivr.net/gh/WildChickenUniversity/WildChickenUniversity/assets/template_certificate.pdf"
  const englishUnicode = /^[a-zA-Z]+$/;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const fontkit = window.fontkit;
  pdfDoc.registerFontkit(fontkit);
  const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
  const ubuntuBytes = await fetch(url).then(res => res.arrayBuffer())
  const font5 = await pdfDoc.embedFont(ubuntuBytes)
  // Font converted into base64 from https://github.com/ctrlcctrlv/chomsky, licensed under  OFL-1.1
  // Copyright (c) 2018, Fredrick R. Brennan (<copypaste@kittens.ph>),
  const chomskyFontUrl = "https://cdn.jsdelivr.net/gh/WildChickenUniversity/WildChickenUniversity/assets/fonts/Chomsky.otf";
  const chomskyFontByte = await fetch(chomskyFontUrl).then(res => res.arrayBuffer());
  const chomskyFont = await pdfDoc.embedFont(chomskyFontByte);

  const sourceHanSerifUrl = "https://cdn.jsdelivr.net/gh/WildChickenUniversity/WildChickenUniversity/assets/fonts/noto-serif-sc-v16-chinese-simplified-900.woff2";
  const sourceHanSerifByte = await fetch(sourceHanSerifUrl).then(res => res.arrayBuffer());
  const sourceHanSerif = await pdfDoc.embedFont(sourceHanSerifByte);


  console.log(myDate.toDateString().substring(4));
  console.log(`${fname} ${lname} major: ${major}`);
  // Get the form containing all the fields
  const form = pdfDoc.getForm();
  // Get all fields in the PDF by their names
  const majorField = form.getTextField("major");
  const nameField = form.getTextField("name");

  // Fill in the name field
  majorField.setText(major);
  nameField.setText(`${fname} ${lname}`);
  const font = englishUnicode.test(major) ? chomskyFont : sourceHanSerif;
  const fontSize = font.sizeAtHeight(31);
  majorField.updateAppearances(font);
  nameField.updateAppearances(font);

  // Flatten the form fields
  form.flatten();
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  // Trigger the browser to download the PDF document
  download(
    pdfBytes,
    `WCU_Undergraduation_Certificate_${fname}_${lname}_${myDate.toDateString().substring(4)}.pdf`,
    "application/pdf"
  );

}