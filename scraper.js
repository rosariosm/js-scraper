const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.lanacion.com.ar/';
const fs = require('fs');

const resources = {};
var dependencies = []


const total_length = (e, page) => {
  return totalUncompressedBytes = Object.values(resources).reduce((a, n) => a + n, 0);
}

const build_dependencies = (html) => {
}

const frequency = (html) => {
}

const write_results = () => {
}




puppeteer.launch().then(async browser => {
  const page = await browser.newPage();

  page._client.on('Network.dataReceived', (event) => {
    const request = page._networkManager._requestIdToRequest.get(event.requestId);
	if (request && request.url().startsWith('data:')) {
	  return;
	}
	const url = request.url();
	const length = event.dataLength;
	if (url in resources) {
	  resources[url] += length;
	}
	else {
	  resources[url] = length;
	}
  });

  await page.goto(url);
  html = await page.content();

  await browser.close();
});