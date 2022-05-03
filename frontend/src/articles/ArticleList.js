import React, { useState, useEffect, useContext } from "react";
import LoadingOverlay from 'react-loading-overlay';
import SearchForm from "../search/SearchForm";
import WeatherAlertApi from "../api";
import ArticleCard from "./ArticleCard";
import UserContext from "../auth/UserContext";
import { changeDateFormat } from "../helpers";
import './articles.css';


// Shows list of articles and a search form
// search form supports real time search

function ArticleList({width}) {

  const { currentUser } = useContext(UserContext);
  const [articles, setArticles] = useState(null);

  useEffect(function getArticlesOnMount() {
    onSearchSubmit();
  }, []);

  async function onSearchSubmit(keyword) {
    let articles = null;
    // if no search has been made, get all articles from api
    if (!keyword) {
      articles = await WeatherAlertApi.getAllArticles();
    // otherwise, get articles by keyword
    } else {
      articles = await WeatherAlertApi.getSearchedArticles(keyword);
    }
    setArticles(articles);
  };

  // called by SearchForm
  // if searchTerm becomes '', call onSearchSubmit and set articles
  function clearResults(){
    onSearchSubmit();
  };

  // check if a article is saved
  function saved(url) {
    // get a use4rs articles
    const savedArticles = currentUser.articles;
    const set = new Set();
    // create a set that has every savedArticles url
    savedArticles.forEach(obj => {
      let val = obj.articleUrl;
      set.add(val);
    });
    // check if the url is contained in users articles
    return set.has(url);
  };

  if (!articles) return (
    <div className='p-5'>
      <div className='m-5 p-5'>
        <LoadingOverlay
          active
          spinner={true}
          text='Loading...'
          styles={{
            spinner: (base) => ({
              ...base,
              width: '7rem',
              '& svg circle': {
                stroke: 'black'
              }
            })
          }}
        >
        </LoadingOverlay>
      </div>
    </div>
  );

  return (
    <div className="ArticleList">
      <SearchForm onSearchSubmit={onSearchSubmit} clearResults={clearResults} />
      {articles.length
        ? (
          <div className="ArticleList-list">
            {articles.map((a, index)=> (
              <ArticleCard
                data={{
                  article: {
                    title: a.title,
                    articleUrl: a.url,
                    imageUrl: a.urlToImage,
                    datePublished: changeDateFormat(a.publishedAt),
                    source: a.source.name,
                    description: a.description
                  }
                }}
                saved={saved(a.url)}
                width={width}
                key={index}
              />
            ))}
          </div>
        ) : (
          <h4 className="text-center mt-5 mb-3">Sorry, no results match your search!</h4>
        )}
    </div>
  );
}

export default ArticleList;
