const puppeteer = require('puppeteer');
const $ = require('cheerio');
const fs = require('fs');
const parser = require('csv-parse');

const lengths = {};
const dependencies_freq = {};
var dependencies = []


const buildDependencies = ( name, html ) => {
  let result = []
  $('script[src]', html).each(function() {
    $(this).attr('src').split('/').forEach(item => {
      if (item.includes('.js')) {
      	dependency = item.replace(/\?.*$/, "")
        result.push(dependency)

        if (dependency in dependencies_freq) {
          dependencies_freq[dependency] += 1
        }
        else {
          dependencies_freq[dependency] = 1
        }
      }
    })
  });
  dependencies.push({[name]: result})
}

const writeResults = () => {
  console.log(lengths)
}

const handleReceivedData = ( page, name ) => ( event ) => {
  const request = page._networkManager._requestIdToRequest.get(event.requestId)

  if (request && request.url().startsWith('data:')) {
    return;
  }
  const length = event.dataLength;
  if (name in lengths) {
    lengths[name] += length;
  }
  else {
    lengths[[name]] = length;
  }
}


const launchBrowser = async () => {
  puppeteer.launch().then(async browser => {
    const promises=[];
    for(let i = 0; i < urls.length; i++){
      promises.push(browser.newPage().then(async page => {
        try {
          page._client.on('Network.dataReceived', handleReceivedData(page, urls[i].name))
          await page.goto(urls[i].url);
          html = await page.content();
          buildDependencies(urls[i].name,html);
        }
        catch(err) {
          console.error(err.message)
        }

      }))
    }
    await Promise.all(promises)
    await browser.close();
    writeResults()
  });
}


var urls = []

fs.createReadStream('urls.csv')
  .pipe(parser())
  .on('data', function(data){
      try {
        urls.push({name: data[0], url: data[1]})
      }
      catch(err) {
        console.error(err.message)
      }
  })
  .on('error', (err) =>{
     console.error(err.message)
  })
  .on('end', () => {
    if (urls.length > 0){
      launchBrowser()
    }
    else
      console.error('El archivo no tiene datos')
  });