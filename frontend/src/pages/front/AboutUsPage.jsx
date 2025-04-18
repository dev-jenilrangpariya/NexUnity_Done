import React from "react";
import about3 from "../../assets/images/about/businessman-pointing.jpg";
import about1 from "../../assets/images/about/close-up-people-working-as-team.jpg";
import about4 from "../../assets/images/about/friendly-caucasian-afro-american-business-people-shaking-hands.jpg";
import about2 from "../../assets/images/about/pexels-fauxels-3228689.jpg";
import about5 from "../../assets/images/about/team-unity-friends-meeting-partnership-concept.jpg";
import "./css/About.css";

const AboutUsPage = () => {
  return (
    <div className="wrapper about !bg-backgroundv2 !text-textPrimary">
      <h1 className="!text-textPrimary"> Why Choose us ? </h1>
      <p className="about-header">
        At NexUnity, we believe in the power of connection and collaboration.
        Our platform was born out of a shared vision to create a space where
        individuals can come together, share experiences, and support one
        another in their journeys. Whether you're seeking inspiration,
        knowledge, or simply a sense of belonging, you'll find it here.
      </p>
      <div className="cols">
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front "
              style={{ backgroundImage: `url(${about1})` }}
            >
              <div className="inner">
                <p> Our mission </p>
                <span>we believe in the power of connection </span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  {/* Fostering an inclusive community where everyone's voice is
                  heard and respected,*/}
                  we aim to create a space for growth and empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about2})` }}
            >
              <div className="inner">
                <p> What We Offer </p>
                <span>share experiences , and supports</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  Engaging Articles, forums, and discussions covering
                  {/* Engaging Content: Articles, forums, and discussions covering
                  diverse topics.  */}
                  {/* Resource Hub: Access tools and guides for
                  personal and professional developmen */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about3})` }}
            >
              <div className="inner">
                <p>Our Team</p>
                <span>shared vision to create a space</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  A dedicated group passionate about nurturing our community
                  {/* and
                  ensuring a welcoming space for all. */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about4})` }}
            >
              <div className="inner">
                <p> Privacy and Security </p>
                <span> Our platform was born out of a shared</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  Assure members of your commitment to protecting their privacy
                  {/* and maintaining a secure platform for interaction and
                  engagement. */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about5})` }}
            >
              <div className="inner">
                <p>Future Goals</p>
                <span>Source of Knowdlege</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  Discuss the future direction and goals of the community,
                  inviting members
                  {/* to join in shaping its growth and
                  development. */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about4})` }}
            >
              <div className="inner">
                <p>Social Media Integration</p>
                <span>you're seeking inspiration,</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  Connect with us on social media to stay updated
                  {/* on the latest
                  community news, events, and discussions.{" "} */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about1})` }}
            >
              <div className="inner">
                <p>Community Groups </p>
                <span>Source of  knowledge</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  {/* Join our Facebook groups, follow our Twitter accounts, and
                  connect with us 
                  on other social media platforms to access */}
                  exclusive content, engage with other members in community
                  events.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about3})` }}
            >
              <div className="inner">
                <p>Get Involved</p>
                <span> simply a sense of belonging</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  Join Conversations: Share thoughts and insights in our forums.
                  {/* Contribute Content: Share your stories and expertise. */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col" ontouchstart="this.classList.toggle('hover');">
          <div className="about-container">
            <div
              className="front"
              style={{ backgroundImage: `url(${about2})` }}
            >
              <div className="inner">
                <p>Get Involved</p>
                <span>we believe in the power of connection</span>
              </div>
            </div>
            <div className="back">
              <div className="inner">
                <p>
                  {/* Join Conversations: Share thoughts and insights in our forums. */}
                  Contribute Content: Share your stories and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
