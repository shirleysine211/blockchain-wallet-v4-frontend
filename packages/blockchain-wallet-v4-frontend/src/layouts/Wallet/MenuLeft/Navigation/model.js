import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { keyframes } from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Icon, Text } from 'blockchain-info-components'

const Scale = () => {
  return keyframes`
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `
}

const TooltipBody = styled.div`
  position: relative;
  width: 100%;
  max-width: 256px;
  background-color: ${props => props.theme['white']};
  border-radius: 8px;
  box-shadow: 0 4px 32px rgba(5, 24, 61, 0.4);
  padding: 32px;
  animation: ${Scale} 0.3s ease-in-out;

  > span:first-child {
    position: absolute;
    top: 24px;
    right: 24px;

    &:hover {
      cursor: pointer;
    }
  }
`
const TooltipContent = styled.div`
  color: ${props => props.theme['white']};
  margin-bottom: 24px;
  text-align: center;
`
const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme['white']};
`

const StepTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 8px;
  line-height: 24px;
`

const StepContent = styled(Text)`
  line-height: 24px;
`

const CloseTourIcon = styled(Icon)`
  &:hover {
    color: ${({ theme }) => theme['grey600']};
  }

  &:active {
    color: ${({ theme }) => theme['grey800']};
  }
`

const StepIcon = styled(Icon)`
  margin: 0 auto 12px auto;
  width: fit-content;
`

export const PitTooltip = ({
  analyticsActions,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
  ...rest
}) => {
  return (
    <TooltipBody {...tooltipProps}>
      <CloseTourIcon
        color='grey400'
        data-e2e='modalCloseButton'
        name='close'
        size='16px'
        weight={600}
        {...skipProps}
      />
      {step.content && <TooltipContent>{step.content}</TooltipContent>}
      <TooltipFooter isLastStep={isLastStep}>
        <LinkContainer to='/thepit'>
          <Button
            width='110px'
            height='48px'
            nature='primary'
            fullwidth
            {...primaryProps}
          >
            <FormattedMessage
              id='the.pit.tooltip.check.it.out'
              defaultMessage='Check it out'
            />
          </Button>
        </LinkContainer>
      </TooltipFooter>
    </TooltipBody>
  )
}

export const TOUR_STEPS = [
  {
    target: '.the-pit-tooltip',
    content: (
      <>
        <StepIcon name='the-pit' size='56px' color='pitBlue' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='the.pit.tooltip.title'
            defaultMessage='Exchange in The Pit.'
          />
        </StepTitle>
        <StepContent color='grey600' size='14px' weight={500}>
          <FormattedMessage
            id='the.pit.tooltip.content'
            defaultMessage="Now that you have a Wallet, link and exchange over 26 pairs in The PIT - Blockchain's own Crypto Exchange."
          />
        </StepContent>
      </>
    ),
    placement: 'right'
  }
]
