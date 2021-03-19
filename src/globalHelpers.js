const fs = require("fs");
const { nest } = require("d3-collection");
const { data } = require("./data");

// Create a d3 Object with a subset of functions
const d3 = Object.assign(
  {},
  {
    nest,
  }
);

const getNestedCategories = (articles) => {
  let nestedData = d3
    .nest()
    .key((d) => d.menu_item)
    .entries(articles);

  return nestedData.sort((a, b) => ("" + a.key).localeCompare(b.key));
};

let nestedArticles = getNestedCategories(data.articles);

const getIndividualArticles = (articles) => {
  const convert = (arr, keyName) =>
    arr.reduce((a, item) => {
      a[item[keyName]] = item;
      return a;
    }, {});

  let individualData = convert(articles, "name");

  return individualData;
};

const getOrderedArticles = (articles) => {
  return articles.sort((a, b) =>
    +a.timestamp < +b.timestamp
      ? 1
      : +a.timestamp === +b.timestamp
      ? +a.size < +b.size
        ? 1
        : -1
      : -1
  );
};

let individualArticles = getIndividualArticles(data.articles);
let orderedArticles = getOrderedArticles(data.articles);

exports.helpers = {
  dump: (obj) => JSON.stringify(obj, null, 2),
  globals: {
    siteName: `Dataviz România`,
    icon: (name) => fs.readFileSync(`./src/icons/${name}.svg`),
    menu: data.menu,
    myTitle: data.title,
    myLogoTitle: data["logo-title"],
    fontsList: data.fontsList,
    radioList1: data.radioList1,
    radioList2: data.radioList2,
    nestedArticles: nestedArticles,
    articles: orderedArticles,
  },
};
