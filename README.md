Dependency Analyzer
==========

This scraper gets a list of websites from a file (websites.csv) and analyze its data in order to get their js dependencies, the total length in bytes and the occurrences of each js dependency. The html content of these websites can be read from local files or from its original source.

It was built in [NodeJS](https://nodejs.org/es/), and using libraries like [puppeteer](https://github.com/GoogleChrome/puppeteer) that provides an API to navigate a website in a headless browser context; [cheerio](https://github.com/cheeriojs/cheerio) to manipulate the html content in a jQuery-way; and [csv](https://csv.js.org/) to manipulate csv files.

Dependencies
------------

To run this scraper, you need a version of node >=  10.15.2 . To install it, see [NodeJS](https://nodejs.org/es/)

If you currently have another version of node installed in your computer, you can use the [Node Version Manager](https://github.com/creationix/nvm) which lets you manage different versions of node.js for different projects.


Installation
------------

Install with `npm`:

``` bash
$ npm install
```

Usage
------------

To launch this scraper:

``` bash
$ npm start
```

This is going to read from the .csv file, analyze each website provided and generate three files with the results: `dependencies.csv`, `lengths.csv` and `occurences.csv`