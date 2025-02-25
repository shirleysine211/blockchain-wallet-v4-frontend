import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Joyride, { STATUS } from 'react-joyride/lib'
import React from 'react'
import ReactHighcharts from 'react-highcharts'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { actions, selectors } from 'data'

import { TourTooltip, TOUR_STEPS } from './model'
import Balances from './Balances'
import Banners from './Banners'
import PriceChart from './PriceChart'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  @media (min-width: 992px) {
    padding: 15px 30px;
  }
`
const ColumnWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  @media (min-width: 992px) {
    flex-direction: row;
  }
`
const Column = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  max-width: 600px;
  box-sizing: border-box;
  padding-bottom: 25px;
  @media (max-height: 800px), (max-width: 991px) {
    height: auto;
    display: block;
  }
`
const ColumnLeft = styled(Column)`
  @media (min-width: 992px) {
    padding-right: 30px;
  }
`
const ColumnRight = styled(Column)`
  & > :not(:first-child) {
    margin-top: 20px;
  }
`

const Pulse = ({ theme }) => {
  return keyframes`
    0% {
      box-shadow: 0 0 0 0 ${theme['blue']};
      opacity: 1;
    }
    30%{
      opacity: 0.7;
    }
    100% {
      box-shadow: 0 0 0 32px ${theme['blue']};
      opacity: 0;
    }
  `
}

const GlobalJoyrideStyles = createGlobalStyle`
  .react-joyride__spotlight {
    background-color: ${({ theme }) => theme['blue']} !important;
    opacity: 0.25 !important;
    border-radius: 50% !important;
    animation: ${props => Pulse(props)} 1.4s infinite;
    height: 16px !important;
    width: 16px !important;
    margin: 19px 0 0 19px;
    top: 0px;
    left: 0px;
  }

  .react-joyride__overlay {
    mix-blend-mode: initial !important;
  }

  .__floater__open {
    transition: none !important;
    filter: none !important;
  }
`

const Home = props => {
  const { onboardingActions, preferencesActions, showWalletTour } = props

  const handleTourCallbacks = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      onboardingActions.setWalletTourVisibility(STATUS.FINISHED)
    }
    // PIT tooltip seen
    if (data.index === 5) {
      preferencesActions.hideThePitPulse()
    }
  }
  return (
    <Wrapper>
      <Banners />
      <ColumnWrapper>
        <ColumnLeft>
          <Balances />
        </ColumnLeft>
        <ColumnRight>
          <PriceChart />
        </ColumnRight>
      </ColumnWrapper>
      <Joyride
        run={showWalletTour === true}
        steps={TOUR_STEPS}
        disableScrollParentFix={true}
        callback={handleTourCallbacks}
        tooltipComponent={TourTooltip}
        showSkipButton={true}
        styles={{
          overlay: {
            backgroundColor: 'none'
          }
        }}
        {...props.Joyride}
      />
      <GlobalJoyrideStyles />
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  showWalletTour: selectors.components.onboarding.getWalletTourVisibility(state)
})

const mapDispatchToProps = dispatch => ({
  onboardingActions: bindActionCreators(
    actions.components.onboarding,
    dispatch
  ),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
