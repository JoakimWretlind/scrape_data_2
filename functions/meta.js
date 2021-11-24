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
    // find the title of the page
    const title = await page.title();
    // find the meta-description
    const description = await page.$eval('meta[name="description"]', element => element.content);


    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'Ok',
            // display the title and meta-description of the page
            page: {
                title,
                description
            }
        })
    };
}