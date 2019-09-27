import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import Joyride, { STATUS } from 'react-joyride/lib'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'

import { Cartridge } from '@blockchain-com/components'
import {
  CoinIcon,
  Destination,
  MenuIcon,
  MenuItem,
  Separator,
  // SubMenu,
  // SubMenuItem,
  Wrapper
} from 'components/MenuLeft'
import {
  Link,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import { PitTooltip, TOUR_STEPS } from './model'

const HelperTipContainer = styled.div`
  margin-left: auto;
  > div span {
    color: ${props => props.theme['gray-3']};
  }
`

const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme['orange']} !important;
  background-color: ${props => props.theme['white']};
  letter-spacing: 1px;
  margin-left: auto;
  margin-right: -4px;
  padding: 4px 4px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 4px;
`

const SpotlightLinkContainer = styled(LinkContainer)`
  position: relative;
`

const JoyrideSpotlight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto 11px;
  width: 32px;
  height: 32px;
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
      opacity: 0.25;
    }
  `
}

const BeaconComponent = styled.span`
  background-color: ${({ theme }) => theme['blue']} !important;
  opacity: 0.25 !important;
  border-radius: 50% !important;
  animation: ${props => Pulse(props)} 1s infinite;
  height: 16px !important;
  width: 16px !important;
  margin-left: -7px;
`

const PitTour = props => {
  const [run, setRun] = useState(false)

  const handleTourCallbacks = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) setRun(false)
  }

  useEffect(() => {
    setRun(true)
  }, [])

  return (
    <Joyride
      run={run}
      beacon={true}
      beaconComponent={BeaconComponent}
      steps={TOUR_STEPS}
      disableScrollParentFix={true}
      tooltipComponent={PitTooltip}
      callback={handleTourCallbacks}
      showSkipButton={true}
      styles={{
        overlay: {
          backgroundColor: 'none'
        }
      }}
      {...props.Joyride}
    />
  )
}

const PitLinkContent = ({ pitSideNavTest, firstLogin, showThePitPulse }) => {
  switch (pitSideNavTest) {
    case 'sidenav_trading':
      return (
        <React.Fragment>
          <MenuIcon name='the-pit' style={{ paddingLeft: '2px' }} size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.trading'
              defaultMessage='Trading'
            />
          </Destination>
        </React.Fragment>
      )
    case 'sidenav_pulsing_pit':
      return (
        <React.Fragment>
          {true && <PitTour />}
          <MenuIcon
            name='the-pit'
            style={{ paddingLeft: '2px' }}
            size='24px'
            className='the-pit-tooltip'
          />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.thepitbold'
              defaultMessage='The PIT'
            />
          </Destination>
        </React.Fragment>
      )
    case 'sidenav_pit_exchange':
      return (
        <React.Fragment>
          <MenuIcon name='the-pit' style={{ paddingLeft: '2px' }} size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.thepitexchange'
              defaultMessage='The PIT Exchange'
            />
          </Destination>
        </React.Fragment>
      )
    default:
      return (
        <React.Fragment>
          <MenuIcon name='the-pit' style={{ paddingLeft: '2px' }} size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.thepit'
              defaultMessage='The PIT'
            />
          </Destination>
        </React.Fragment>
      )
  }
}

const Navigation = props => {
  const { ...rest } = props
  const {
    // lockboxOpened,
    // lockboxDevices,
    onClickPitSideNavLink,
    supportedCoins
  } = rest
  const coinOrder = [
    supportedCoins.PAX,
    supportedCoins.BTC,
    supportedCoins.ETH,
    supportedCoins.BCH,
    supportedCoins.XLM
  ]

  return (
    <Wrapper {...rest}>
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <MenuIcon name='home' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.dashboard'
              defaultMessage='Dashboard'
            />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <SpotlightLinkContainer to='/buy-sell' activeClassName='active'>
        <MenuItem data-e2e='buyAndSellLink'>
          <JoyrideSpotlight className='wallet-intro-tour-step-5' />
          <MenuIcon name='cart-filled' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.buysell'
              defaultMessage='Buy & Sell'
              className='destination'
            />
          </Destination>
        </MenuItem>
      </SpotlightLinkContainer>
      <SpotlightLinkContainer to='/swap' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
          <JoyrideSpotlight className='wallet-intro-tour-step-4' />
          <MenuIcon name='thick-arrow-switch' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.swap'
              defaultMessage='Swap'
            />
          </Destination>
        </MenuItem>
      </SpotlightLinkContainer>
      <LinkContainer to='/lockbox' activeClassName='active'>
        <MenuItem data-e2e='lockboxLink'>
          <MenuIcon
            name='hardware'
            style={{ paddingLeft: '2px' }}
            size='24px'
          />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.hardware'
              defaultMessage='Hardware'
            />
          </Destination>
          <HelperTipContainer>
            <TooltipHost id='lockboxRequired'>
              <TooltipIcon color='blue' name='info' />
            </TooltipHost>
          </HelperTipContainer>
        </MenuItem>
      </LinkContainer>
      {props.isInvitedToPitSidenav &&
        (props.isInvitedToPitSidenav ? (
          <Link
            href={props.pitUrl}
            rel='noopener noreferrer'
            target='_blank'
            style={{ width: '100%' }}
          >
            <MenuItem data-e2e='thePitLink'>
              <PitLinkContent pitSideNavTest='sidenav_pulsing_pit' />
            </MenuItem>
          </Link>
        ) : (
          <SpotlightLinkContainer
            to='/thepit'
            activeClassName='active'
            onClick={onClickPitSideNavLink}
          >
            <MenuItem data-e2e='thePitLink'>
              <PitLinkContent pitSideNavTest='sidenav_pulsing_pit' />
              <NewCartridge>
                <Text color='orange' size='12' weight={500} uppercase>
                  <FormattedMessage
                    id='layouts.wallet.menuleft.navigation.transactions.new'
                    defaultMessage='New'
                  />
                </Text>
              </NewCartridge>
            </MenuItem>
          </SpotlightLinkContainer>
        ))}
      {/* TODO: bring back lockbox menu */}
      {/* lockboxOpened && (
        <SubMenu>
          {lockboxDevices.map((device, index) => {
            const deviceName = device.device_name
            return (
              <LinkContainer
                key={index}
                activeClassName='active'
                to={`/lockbox/dashboard/${index}`}
                isActive={() => rest.pathname.includes(index)}
              >
                <SubMenuItem>
                  <FormattedMessage
                    id='layouts.wallet.menuleft.navigation.lockbox.device'
                    defaultMessage='{deviceName}'
                    values={{ deviceName }}
                  />
                </SubMenuItem>
              </LinkContainer>
            )
          })}
        </SubMenu>
      ) */}
      <Separator />
      {values(
        mapObjIndexed(
          (coin, i) =>
            coin.txListAppRoute &&
            coin.invited && (
              <LinkContainer
                key={i}
                to={coin.txListAppRoute}
                activeClassName='active'
              >
                <MenuItem
                  data-e2e={`${toLower(coin.coinCode)}Link`}
                  colorCode={coin.colorCode}
                  className='coin'
                >
                  <CoinIcon
                    color={coin.colorCode}
                    name={coin.icons.circleFilled}
                    size='24px'
                  />
                  <Destination>{coin.displayName}</Destination>
                  {coin.showNewTagSidenav && (
                    <NewCartridge>
                      <Text color='orange' size='12' weight={500} uppercase>
                        <FormattedMessage
                          id='layouts.wallet.menuleft.navigation.transactions.new'
                          defaultMessage='New'
                        />
                      </Text>
                    </NewCartridge>
                  )}
                </MenuItem>
              </LinkContainer>
            ),
          coinOrder
        )
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
