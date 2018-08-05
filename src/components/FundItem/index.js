import React, { Component } from 'react'
import { Button, Row, Grid, Col, Media, Modal, } from 'react-bootstrap'

export class FundItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDonateModal: null,
    }

    this.clickHandler = this.clickHandler.bind(this);
    this.hideDonateModal = this.hideDonateModal.bind(this);
    this.sendFunds = this.sendFunds.bind(this);
  }

  componentWillMount() {
    // debugger;
  }

  sendFunds(event, fund) {
    event.preventDefault();
    var inWei = this.state.web3.toWei(this.state.fundDonation, 'ether');

    this.fundInstance.donateToFund(fund.address, fund.ipfsStorageHash, {from: this.state.account, value: inWei, gas: 470000, gasPrice: this.state.web3.toWei(1, 'gwei')})
    // var fundByHash = this.getFundByHash(fund.ipfsStorageHash); // exmample of how we would get the fund by hash here
  }


  clickHandler(e, index) {
    this.setState({ activeDonateModal: index })
  }

  hideDonateModal() {
    this.setState({ activeDonateModal: null })
  }


  // This fund has raised: {this.showFundsRaised(fund)} to date.
  render() {
    const fundItems = this.props.funds.map((fund, index) =>
      <div className="padding-top-sm padding-btm-sm" key={index}>
        <Media>
          <Media.Left>
            <Button bsStyle="primary" bsSize="small" onClick={e => this.clickHandler(e, index)}>
              Donate
            </Button>

            <Modal id={index} show={this.state.activeDonateModal === index} onHide={this.hideDonateModal}>
              <Modal.Header closeButton>
                <Modal.Title>Donate</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                </div>

                <div> Want to donate to {fund.name}?
                  <form onSubmit={(e) => {this.sendFunds(e, fund)}}>
                  <input type="number" name="fundDonation" value={this.state.fundDonation} onChange={(e) => this.setStateValues(e)} />
                  <input type="submit" / >
                  </form>
                </div>
               </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{fund.name}</Media.Heading>
            <p>
              {fund.description}
            </p>
            <a href={`https://ipfs.io/ipfs/${fund.fileUpload}`}>Additional File from Fund</a>
          </Media.Body>
        </Media>
      </div>
    );

    return (
      <div>
        {fundItems}
      </div>
    )
  }
}

export default FundItem
