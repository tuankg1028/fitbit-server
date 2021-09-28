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




const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
  rawData: state.home.rawData,
  encryptedData: state.home.encryptedData,
  sidebarTab: state.home.sidebarTab,
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const renderRawData = (props) => {
  const { rawData, sidebarTab } = props
  const Headers = ({ sidebarTab }) => {
    return TABLE_BY_TYPES[sidebarTab].map(item => item.label).map((item, index) => (<th scope="col" key={index}>{item}</th>))
  }
  
  const Rows = (rows, sidebarTab) => {
    return rows.map((row, index) => (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        {
          // render value in cols
          TABLE_BY_TYPES[sidebarTab].map((item, index) => (
            <td key={index}>{(item.value !== "timestamp" ? row[item.value] : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row[item.value]) ) || item.default }</td>
          ))
        }
      </tr>
    ))
  }

  return  rawData ? (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            {Headers(props)}
          </tr>
        </thead>
        <tbody>
          {!!rawData.length && Rows(rawData, sidebarTab)}
        </tbody>
      </table>

      {!rawData.length && ("No data found")}
    </div>
    
    ) : (<div>Loading...</div>)
}

const renderEncryptedData = (props) => {
  const { encryptedData } = props
  console.log(1, encryptedData)
  const Rows = rows => {
  
    return rows.map((row, index) => (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td title={row.cipherText}>{row.cipherText || "-" }</td>
        <td>{ new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row.timestamp) }</td>  
      </tr>
    ))
  }
  
  return  encryptedData ? (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ciphertext</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {!!encryptedData.length && Rows(encryptedData)}
        </tbody>
      </table>

      {!encryptedData.length && ("No data found")}
    </div>
    
    ) : (<div>Loading...</div>)
}
const MainView = props => {
  return (
    <div className="col-12 col-md-9">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="raw-tab" data-bs-toggle="tab" data-bs-target="#raw" type="button" role="tab" aria-controls="raw" aria-selected="true">Raw data</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="encrypted-tab" data-bs-toggle="tab" data-bs-target="#encrypted" type="button" role="tab" aria-controls="encrypted" aria-selected="false">Encrypted data</button>
        </li>
      </ul>
      <div className="tab-content mt-2" id="myTabContent">
        {/* Raw */}
        <div className="tab-pane fade show active" id="raw" role="tabpanel" aria-labelledby="home-tab">{renderRawData(props)}</div>
        {/* Encrypted */}
        <div className="tab-pane fade" id="encrypted" role="tabpanel" aria-labelledby="encrypted-tab">{renderEncryptedData(props)}</div>
      </div>
      
      
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
