import React from 'react';
import { connect } from 'react-redux';

//
import { CHANGE_TAB } from '../constants/actionTypes';
import { DATA_TYPE } from '../constants'

const mapStateToProps = state => ({
  sidebarTab: state.home.sidebarTab,
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

class Sidebar extends React.Component {
  render() {
    return (
      <div className="col-12 col-md-3">
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
            <svg className="bi me-2" style={{width: "40", height: "32"}}></svg>
            <span className="fs-4">Data Types</span>
          </a>
          <hr/>
          <ul className="nav nav-pills flex-column mb-auto">
            {
              Object.values(DATA_TYPE).map((item, index) => {
                let tabName
                switch(item) {
                  case (DATA_TYPE.HEART_RATE):
                    tabName = "Heart Rate"
                    break
                  case (DATA_TYPE.ACCELEMETER):
                    tabName = "Accelerometer"
                    break
                  case (DATA_TYPE.BAROMETER):
                    tabName = "Barometer"
                    break
                  case (DATA_TYPE.GEOLOCATION):
                    tabName = "Location"
                    break
                  case (DATA_TYPE.SLEEP):
                    tabName = "Sleep"
                    break
                  case (DATA_TYPE.ORIENTATION):
                    tabName = "Orientation"
                    break
                  case (DATA_TYPE.GYROSCOPE):
                    tabName = "Gyroscope"
                    break
                  default:
                    tabName = "Not defined"
                    break
                }
                return (
                  <li className="nav-item" key={index}>
                    <a href={`/${item}`} className={"nav-link " + (this.props.sidebarTab === item ? "active" : "link-dark")}>
                      <svg className="bi me-2" style={{width: "16", height: "16"}}></svg>
                      {tabName}
                    </a>
                  </li>
                )
              })
            }
          </ul>
          <hr/>
          {/* <div className="dropdown">
            <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="" style={{width: "32px", height: "32px"}} className="rounded-circle me-2"/>
              <strong>mdo</strong>
            </a>
            <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
              <li><a className="dropdown-item" href="#">New project...</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><hr className="dropdown-divider"/></li>
              <li><a className="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div> */}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

