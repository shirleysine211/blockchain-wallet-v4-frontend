import {
  any,
  compose,
  complement,
  curry,
  equals,
  find,
  findLast,
  hasPath,
  lift,
  includes,
  isNil,
  not,
  path,
  pathOr,
  prop,
  propEq
} from 'ramda'
import { selectors } from 'data'
import { USER_ACTIVATION_STATES, KYC_STATES, TIERS_STATES } from './model'

export const getUserData = path(['profile', 'userData'])
export const getUserId = compose(
  lift(prop('id')),
  getUserData
)
export const getWalletAddresses = compose(
  lift(prop('walletAddresses')),
  getUserData
)
export const getUserActivationState = compose(
  lift(prop('state')),
  getUserData
)
export const getUserKYCState = compose(
  lift(prop('kycState')),
  getUserData
)
export const getSunRiverTag = compose(
  lift(path(['tags', 'SUNRIVER'])),
  getUserData
)
export const getPowerPaxTag = compose(
  lift(hasPath(['tags', 'POWER_PAX'])),
  getUserData
)
export const isUserCreated = compose(
  lift(equals(USER_ACTIVATION_STATES.CREATED)),
  getUserActivationState
)
export const isUserActive = compose(
  lift(equals(USER_ACTIVATION_STATES.ACTIVE)),
  getUserActivationState
)
export const isUserStateNone = compose(
  lift(equals(USER_ACTIVATION_STATES.NONE)),
  getUserActivationState
)
export const isUserVerified = compose(
  lift(equals(KYC_STATES.VERIFIED)),
  getUserKYCState
)
export const getUserCountryCode = compose(
  lift(path(['address', 'country'])),
  getUserData
)
export const getUserStateCode = compose(
  lift(path(['address', 'state'])),
  getUserData
)
export const getUserTiers = compose(
  lift(prop('tiers')),
  getUserData
)
export const getUserLimits = compose(
  lift(prop('limits')),
  getUserData
)
export const getKycDocResubmissionStatus = compose(
  lift(path(['resubmission', 'reason'])),
  getUserData
)

export const getTiers = path(['profile', 'userTiers'])
export const getTier = curry((state, tierIndex) =>
  lift(find(propEq('index', tierIndex)))(getTiers(state))
)
export const getLastAttemptedTier = compose(
  lift(findLast(complement(propEq('state', TIERS_STATES.NONE)))),
  getTiers
)

export const isCountrySupported = (countryCode, supportedCountries) =>
  any(propEq('code', countryCode), supportedCountries)
export const isInvitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))

export const userFlowSupported = isInvitedToKyc

export const isInvitedToPitSidenav = state => {
  const pitCountries = selectors.core.walletOptions.getPitCountryList(state)
  const userCountry = selectors.core.settings.getCountryCode(state)

  const transform = (pitCountries, userCountry) => {
    const isCountryWhitelisted =
      pitCountries &&
      (pitCountries === '*' || includes(userCountry, pitCountries))

    return isCountryWhitelisted
  }

  return lift(transform)(pitCountries, userCountry)
}

export const isInvitedToPitHomeBanner = state => {
  const pitCountries = selectors.core.walletOptions.getPitCountryList(state)
  const userCountry = selectors.core.settings.getCountryCode(state)
  const isInvited = selectors.core.settings
    .getInvitations(state)
    .map(prop('pitHomeBanner'))

  const transform = (pitCountries, userCountry, isInvited) => {
    const isCountryWhitelisted =
      pitCountries &&
      (pitCountries === '*' || includes(userCountry, pitCountries))

    return isCountryWhitelisted || isInvited
  }

  return lift(transform)(pitCountries, userCountry, isInvited)
}

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  token: getApiToken(state).getOrElse(''),
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  guid: selectors.core.wallet.getGuid(state)
})

export const getCampaign = pathOr(null, ['profile', 'campaign'])

export const CLOSE_TO_AMOUNT = 0.8
export const closeToTier1Limit = state =>
  lift(
    (userData, tiers) =>
      path([0, 'state'], tiers) === TIERS_STATES.VERIFIED &&
      path([1, 'state'], tiers) === TIERS_STATES.NONE &&
      pathOr(0, [0, 'limits', 'annual'], tiers)[0].limits.annual *
        CLOSE_TO_AMOUNT <
        pathOr(0, ['limits', 'annual'], userData)
  )(getUserData(state), getTiers(state))

export const getLinkFromPitAccountStatus = path([
  'profile',
  'pitOnboarding',
  'linkFromPitAccountStatus'
])
export const getLinkToPitAccountStatus = path([
  'profile',
  'pitOnboarding',
  'linkToPitAccountStatus'
])
export const getLinkToPitAccountDeeplink = path([
  'profile',
  'pitOnboarding',
  'linkToPitAccountDeeplink'
])

export const isPitAccountLinked = state =>
  lift(user => not(isNil(prop('settings', user))))(getUserData(state))
