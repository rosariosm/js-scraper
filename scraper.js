const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.lanacion.com.ar/';
const fs = require('fs');

const resources = {};
const dependencies_freq = {};
var dependencies = []


const total_length = (e, page) => {
  return totalUncompressedBytes = Object.values(resources).reduce((a, n) => a + n, 0);
}

const build_dependencies = (html) => {
  $('script[src]', html).each(function() {
    $(this).attr('src').split('/').forEach(item => {
      if (item.includes('.js')) {
      	dependency = item.replace(/\?.*$/, "")
        dependencies.push(dependency)

        if (dependency in dependencies_freq) {
          dependencies_freq[dependency] += 1
        }
        else {
          dependencies_freq[dependency] = 1
        }
      }
    })
  });
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
  build_dependencies(html);

  await browser.close();
});