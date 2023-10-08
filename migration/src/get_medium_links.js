const puppeteer = require('puppeteer');

exports['getMediumLinks'] = async (username) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const mediumProfileURL = `https://medium.com/@${username}`;

  await page.goto(mediumProfileURL, { waitUntil: 'domcontentloaded' });

  const uniqueLinks = {} 

  // Scroll to the bottom of the page to load all content
  await autoScroll(page);

  // Find anchor tags with the specified class
  const links = await page.evaluate(() => {
    const selector = "a.af.ag.ah.ai.aj.ak.al.am.an.ao.ap.aq.ar.as.at";
    const anchorTags = document.querySelectorAll(selector);
    const hrefs = [];
    anchorTags.forEach((tag) => {
      hrefs.push(tag.href);
    });
    return hrefs;
  });

  const tagRegex = /https:\/\/medium\.com\/tag\/([^?/]+)/;
  let lastAddedArticle;
  // Remove query parameters and store unique links
	links.forEach((fullLink) => {
		let link = new URL(fullLink);
		link.search = '';
		link = link.toString();
		let tagMatch = link.match(tagRegex);
		if (tagMatch) {
			if (lastAddedArticle) {
				uniqueLinks[lastAddedArticle] = uniqueLinks[lastAddedArticle] || {};
				uniqueLinks[lastAddedArticle].tags = new Set([...(uniqueLinks[lastAddedArticle]?.tags || []), tagMatch[1]]);
			}
			return;
		}
		if (!link.startsWith(`https://${username}.medium.com`)) {
			return;
		}

		uniqueLinks[link] = uniqueLinks[link] || {};
		lastAddedArticle = link;
	});

	// Close the browser
	await browser.close();

	// Output the unique links without query parameters
	// let i = 1;
	// Object.entries(uniqueLinks).forEach(([key, value]) => {
	// 	console.log(`${i} Key: ${key}, Value: ${Array.from( value.tags || [] )}`);
	// 	i +=1;
	// });
	// console.log(Object.keys(uniqueLinks).length);

	Object.keys(uniqueLinks).forEach(key => {
		uniqueLinks[key].tags = Array.from(uniqueLinks[key].tags || []);
	});
	return uniqueLinks;
};

// Function to scroll to the bottom of the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const interval = 100;

      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  });
}
