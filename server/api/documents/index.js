const express = require('express');
const path = require('path');

const pdf = require('html-pdf');
const pdfTemplate = require('../../assets/templates/Lfar');

const { 
  createPdf,
  getPdf
} =  require('./controller');

const router = express.Router();

// router.post('/dawnloadpdf', createPdf);

router.post('/create-pdf', createPdf);

router.get('/fetch-pdf', getPdf);

module.exports = router;