const express = require('express');

const { 
  filterFields,
  topn,
  getTopnSortedByScheme,
  filterByField,
  getRandom,
  getEveryNthRow,
  filterByDate,
  postLSOverdrawn,
  postLSSisterConcern,
  quatterlySaperation,
  intrestVsCredits,
  quatterlyCredits,
  verifyIntrest
} =  require('./controller');

const router = express.Router();

router.post('/filter-fields', filterFields);

router.post('/top/:count', topn);

router.post('/scheme-sampling/:count', getTopnSortedByScheme);

router.post('/filterbyfield', filterByField);

router.post('/getRandon/:count', getRandom);

router.post('/getNthRow/:count', getEveryNthRow);

router.post('/filterbydate', filterByDate);

router.post("/ledgerScrutney/overdrawn", postLSOverdrawn);

router.post("/ledgerScrutney/sister-companies", postLSSisterConcern);

router.post("/ledgerScrutney/quatterlyCredits", quatterlyCredits);

router.post("/ledgerScrutney/intrestVsCredit", intrestVsCredits);

router.post("/ledgerScrutney/quatterlysaperation", quatterlySaperation);

router.post("/ledgerScrutney/intrestVerification", verifyIntrest);

module.exports = router;