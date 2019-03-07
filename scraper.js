const puppeteer = require('puppeteer');
const $ = require('cheerio');
const fs = require('fs');
const parser = require('csv-parse');
const stringify = require('csv-stringify');

const lengths = [];
const dependencies_freq = [];
const dependencies = []
const urls = []


const calculateOccurrence = (dependency) => {
  let i = dependencies_freq.findIndex((item) => {
    return item.dependency === dependency
  })

  if (i != -1) {
    dependencies_freq[i].frequency += 1;
  }
  else {
    dependencies_freq.push({dependency: dependency, frequency: 1});
  }
}



const buildDependencies = ( name, html ) => {
  $('script[src]', html).each(function() {
    $(this).attr('src').split('/').forEach(item => {
      if (item.includes('.js')) {
      	dependency = item.replace(/\?.*$/, "")
        dependencies.push({name: name, dependency: dependency})

        calculateOccurrence(dependency)
      }
    })
  });
}

const writeResults = () => {
  writeData('lengths.csv', {name: 'name',length: 'length'}, lengths)
  writeData('dependencies.csv', {name: 'name',dependency: 'dependency'}, dependencies)
  writeData('occurences.csv', {dependency: 'name',frequency: 'frequency'}, dependencies_freq)
}

const writeData = (filename, columns, data) => {
  stringify(data, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
    });
  });
}


const handleReceivedData = ( page, name ) => ( event ) => {
  const request = page._networkManager._requestIdToRequest.get(event.requestId)

  if (request && request.url().startsWith('data:')) {
    return;
  }
  const length = event.dataLength;

  let i = lengths.findIndex((item) => {
    return item.name === name
  })

  if (i != -1) {
    lengths[i].length += length;
  }
  else {
    lengths.push({name: name, length: length});
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


fs.createReadStream('urls.csv')
  .pipe(parser())
  .on('data', function(data){
      try {
        if (data[1].startsWith('~/')){
          let path = data[1].split('~')[1];
          urls.push({name: data[0], url: `file:${__dirname}${path}`})
        }
        else
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
      console.error('Empty file')
  });