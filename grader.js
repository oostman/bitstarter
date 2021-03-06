#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";0

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(inUrl) {
    var instr = inUrl.toString();
    // rest.get(instr).
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtml = function(htmlSource) {
    return cheerio.load(htmlSource);
};

var loadChecks = function(checksFile) {
    return JSON.parse( fileSource(checksFile) );
};

var checkHtml = function(htmlsource, checksfile) {
    $ = cheerioHtml(htmlsource);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var fileSource = function(file) {
    return fs.readFileSync(file)
};

var gradeHtmlFromUrl = function(url, checks) {
    rest.get( url.toString() ).on('complete', function(result, response) {
	if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            //console.error("Wrote %s", result);
	    gradeHtml(result, checks);
        }
    })
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var gradeHtml = function(source, checks) {
    var checkJson = checkHtml(source, checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html')
    	.option('-u --url <html_url>', 'Url to index.html')
        .parse(process.argv);

    if(program.file) {
	var file = clone(assertFileExists)(program.file);
	gradeHtml( fileSource( file ), program.checks );
	
    } if(program.url) {
	source = gradeHtmlFromUrl( program.url, program.checks );
    }

} else {
    
exports.checkHtmlFile = checkHtmlFile;
}
