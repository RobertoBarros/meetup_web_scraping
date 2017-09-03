const scrapeIt = require("scrape-it");
const fs = require("fs");

scrapeIt("http://www.imdb.com/name/nm0000115/", {
  movies: {
    listItem: "[id^=actor-]",
    data: {
      url: {
        selector: 'a:first-child',
        attr: 'href'
      }
    }
  }
})
.then( page => {
  urls = page.movies.map( movie => 'http://www.imdb.com' + movie.url)

  Promise.all(urls.slice(0,100).map( url => getPage(url) ))
    .then(result => {
      fs.writeFile('./data.json', JSON.stringify(result, null, 2) , 'utf-8', (err) => {
        if (err) throw err;
        console.log('Arquivo salvo');
      });
    })

})
.catch( err => console.log(err));

var getPage = url => {
  console.log(`iniciou ${url}`)

  return scrapeIt(url, {
    title: "div.title_wrapper h1"
    , summary: "div.summary_text"
    , rating: "[itemprop=ratingValue]"
  })
  .then(page => {
    console.log(`Terminou ${url}`)
    return page
  })
  .catch( err => console.log(err));
}
