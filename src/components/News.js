import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import propTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  };

  static propTypes = {
    country: propTypes.string,
    pageSize: propTypes.number,
    category: propTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    super(props);
    console.log("Hello I am a constructor from news component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults:0
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)}-NewsMonkey`
  }

  async updateNews() {
    this.props.setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    //console.log(parsedData);
    this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false })
    this.props.setProgress(100);
  }
  //componentDidMount ka use karke articles udate kar sakte hai
  async componentDidMount() {
    //using componentDidMount we populate newsItems
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79172b34825442d4ada46679518fdc0d&page=1&pagesize=${this.props.pageSize}`;
    // this.setState({loading:true});
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // console.log(parsedData);
    // this.setState({ articles: parsedData.articles ,totalResults:parsedData.totalResults,loading:false})
    this.updateNews();
  }
  // handlePrevClick = async () => {
  //   console.log("prev");
  //   // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79172b34825442d4ada46679518fdc0d&page=${this.state.page - 1}&pagesize=${this.props.pageSize}`;
  //   // this.setState({loading:true});
  //   // let data = await fetch(url);
  //   // let parsedData = await data.json();
  //   // console.log(parsedData);

  //   // this.setState({
  //   //   page: this.state.page - 1,
  //   //   articles: parsedData.articles,
  //   //   loading:false
  //   // });
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // }

  // handleNextClick = async () => {
  //   console.log("next");
  //   // if(!(this.state.page +1 > Math.ceil(this.state.totalResults/this.props.pageSize))){

  //   //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79172b34825442d4ada46679518fdc0d&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`;
  //   //   this.setState({loading:true});
  //   //   let data = await fetch(url);
  //   //   let parsedData = await data.json();
  //   //   console.log(parsedData);

  //   //   this.setState({
  //   //     page: this.state.page + 1,
  //   //     articles: parsedData.articles,
  //   //     loading:false
  //   //   })
  //   // }
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // }

  fetchMoreData = async() => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    this.setState({page:this.state.page+1});
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79172b34825442d4ada46679518fdc0d&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    // this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    //console.log(parsedData);
    this.setState({ articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults})
  };
  render() {
    
    return (
      <>
        <h1 className='text-center' style={{ margin: '35px 0px' }}>NewsMonkey-Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!=this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {

              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
        </>
    )
   
  }
}

export default News
