const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.lanacion.com.ar/';
const fs = require('fs');

const length = (html) => {
}

const build_dependencies = () => {
}

const frequency = (html) => {
}

const write_results = () => {
}




puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto(url);
  html = await page.content();

  await browser.close();
});