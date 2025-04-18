import React, { useEffect, useState } from "react";
import DataLoadingCompo from "../../components/common/DataLoadingCompo";
import "./css/NewsPage.css";

const NewsPage = () => {
  const [Jobs, setJobs] = useState([]);

  const fetchData = () => {
    fetch(
      "https://newsapi.org/v2/everything?q=apple&apiKey=b06331be019b4d71b76b9795d6a30fe9&pageSize=50"
    )
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          data = data.articles.filter((data) => data.urlToImage);
          setJobs(data);
        }, 2000);
      })
      .catch((error) => console.error("Error fetching job data:", error));
  };
  useEffect(() => {
    // Fetch job data from the AP
    fetchData();
  }, []);

  console.log(Jobs);

  return (
    <section className="recentNews">
      <div className="container my-5">
        <h2 className="font-500 text-22 flex-shrink-0 md:text-24 lg:text-28 text-textPrimary">
          News Page
        </h2>{" "}
        {(Jobs === undefined || Jobs?.length === 0) && <DataLoadingCompo />}
        {Jobs?.length > 0 && (
          <div class="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
            {Jobs.filter((item) => item.urlToImage !== null).map(
              (article, index) => (
                <div class="ct-blog" key={index}>
                  <div class="inner !bg-backgroundv2">
                    <div class="fauxcrop">
                      {/* <img alt="News Entry" src="../../assets/images/about/businessman-pointing.jpg" /> */}
                      <img
                        alt="News Entry"
                        src={article.urlToImage}
                        onError={(e) => {
                          e.target.src =
                            "https://i.pinimg.com/originals/83/ed/5e/83ed5edc241c05f8b8510945e86a425d.jpg";
                        }}
                      />
                    </div>
                    <div class="ct-blog-content !bg-backgroundv2">
                      <div class="ct-blog-date !text-textPrimary">
                        <span>{new Date(article.publishedAt).getDate()}</span>
                        <strong>
                          {new Date(article.publishedAt).toLocaleString(
                            "default",
                            {
                              month: "long",
                            }
                          )}
                        </strong>
                      </div>
                      <div class="ct-blog-header  !text-textPrimary">
                        {article.title}
                        <p class="ct-blog-description  !text-textPrimary">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPage;
