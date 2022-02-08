import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import WeatherAlertApi from "../api";
import SendArticle from "./SendArticle";
import './articles.css';


// article snapshot


function ArticleCard(props) {

  let { title, articleUrl, imageUrl, datePublished, source, description } = props.data.article;


  const { currentUser } = useContext(UserContext);
  const [save, setSave] = useState(props.saved);



  async function getId() {
    const savedArticle = currentUser.articles.find(e => e.articleUrl === articleUrl);
    return savedArticle.id;
  }

  async function handleToggleSave(evt) {
    try {
      save ? await WeatherAlertApi.deleteArticle(currentUser.username, await getId())
        : await WeatherAlertApi.saveArticle(currentUser.username, props.data);
      setSave(!save);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={`ArticleCard card mx-auto my-3 shadow-sm ${props.width}`}>
      <a href={articleUrl} target="_blank" rel="noreferrer noopener" className='article-link link-dark text-decoration-none'>
        <div className="card-body">
          <h5 className="card-title font-weight-bold text-left">{title}</h5>
          <p className='blockquote-footer source'>From the {source}    {datePublished}</p>
          <p className='description'>{description}</p>
          <img src={imageUrl} className="rounded img-fluid" />
        </div>
      </a>
      <div className="btn-group">
        <button
          className="btn btn-primary btn-small card-btn"
          onClick={handleToggleSave}
        >
          {save ? "Delete" : "Save"}
        </button>
        <SendArticle url={articleUrl} />
      </div>
    </div>
  );
}

export default ArticleCard;