const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core')

// serverless function
exports.handler = async function (event, context) {

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true
    });

    const page = await browser.newPage();

    // Find the page we want to scrape
    await page.goto('https://spacejelly.dev/');

    // get the input field
    await page.focus('#search-query')
    // let us type the word api in the input field
    await page.keyboard.type('api');

    // get the found list-items based on our search
    // $$ -> quering ALL elements with this selector
    const results = await page.$$eval('#search-query + div a', (links) => {
        return links.map(link => {
            return {
                text: link.innerText,
                href: link.href
            }
        });
    });

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'Ok',
            results
        })
    };
}

/**
 * run:
 * netlify dev
 * localhost:8888/.netlify/functions/meta
 * localhost:8888/.netlify/functions/results
 */