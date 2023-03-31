const pdf = require('html-pdf');
const path = require('path');




// exports.createPdf = async (req, res, next) => {
//   console.log('*')
//   console.log('Request to create LFAT PDF');
//   console.log('*')

//   let errorFlag = false
//   console.log("check 1")
//   await pdf.create(pdfTemplate(req.body), { directory: "./server/api/documments"}).toFile('test2.pdf', (err) => {
//     if(err) {
//         // res.send(Promise.reject());
//         errorFlag = true

//         console.log("inside the pDF create function");
//     }

//     console.log("check 2")

//   });

//   console.log("created Pdf Result - ", errorFlag)
//   console.log("check 3")

//   if(errorFlag){
//     res.status(205).json({msg: "error generating pdf"});

//     return
//   }
  

//   res.sendFile(`${__dirname}/result.pdf`)
// }

exports.createPdf = (req, res) => {

  let data = req.body;

  const pdfTemplate = require('../../assets/templates/Lfar');

  console.log("request to generate pdf ", data);
  pdf.create(pdfTemplate(data.metaData, data.assets), {}).toFile('check1.pdf', (err) => {
      if(err) {
          res.send(Promise.reject());
      }

      res.send(Promise.resolve());
  });
}

exports.getPdf = (req, res) => {
  console.log("request to fetch pdf");

  // res.sendFile(`${__dirname}/check1.pdf`)
  res.sendFile(path.join(__dirname, "..", "..", "..", "check1.pdf"));
}