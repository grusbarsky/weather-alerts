import React, { useState, useEffect, useContext } from "react";
import SearchForm from "../search/SearchForm";
import WeatherAlertApi from "../api";
import ArticleCard from "./ArticleCard";
import UserContext from "../auth/UserContext";
import './articles.css';


// Shows all article and a form
// on form submit, filter articles

function ArticleList(props) {

  const { currentUser } = useContext(UserContext);
  const [articles, setArticles] = useState(null);

  useEffect(function getArticlesOnMount() {
    search();
  }, []);

  async function search(keyword) {
    let articles = null;
    if(!keyword){
      articles = await WeatherAlertApi.getAllArticles();
    }else{
      articles = await WeatherAlertApi.getSearchedArticles(keyword);
    }
    
    setArticles(articles);
  }

  function saved(url) {
    const savedArticles = currentUser.articles;
    const set = new Set();
    // create a set that has every savedArticleUrl
    savedArticles.forEach(obj => {
      let val = obj.articleUrl;
      set.add(val);
    });
    return set.has(url);
  }

  if (!articles) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="ArticleList">
      <SearchForm searchFor={search} />
      {articles.length
        ? (
          <div className="ArticleList-list">
            {articles.map(a => (
              <ArticleCard
                data={{
                  article: {
                    title: a.title,
                    articleUrl: a.url,
                    imageUrl: a.urlToImage,
                    datePublished: a.publishedAt,
                    source: a.source.name,
                    description: a.description
                  }
                }}
                saved={saved(a.url)}
                width = {props.width}
              />
            ))}
          </div>
        ) : (
          <h4 className="text-center mt-5">Sorry, no results match your search!</h4>
        )}
    </div>
  );
}

export default ArticleList;
