import ArticleList from "../articles/ArticleList";
import UserArticleList from "../articles/UserArticleList";
import LocationList from "../locations/LocationList";
import AlertList from "../alerts/AlertList";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";



function Dashboard() {
    const { currentUser } = useContext(UserContext);
    return (
        <div className="container">
            {/* if no currentUser, display login/signup homepage */}
            {!currentUser
                ? (
                    <div className="homepage p-5 m-5">
                    <div className="container text-center pt-5 mt-5">
                        <div className="card m-auto shadow-lg py-5 w-50">
                            <div className="card-body h-100 py-5">
                                <h1 id='brand'>Weather Alerts</h1>
                                <div className='mt-5'>
                                    <Link className="btn btn-primary m-2"
                                        to="/login">
                                        Log in
                                    </Link>
                                    <Link className="btn btn-primary m-2"
                                        to="/signup">
                                        Sign up
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                    </div>

                ) :
                // if currentUser exists, display dashboard
                <div className="homepage">
                <div className="container text-center">
                    <div className='dashboard container'>
                        <h1 id='brand'>Weather Alerts</h1>
                        <div className='row'>
                            <div className='right col'>
                                <div className='my-locations card shadow my-3'>
                                    <h4 className='mt-4'>My Locations</h4>
                                    <LocationList width='w-75'/>
                                </div>
                                <div className='my-alerts card shadow my-3'>
                                    <h4 className='mt-4'>My Alerts</h4>
                                    <AlertList width='w-75' />
                                </div>
                                <div className='my-articles card shadow my-3'>
                                    <h4 className='mt-4'>My Articles</h4>
                                    <UserArticleList width='w-75' />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='articles left card shadow my-3 mh-25'>
                                    <h4 className='mt-4'>News</h4>
                                    <ArticleList width='w-75' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            }

        </div>
    )
}

export default Dashboard;