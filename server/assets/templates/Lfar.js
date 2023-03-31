module.exports = (metaData={}, assets={}) => {

  console.log('creating pdf data - ', metaData);
  console.log('assets data - ', assets);

  // return `
  // <!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta http-equiv="X-UA-Compatible" content="IE=edge">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <style>
  //     .body {
  //       /* margin: 40px 100px; */
  //       width: 600px;
  //       margin: auto;
  //     }
  
  //     .header {
  //       font-weight: bold;
  //       text-align: center;
  //     }
  
  //     .sub-header {
  //       display: flex;
  //       align-items: center;
  //       justify-content: space-between;
  //     }
  
  //     .table-container {
  //       border: 0.5px solid #000;
  //     }
  
  //     .row {
  //       display: flex;
  //     }
  
  //     .boxsm {
  //       border: 0.5px solid #000;
  //       width: 40px;
  //       padding: 5px;
  //     }
      
  //     .boxlg {
  //       border: 0.5px solid #000;
  //       width: 260px;
  //       padding: 5px;
  //     }
  //   </style>
  //   <title>Document</title>
  // </head>
  // <body class="body">
  //   <header class="header">
  //     <p>${metaData.bankName}</p>
  //     <p class="sub-header">
  //       <span>MAIN</span>
  //       <span>BRANCH</span>
  //       <span>BRANCH CODE ${metaData.branchCode}</span>
  //     </p>
  //     <p class="sub-header">
  //       <span>UDAIPUR</span>
  //       <span>REGION</span>
  //       <span>REGION CODE ${metaData.regionCode}</span>
  //     </p>
  //     <p>
  //       LONGFORM AUDIT REPORT FOR THE YEAR ENDED 31.03.2022
  //     </p>
  //   </header>
  //   <main>
  //     1. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assets
  //   </main>
  //   <div class="table-container">
  //     <span class="row">
  //       <section class="boxsm">1</section>
  //       <section class="boxlg">Cash</section>
  //       <section class="boxsm"></section>
  //       <section class="boxlg"></section>
  //     </span>
  
  //     <span class="row">
  //       <section class="boxsm">(a)</section>
  //       <section class="boxlg">
  //         Does the system ensure that cash maintained is in effective joint custody of two or more officials, as  per  the  instructions  of  the controlling authorities of the bank?
  //       </section>
  //       <section class="boxsm"> : </section>
  //       <section class="boxlg">
  //         ${assets.one ? assets.one.a : ""}
  //       </section>
  //     </span>
  //   </div>
  //   <Table>
  //     <tr>
  //       <th>1</th>
  //       <th>Cash</th>
  //       <th></th>
  //       <th></th>
  //     </tr>
  //     <tr>
  //       <th>(a)</th>
  //       <th>Does the system ensure that</th>
  //       <th> : </th>
  //       <th>Yes, the system ensure that</th>
  //     </tr>
  //   </Table>
  // </body>
  // </html>
  // `


  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      .body {
        /* margin: 40px 100px; */
        width: 800px;
        margin: auto;
      }

      .header {
        font-weight: bold;
        /* text-align: center; */
      }

      .sub-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .sub-header-left {
        width: 300px;
      }

      .sub-header-center {
        width: 300px;
      }

      .sub-header-right {
        width: 200px;
      }

      .text-center {
        text-align: center;
      }

      .table-container {
        border: 0.5px solid #000;
      }

      .row {
        display: flex;
      }

      .boxsm {
        border: 0.5px solid #000;
        width: 40px;
        padding: 5px;
      }
      
      .boxlg {
        border: 0.5px solid #000;
        width: 300px;
        padding: 5px;
      }
    </style>
    <title>Document</title>
  </head>
  <body class="body">
    <header >
      <p class="text-center">${metaData.bankName}</p>
      <section class="sub-header">
        <p class="sub-header-left">MAIN</p>
        <p class="sub-header-center">BRANCH</p>
        <p class="sub-header-right">BRANCH CODE ${metaData.branchCode}</p>
      </section>
      <section class="sub-header">
        <p class="sub-header-left">UDAIPUR</p>
        <p class="sub-header-center">REGION</p>
        <p class="sub-header-right">REGION CODE ${metaData.regionCode}</p>
      </section>
      <p>
        LONGFORM AUDIT REPORT FOR THE YEAR ENDED 31.03.2022
      </p>
    </header>
    <main>
      1. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assets
    </main>
    <div class="table-container">
      <span class="row">
        <section class="boxsm">1</section>
        <section class="boxlg">Cash</section>
        <section class="boxsm"></section>
        <section class="boxlg"></section>
      </span>

      <span class="row">
        <section class="boxsm">(a)</section>
        <section class="boxlg">
          Does the system ensure that cash maintained is in effective joint custody of two or more officials, as  per  the  instructions  of  the controlling authorities of the bank?
        </section>
        <section class="boxsm"> : </section>
        <section class="boxlg">
        ${assets.one ? assets.one.a : ""}
        </section>
      </span>
    </div>
  </body>
  </html>
    `
};