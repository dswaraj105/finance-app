const _ = require('lodash');
const moment = require('moment');

const __generateNRandomNumbers = (n, max) => {
  const nums = new Set();
  while(nums.size !== n) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }

  return Array.from(nums);
}

const __parseNumbers = (str="") => {
  str = str.trim();


  let num = str.split(',');

  num = num.join("");

  if(isNaN(num)){
    return false
  }
  
  num = parseFloat(num);
  
  return num
}

const __ParseString = (val) =>  {
  let num = parseFloat(val)
  if(num != NaN){
    return num
  } else {
    return ""
  }
}


const __getDaysBeetwenDates = (date1="", date2="") => {

  if(!date1 || !date2){
    return null
  }

  date1 = moment(date1);
  date2 = moment(date2);

  if(!date1.isValid() || !date2.isValid()){
    return null;
  }

  let days = date2.diff(date1, 'days');

  days = Math.abs(days);

  // console.log("DIFF - ", date1, date2, " -> ", days)

  return days
}

const __checkArrayStringInLine = (arr=[], line="") => {
  let flag = false;

  if(!line){
    return false;
  }

  line = line.toLocaleLowerCase();

  for(let i=0; i<arr.length; i++){
    let str = arr[i].toLocaleLowerCase()

    if(line.includes(str)){
      flag = true
      break;
    }

  }

  return flag;
}

class dailyFigure {
  constructor(date="",balance=0, intrest=0 ){
    this.date = moment(date);
    this.balance = balance;
    this.intrest = intrest
  }
}


exports.filterFields = (req, res, next) => {
  const data = req.body.data;
  const fields = req.body.fields;


  result = data.map(r => {
    let obj = {}
    if(!_.isEmpty(r)){
      fields.forEach(field => {
        obj[field] = r[field]
      })
    }
    return obj
  })

  res.json(result);
}

exports.topn = (req, res, next) => {

  // console.log("got a request")
  const n = req.params.count;
  let data = req.body.data;
  const fieldName = req.body.fieldName;
  const fields = req.body.fields;

  data = data.filter(row => !isNaN(row[fieldName]));

  data.sort((a,b) => b[fieldName] - a[fieldName]);

  let result = data.slice(0, n);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}
      
      obj[fieldName] = r[fieldName];

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }

  res.json(result);
}

exports.getTopnSortedByScheme = (req, res, next) => {
  // console.log("getTopnSortedByScheme");
  let data = req.body.data;
  const fieldName = req.body.fieldName;
  const count = parseInt(req.params.count);
  const selectedFieldValues = req.body.selectedFieldValues;
  const fields = req.body.fields;
  const sortBy = req.body.sortBy;
  const type = req.body.type;

  data = data.filter(row => row[fieldName]);

  
  if(_.isArray(selectedFieldValues) && selectedFieldValues.length > 0){
    data = data.filter(row => {
      if(selectedFieldValues.includes(row[fieldName])){
        return true
      }
      return false;
    })
  }

  let dataSet = {}

  data.forEach(row => {
    // allValues.add(row[fieldName])
    let val = row[fieldName];

    if(!dataSet[val]) dataSet[val] = [];

    dataSet[val].push(row)
  });

  // console.log("dataset", dataSet);
  let keys = Object.keys(dataSet);

  let result = []

  // sorting array inside keys with respect to Limit
  if(type == "sorted"){
    keys.forEach(key => {

      dataSet[key] = dataSet[key].filter(row => !isNaN(row[sortBy]));

      if(!_.isEmpty(dataSet[key]) && _.isArray(dataSet[key]) && dataSet[key].length > count){
        dataSet[key] = dataSet[key].sort((a,b) =>  b[sortBy] - a[sortBy]);
        dataSet[key] = dataSet[key].slice(0, count);
      } else if(!_.isEmpty(dataSet[key]) && _.isArray(dataSet[key]) && dataSet[key].length > 1){
        dataSet[key] = dataSet[key].sort((a,b) =>  b[sortBy] - a[sortBy]);
      }

      result.push(...dataSet[key]);

    })
  } else {
    keys.forEach(key => {
      console.log(key , " - length - ", dataSet[key].length);
      if(!_.isEmpty(dataSet[key]) && _.isArray(dataSet[key]) && dataSet[key].length > count){
        let randomNumbers = __generateNRandomNumbers(count, dataSet[key].length);
        randomNumbers.forEach(num => {
          result.push(dataSet[key][num])
        })
      } else if(!_.isEmpty(dataSet[key]) && _.isArray(dataSet[key]) && dataSet[key].length > 0){
        result.push(...dataSet[key])
      }
    })
  }

  result = result.filter(Boolean);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}
      
      obj[fieldName] = r[fieldName];
      obj[sortBy] = r[sortBy];

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }

  res.json(result);
}

exports.filterByField = (req, res, next) => {
  // console.log("***filtering by field");

  // console.log(req.body);

  const fieldName = req.body.fieldName;
  const min = parseInt(req.body.min);
  const max = parseInt(req.body.max);
  const fields = req.body.fields;
  let data = req.body.data;

  data = data.filter(row => !isNaN(row[fieldName]));

  let result = [data];

  result.sort((a,b) => b.LIMIT - a.LIMIT);

  
  if(max){
    // console.log("we have min & max")
    result = result.filter(row => {
      if(row[fieldName] > min && row[fieldName] < max) return true;
      return false;
    })
  } else {
    // console.log("we have min only")
    result = result.filter(row => {
      if(row[fieldName] > min) return true;
      return false;
    })
  }

  result = result.filter(Boolean);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}
      
      obj[fieldName] = r[fieldName];

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }


  res.json(result)
}

exports.getRandom = (req, res, next) => {
  let n = parseInt(req.params.count);
  let data = req.body.data;
  let max = data.length;
  const fields = req.body.fields;

  const nums = new Set();
  while(nums.size !== n) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }

  // console.log("random")
  // console.log([...nums]);

  let result = [];
  nums.forEach(i => {
    result.push({...data[i]})
  })

  result = result.filter(Boolean);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }

  res.json(result);
}

exports.getEveryNthRow = (req, res, next) => {
  const n = parseInt(req.params.count);
  const data = req.body.data;
  const fields = req.body.fields;
  const max = data.length;

  let index = Math.round(max/n);
  let increment = index;
  let result = [];

  while(index < max){
    // console.log('at - ', index)
    result.push(data[index]);
    index += increment;
  }

  result = result.filter(Boolean);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }

  res.json(result);
}

exports.filterByDate = (req, res, next) => {
  let data = req.body.data;
  const startDate = moment(req.body.startDate);
  const endDate = moment(req.body.endDate);
  const fields = req.body.fields;
  const fieldName = req.body.fieldName;

  let result = [];

  data = data.filter(row => row[fieldName]);

  data.forEach(row => {
    let dateVal = moment(row[fieldName]);

    if(dateVal.isValid()){
      if(dateVal.isAfter(startDate) && dateVal.isBefore(endDate)){
        // console.log('passed');
        result.push(row);
      }
    }
  })

  result = result.filter(Boolean);

  if(_.isArray(fields) && !_.isEmpty(fields)){
    result = result.map(r => {
      let obj = {}
      
      obj[fieldName] = r[fieldName];

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }


  res.json(result);
}

exports.postLSOverdrawn = (req, res, next) => {
  // console.log("***Overdrawn lS");

  const fieldName = req.body.fieldName;
  const min = parseInt(req.body.min);
  let data = req.body.data;

  // console.log(fieldName, min);

  // console.log('pre mature data');
  // console.log(data)

  data = data.filter(row => {
    let num = __parseNumbers(row[fieldName])

    // console.log("filtering - ",row[fieldName],  num);

    if(num){
      return true
    } 
    return false;
  });
  
  // console.log('data');
  // console.log(data)

  let result = [...data];

  result.sort((a,b) => b.LIMIT - a.LIMIT);

  result = result.filter(row => {
    let value = __parseNumbers(row[fieldName])
    if(value && value > min) return true;
    return false;
  })

  result = result.filter(Boolean);

  res.json(result)
}

exports.postLSSisterConcern = (req, res, next) => {
  // console.log("***Sister concern complany lS");

  const fieldName = req.body.fieldName;
  const names = req.body.companyNames;
  let data = req.body.data;

  // data = data.filter(row => row[fieldName]);

  // checking if the name is in the field;
  const result = data.filter(row => {
    let value = row[fieldName];

    return __checkArrayStringInLine(names, value);
  })

  res.json(result)
}

exports.quatterlyCredits = (req, res, next) => {

  const data = req.body.data;
  const startingQuatter = moment(req.body.startingQuatter);
  const depositField = req.body.depositField;
  const daysCount = req.body.daysCount;
  const dateField = req.body.dateField;

  if(!startingQuatter.isValid()){
    res.status(400).json({msg: "Invalid date of starting quatter"});
    return;
  }

  if(_.isEmpty(data)){
    res.status(400).json({msg: "Data is empty"});
    return;
  }

  // this is max a user can go without deposit
  const maxDateDiffrence = 90 - daysCount;

  // console.log("data - ", data.length);
  // console.log('de-f', depositField);
  // console.log('q start - ', startingQuatter);
  // console.log('days - ', daysCount) 


  // getting only deposits row
  let filteredRows = data.filter(row => row[depositField] && row[depositField].trim())

  // converting dates from string to date format
  filteredRows = filteredRows.map(row => {
    let dateVal = row[dateField].trim();
    dateVal = moment(dateVal, "DD-MM-YYYY");
    if(dateVal.isValid()) {
      row[dateField] = dateVal;
      return row;
    } else {
      return false;
    }
  }).filter(Boolean);

  if(_.isEmpty(filteredRows)){
    res.status(400).json({msg: "Data is not properly enterd"});
    return;
  }

  let resultTimeline = [];

  filteredRows[0].diff = __getDaysBeetwenDates(startingQuatter, filteredRows[0][dateField])
  if(__getDaysBeetwenDates(startingQuatter, filteredRows[0][dateField]) > maxDateDiffrence){
    filteredRows[0].flag = true;
  } else {
    filteredRows[0].flag = false;
  }

  for(let i=1; i<filteredRows.length; i++){
    let diff = __getDaysBeetwenDates(filteredRows[i][dateField], filteredRows[i-1][dateField])
    filteredRows[i].diff = diff
    if(diff > maxDateDiffrence){
      filteredRows[i].flag = true;
      resultTimeline.push({
        start: filteredRows[i-1][dateField],
        end: filteredRows[i][dateField]
      })
    } 

  }

  console.log("data check - ", data.length);

  const finalResult = {};

  resultTimeline.forEach((timeline, i) => {
    finalResult[i] = [];

    data.forEach(row => {
      let transactionDate = moment(row[dateField], "DD-MM-YYYY");
      // console.log('t date - ', transactionDate, transactionDate.isValid());

      if(transactionDate.isValid()){

        if(
          transactionDate.isSameOrAfter(timeline.start) &&
          transactionDate.isSameOrBefore(timeline.end)
        ){
          finalResult[i].push(row)
        }
      }
    })
  })

  // if(dateField){
  //   filteredRows = filteredRows.map(r => {
  //     let obj = {}
    
  //     obj[dateField] = r[dateField]
  //     obj[depositField] = r[depositField]
  //     obj[dateField] = r[dateField]
  //     obj['flag'] = r['flag']
  //     obj['diff'] = r['diff']
  //     obj['particular'] = r['particular']

  //     return obj
  //   })
  // }
  // console.table(filteredRows);

  // console.log("resultTimeline", resultTimeline)

  // console.log()
  // console.log()
  // console.log()
  // console.log()
  // console.log()
  // console.log()
  // console.log("finl result")
  // console.table(finalResult[0])

  res.json(finalResult)
}

exports.intrestVsCredits = (req, res, next) => {
  const data = req.body.data;
  const depositField = req.body.depositField;
  const particularText = req.body.particularText;
  const particularField = req.body.particularField;
  const dateField = req.body.dateField;
  const withdrawalField = req.body.withdrawalField;

  if(_.isEmpty(data) || !_.isArray(data)){
    res.status(400).json({msg: "Data is empty"});
    return;
  }

  // getting intrest rows
  const intrestRows = data.map((row, index) => {
    let value = row[particularField];

    if(__checkArrayStringInLine([particularText], value)){
      row.index = index;
      row[dateField] = moment(row[dateField], "dd-mm-yyyy");

      if(!row[dateField].isValid()){
        return false;
      }

      row[withdrawalField] = __parseNumbers(row[withdrawalField]) || 0;
      row._balance = row[withdrawalField]
      return row;
    } else {
      return false
    }
  }).filter(Boolean)

  console.log("Intrests table")
  console.table(intrestRows);

  //
  let depositRowsData = data.map(row => {
    if(__parseNumbers(row[depositField])){
      row[dateField] = moment(row[dateField], "dd-mm-yyyy");

      if(!row[dateField].isValid()){
        return false;
      }

      row[depositField] = __parseNumbers(row[depositField]);
      return row
    }
    return false
  }).filter(Boolean);

  // console.log("deposit table")
  // console.table(depositRowsData);
  
  let intrestTraversalIndex = 0;

  depositRowsData.forEach(row => {
    const intrestRow = intrestRows[intrestTraversalIndex];

    if(intrestRow){

      console.log(intrestRow[dateField])
      console.log(row[dateField])
  
      if(intrestRow[dateField].diff(row[dateField], "month") > 3){
        intrestRow.flag = false
      }
  
      if(intrestRow && intrestRow[dateField].isSameOrBefore(row[dateField])){
  
        if(intrestRow[withdrawalField] > row[depositField]){
          intrestRow._balance -=row[depositField]
        } else {
          let rem = row[depositField] - intrestRow._balance
          intrestRow._balance = 0
          const nextIntrestRow = intrestRows[intrestTraversalIndex+1];
          if(nextIntrestRow){
            if(nextIntrestRow[dateField].diff(row[dateField], "month") > 3){
              nextIntrestRow.flag = false
            }
  
            if(nextIntrestRow[dateField].isSameOrBefore(row[dateField])){
              nextIntrestRow._balance -=rem
            }
          }
  
          intrestTraversalIndex++;
        }
      }
    }


  })

  intrestRows.forEach(row => {
    row.flag = row.flag === false ? "failed" : "paidOnTime";
  })

  console.log("Intrests table")
  console.table(intrestRows);

  res.json(intrestRows);
}

exports.quatterlySaperation = (req, res, next) => {
  const fieldName = req.body.fieldName;
  const fields = req.body.fields;
  const data = req.body.data;
  const startingQuatter = req.body.startingQuatter;
  const depositField = req.body.depositField;

  console.log("Quatterly saperations");
  console.log(fieldName);
  console.log(fields);
  console.log(startingQuatter);

  const quatter1Start = moment(startingQuatter).startOf('quarter');
  const quatter1End = moment(quatter1Start).add(2, "months").endOf('month');

  const quatter2Start = moment(quatter1End).add(1, 'day').startOf('day');
  const quatter2End = moment(quatter2Start).add(2, 'months').endOf('month');

  const quatter3Start = moment(quatter2End).add(1, 'day').startOf('day');
  const quatter3End = moment(quatter3Start).add(2, 'months').endOf('month');

  const quatter4Start = moment(quatter3End).add(1, 'day').startOf('day');
  const quatter4End = moment(quatter4Start).add(2, 'months').endOf('month');

  
  // console.log("1st - ", quatter1Start.toDate(), quatter1End.toDate());
  // console.log("2nd - ", quatter2Start.toDate(), quatter2End.toDate());
  // console.log("3rd - ", quatter3Start.toDate(), quatter3End.toDate());
  // console.log("4th - ", quatter4Start.toDate(), quatter4End.toDate());


  // res.json({mas: 'ok',
  //     quatter1Start: quatter1Start.toDate(),
  //     quatter1End: quatter1End.toDate(),
  //     quatter2Start: quatter2Start.toDate(),
  //     quatter2End: quatter2End.toDate(),
  //     quatter3Start: quatter3Start.toDate(),
  //     quatter3End: quatter3End.toDate(),
  //     quatter4Start: quatter4Start.toDate(),
  //     quatter4End: quatter4End.toDate(),
  // });



  let filteredData = data.filter(row => {
    let date = moment(row[fieldName], "DD-MM-YYYY");
    if(row[fieldName] && date.isValid()) return true;
    return false;
  })

  filteredData = filteredData.filter(row => {
    if(row[depositField]) return true;
    return false;
  })

  if(_.isArray(fields) && !_.isEmpty(fields)){
    filteredData = filteredData.map(r => {
      let obj = {}
      
      obj[fieldName] = r[fieldName];

      fields.forEach(field => {
        obj[field] = r[field]
      })

      return obj
    })
  }

  const q1Data = []
  const q2Data = []
  const q3Data = []
  const q4Data = []
  const noneData = []

  filteredData.forEach(row => {
    const date = moment(row[fieldName], "DD-MM-YYYY")

    if(quatter1Start.isBefore(date) && quatter1End.isAfter(date)){
      q1Data.push(row)
    } else if(quatter2Start.isBefore(date) && quatter2End.isAfter(date)){
      q2Data.push(row)
    } else if(quatter3Start.isBefore(date) && quatter3End.isAfter(date)){
      q3Data.push(row)
    } else if(quatter4Start.isBefore(date) && quatter4End.isAfter(date)){
      q4Data.push(row)
    } else {
      noneData.push(row);
    }

  })

  res.json({
    q1Data: q1Data,
    q2Data: q2Data,
    q3Data: q3Data,
    q4Data: q4Data,
  })
}

exports.verifyIntrest = (req, res, next) => {
  const data = req.body.data;
  const depositField = req.body.depositField;
  const particularText = req.body.particularText;
  const particularField = req.body.particularField;
  const dateField = req.body.dateField;
  const withdrawalField = req.body.withdrawalField;
  const balanceField = req.body.balanceField;
  const startingQuatter = req.body.startingQuatter;
  const intrestRate = req.body.intrestRate;
  
  console.log("verifying intrests")

  if(_.isEmpty(data) || !_.isArray(data)){
    res.status(400).json({msg: "Data is empty"});
    return;
  }

  if(_.isEmpty(startingQuatter) && !_isDate(startingQuatter) ){
    res.status(400).json({msg: "Date is invalid"});
    return;
  }

  const startingDay = moment(startingQuatter);

  // getting intrest rows
  const intrestRows = data.map((row, index) => {
    let value = row[particularField];

    if(__checkArrayStringInLine([particularText], value)){
      row.index = index;
      row[dateField] = moment(row[dateField], "dd-mm-yyyy");

      if(!row[dateField].isValid()){
        return false;
      }

      row[withdrawalField] = __parseNumbers(row[withdrawalField]) || 0;
      return row;
    } else {
      return false
    }
  }).filter(Boolean)

  // transforming data
  const transformedData = data.map(row => {
    row[dateField] = moment(row[dateField], "dd-mm-yyyy");

    if(!row[dateField].isValid()){
      return false;
    }

    let deposit = row[depositField]
    if(deposit && isNaN(deposit) && deposit.trim()){
      deposit = __parseNumbers(deposit);
      if(!deposit){
        return false
      }
      row[depositField] = deposit
    } else if(deposit && !isNaN(deposit)){
      row[depositField] = __ParseString(deposit)
    } 

    let withdrawal = row[withdrawalField]
    console.log('withdrawal - ', withdrawal);
    if(withdrawal && isNaN(withdrawal) && withdrawal.trim()){
      withdrawal = __parseNumbers(withdrawal);
      if(!withdrawal){
        return false
      }
      row[withdrawalField] = withdrawal
    } else if(withdrawal && !isNaN(withdrawal)){
      row[withdrawalField] = __ParseString(withdrawal)
    } 

    let balance = row[balanceField]
    if(balance && isNaN(balance) && balance.trim()){
      balance = __parseNumbers(balance);
      if(!balance){
        return false
      }
      row[balanceField] = balance
    }else if(balance && !isNaN(balance)){
      row[balanceField] = __ParseString(balance)
    } 

    return row
  }).filter(Boolean)

  console.table(transformedData);

  let dailyChart = []

  for(let i=0; i<365; i++){
    let date = startingDay.add(1, "day");

    let daily = new dailyFigure(date);
    dailyChart.push(daily);
  }



  // console.table(dailyChart);

  console.table(intrestRows);
  res.json({msg: "WORKING"});
}