<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/bayardt/nc_news">
    <img src="src/images/NCNewsLogo.png" alt="Logo" height="80">
  </a>

<h3 align="center">NC News API</h3>

  <p align="center">
    <a href="https://bayardt-nc-news.netlify.app/">View Demo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project is the back-end component to a news website that allows posting and deleting comments, voting for favourite comments and articles, and filtering articles by topic.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [PostreSQL](https://www.postgresql.org)
* [Express](https://expressjs.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

As well as following the instructions below you may want to look at the information for the accompanying front-end repo: https://github.com/bayardt/fe-nc-news

### Prerequisites

Node v17.0.0 or higher is recommended on your development machine to work with this repo.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/bayardt/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create the following two files in order to access the `nc_news` and `nc_news_test` databases in this project. Each of these files will need to set the `PGDATABASE` environmental variable to their respective local locations.
   ```
   .env.development
   .env.test
   ```

   These files will each need these lines of code respectively:

   ```
   PGDATABASE=nc_news
   ```

   and

   ```
   PGDATABASE=nc_news_test
   ```
<p align="right">(<a href="#top">back to top</a>)</p>
