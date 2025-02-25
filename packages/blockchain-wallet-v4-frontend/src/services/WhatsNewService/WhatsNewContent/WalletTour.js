import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'
import { Container, Row } from 'components/WhatsNew'
import { bindActionCreators } from 'redux'

import media from 'services/ResponsiveService'
import { actions } from 'data'

const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  display: inline;
  ${media.laptop`
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  `};
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  ${media.laptop`
    width: 100%;
  `};
`

const WalletTour = ({ onRightTrayClose, onTakeTour }) => {
  const onTakeWalletTour = () => {
    onRightTrayClose()
    onTakeTour()
  }
  return (
    <Container>
      <Row marginBottom='10px'>
        <Text color='brand-primary' size='24px' weight={600}>
          <FormattedMessage
            defaultMessage='Wallet Tour'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.wallet.tour'
          />
        </Text>
      </Row>
      <Row marginBottom='24px'>
        <DarkText>
          <FormattedMessage
            defaultMessage="Welcome to your Wallet.  Discover your Wallet's tools and features by taking a quick tour."
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.wallet.tour.content'
          />
        </DarkText>
      </Row>
      <Row>
        <GetStartedButton onClick={onTakeWalletTour}>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.wallet.tour.start'
            defaultMessage='Take The Tour Now'
          />
        </GetStartedButton>
      </Row>
    </Container>
  )
}

const mapDispatchToProps = dispatch => ({
  onRightTrayClose: bindActionCreators(
    actions.components.layoutWallet.layoutWalletTrayCloseClicked,
    dispatch
  ),
  onTakeTour: bindActionCreators(
    actions.components.onboarding.takeWalletTourClicked,
    dispatch
  )
})

export default connect(
  null,
  mapDispatchToProps
)(WalletTour)
