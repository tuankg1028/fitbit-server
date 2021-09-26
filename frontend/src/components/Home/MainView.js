import ArticleList from '../ArticleList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

// 
import { CHANGE_TAB } from '../../constants/actionTypes';
import { TABLE_BY_TYPES, DATA_TYPE } from '../../constants'
const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed());
    }

    return (
      <li className="nav-item">
        <a  href=""
            className={ props.tab === 'feed' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
        Global Feed
      </a>
    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  );
};

const Headers = ({ sidebarTab }) => {
  return TABLE_BY_TYPES[sidebarTab].map(item => item.label).map((item, index) => (<th scope="col" key={index}>{item}</th>))
}

const Rows = props => {
  const { sidebarTab, data } = props
  if(!data.length) return (<div>No data found</div>)

  return data.map((row, index) => (
    <tr key={index}>
      <th scope="row">{index + 1}</th>
      {
        // render value in cols
        TABLE_BY_TYPES[sidebarTab].map((item) => (
          <td>{(item.value !== "timestamp" ? row[item.value] : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row[item.value])) || item.default }</td>
        ))
      }
    </tr>
  ))
}


const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
  data: state.home.data,
  sidebarTab: state.home.sidebarTab,
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const MainView = props => {
  if(props.data) {
    return (
    
      <div className="col-12 col-md-9">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              {Headers(props)}
            </tr>
          </thead>
          <tbody>
            {Rows(props)}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (<div>Loading...</div>)
  }
  
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
