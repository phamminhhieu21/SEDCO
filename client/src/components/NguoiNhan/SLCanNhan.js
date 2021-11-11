import React from "react";
import ReceiverStatusDetail from "../../components/GoodsDetail/ReceiverStatusDetail/ReceiverStatusDetail";
import { connect } from "react-redux";
import getEssentialsDetail from "../../stores/actions/essentialsDetail.action"
class SLCanNhan extends React.Component {
  state = {
    showGoodsDetail: false,
    showUpdateReceiverForm: false,
    showUpdateSenderForm: false,
    essentials: this.props.status_current.detail.essentials,

  };
  componentDidMount = async () => {
    if (this.state.essentials.length > 0) {
      const essentials_map = await Promise.all(
        this.state.essentials.map(async (essential) => {
          const essential_detail = await this.getEssentialsDetail(
            essential.essential_id
          );
          return {
            ...essential,
            name: essential_detail.name,
            code_name: essential_detail.code_name,
            unit: essential_detail.unit,
          };
        })
      );
      this.setState({
        essentials: essentials_map,
      });
    }
  };
  handleShowHide = () => {
    console.log("1");
    this.setState({ showGoodsDetail: !this.state.showGoodsDetail });
  };
  handleShowHideUpdateReceiver = () => {
    this.setState({
      showUpdateReceiverForm: !this.state.showUpdateReceiverForm,
    });
  };
  handleShowHideUpdateSender = () => {
    this.setState({ showUpdateSenderForm: !this.state.showUpdateSenderForm });
  };
  getEssentialsDetail = async (essential_id) => {
    await this.props.getEssentialsDetail(essential_id);
    const essentialsDetail = await this.props.essentialsDetailReducer;
    // console.log(essentialsDetail)
    return essentialsDetail;
  };
  handleUpdateEssentials = (essentials) => {
    this.setState({
      essentials : essentials
    })
  }
  render() {
    // const status_current = this.props.status_current;
    // const essentials = status_current.detail.essentials;
    // const note = status_current.detail.note;
    // const number_per_of_family = status_current.detail.number_per_of_family;
    const essentials_state = this.state.essentials;
    // console.log(this.state)
    return (
      <React.Fragment>
        <div>
          {this.state.showGoodsDetail === false ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 className="data-container__title">Hỗ trợ nhu yếu phẩm </h3>{" "}
                <button
                  className="data-container__SeeDetail"
                  onClick={() => {
                    this.handleShowHide();
                  }}
                >
                  xem chi tiết{" "}
                  <i
                    className="fas fa-arrow-right"
                    style={{ fontSize: "12px" }}
                  />
                </button>
              </div>

              <table className="List-Good">
                {essentials_state &&
                  essentials_state.map((essential) => {
                    return (
                      <>
                        {essential.quantity > 0 && (
                          <tr key={essential.essential_id}>
                            <td>{essential.name}</td>
                            <td>{essential.quantity}</td>
                            <td>{essential.unit}</td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                {/* <tr>
                  <td>Trứng</td>
                  <td>4 quả</td>
                </tr>
                <tr>
                  <td>Gạo</td>
                  <td>4 bao</td>
                </tr>
                <tr>
                  <td>Rau củ</td>
                  <td>6 thùng</td>
                </tr>
                <tr>
                  <td>...</td>
                  <td>...</td>
                </tr>
                <tr>
                  <td>Tổng khối lượng</td>
                  <td>600kg</td>
                </tr> */}
              </table>
              <h3 className="data-container__title">Gần đây</h3>
            </>
          ) : (
            <ReceiverStatusDetail
              user={this.props.user}
              status_current={this.props.status_current}
              status_current_current = {this.props.status_current}
              essentials = {this.state.essentials}
              handleHideReceiverStatusDetail={this.handleShowHide}
              handleUpdateEssentials={this.handleUpdateEssentials}
              handleUpdateStatusCurrent={this.props.handleUpdateStatusCurrent}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    essentialsDetailReducer: state.essentialsDetailReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getEssentialsDetail: async (essential_id) => {
      const action = await getEssentialsDetail(essential_id);
      return dispatch(action);
    },
  };
};
export default connect(mapStateToProps , mapDispatchToProps)(SLCanNhan);
