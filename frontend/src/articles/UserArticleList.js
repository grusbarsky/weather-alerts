import React, { useState, useEffect, useContext } from "react";
import ArticleCard from "./ArticleCard";
import UserContext from "../auth/UserContext";

// shows a list of a users saved articles


function UserArticleList(props) {

  const {currentUser} = useContext(UserContext);
  const [articles, setArticles] = useState(null);
  const [saved, setSaved] = useState(true)

  useEffect(function getArticlesOnMount() {
    getArticles();
  }, []);

  async function getArticles() {
    let articles = await currentUser.articles;
    setArticles(articles);
  }


  if (!articles) return <h3 className="text-center mt-5" >Loading...</h3>;

  return (
      <div className="ArticleList">
        {articles.length
            ? (
                <div className="ArticleList-list">
                  {articles.map(a => (
                      <ArticleCard
                          data={{
                            article: {
                              title: a.title,
                              articleUrl: a.articleUrl,
                              imageUrl: a.imageUrl,
                              source: a.sourceName,
                              description: a.description,
                              datePublished: a.datePublished
                            }
                          }}
                          saved = { saved ? true : false}
                          width = {props.width}
                      />
                  ))}
                </div>
            ) : (
                <h4 className="text-center mt-5">You have no articles saved!</h4>
            )}
      </div>
  );
}

export default UserArticleList;
