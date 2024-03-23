import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { formatDataNumber, getTokenLogo, newTransactionsFirst, returnWalletAddress } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { handleTransactionError, isTransactionRecent } from '~/hooks'
import Identicon from './Icons/Identicon'
import { Icon } from './TokenInput'
import NavLinks from './NavLinks'
import Button from './Button'
import Brand from './Brand'
import { claimAirdrop } from '~/services/blockchain'
import ArrowDown from './Icons/ArrowDown'
import Camelot from './Icons/Camelot'
import { fetchPoolData } from '@opendollar/sdk'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'
import useGeb from '~/hooks/useGeb'
import { BigNumber, ethers } from 'ethers'

const Navbar = () => {
    const theme = useTheme()

    const [isPopupVisible, setPopupVisibility] = useState(false)
    const [state, setState] = useState({
        odPrice: '',
        totalLiquidity: '',
    })
    const dollarRef = useRef<HTMLButtonElement | null>(null)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const { t } = useTranslation()
    const { transactionsModel: transactionsState } = useStoreState((state) => state)

    const { transactions } = transactionsState

    const {
        popupsModel: popupsActions,
        transactionsModel,
        connectWalletModel: connectWalletActions,
    } = useStoreActions((state) => state)
    const { connectWalletModel } = useStoreState((state) => state)
    const { isActive, account, provider } = useWeb3React()
    const geb = useGeb()
    const odRef = useRef<HTMLDivElement | null>(null)
    const testTokenPopupRef = useRef<HTMLDivElement | null>(null)
    const [isTokenPopupVisible, setTokenPopupVisibility] = useState(false)
    const [isTestTokenPopupVisible, setTestTokenPopupVisibility] = useState(false)
    const signer = provider ? provider.getSigner(account) : undefined

    const handleTokenClick = () => {
        setTokenPopupVisibility(!isTokenPopupVisible)
    }

    const handleAddOD = async () => {
        try {
            const { ethereum } = window
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    // @ts-ignore
                    type: 'ERC20',
                    options: {
                        address: connectWalletModel.tokensData.OD.address,
                        symbol: connectWalletModel.tokensData.OD.symbol,
                        decimals: connectWalletModel.tokensData.OD.decimals,
                    },
                },
            })
        } catch (error) {
            console.log('Error adding OD to the wallet:', error)
        }
    }

    const handleAddODG = async () => {
        try {
            const { ethereum } = window
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    // @ts-ignore
                    type: 'ERC20',
                    options: {
                        address: connectWalletModel.tokensData.ODG.address,
                        symbol: connectWalletModel.tokensData.ODG.symbol,
                        decimals: connectWalletModel.tokensData.ODG.decimals,
                    },
                },
            })
        } catch (error) {
            console.log('Error adding ODG to the wallet:', error)
        }
    }

    const handleDollarClick = () => {
        setPopupVisibility(!isPopupVisible)
    }

    const handleClickOutsideOdRef = (event: MouseEvent) => {
        if (
            dollarRef.current &&
            !dollarRef.current.contains(event.target as Node) &&
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
        ) {
            setPopupVisibility(false)
        }
    }

    const handleClickOutsideTestToken = (event: MouseEvent) => {
        if (testTokenPopupRef.current && !testTokenPopupRef.current.contains(event.target as Node)) {
            setTestTokenPopupVisibility(false)
        }
    }

    const handleClickOutsideOdWallet = (event: MouseEvent) => {
        if (odRef.current && !odRef.current.contains(event.target as Node)) {
            setTokenPopupVisibility(false)
        }
    }

    const handleWalletConnect = () => {
        if (isActive && account) {
            return popupsActions.setIsConnectedWalletModalOpen(true)
        }
        return popupsActions.setIsConnectorsWalletOpen(true)
    }

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(transactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [transactions])

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

    const hasPendingTransactions = !!pending.length

    const odBalance = useMemo(() => {
        const balances = connectWalletModel.tokensFetchedData
        return formatDataNumber(balances.OD ? balances.OD.balanceE18.toString() : '0', 18, 2, false)
    }, [connectWalletModel.tokensFetchedData])

    useEffect(() => {
        async function fetchData() {
            if (geb) {
                try {
                    const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])

                    const formattedLiquidity = formatDataNumber(
                        ethers.utils
                            .parseEther(BigNumber.from(Math.floor(Number(poolData?.totalLiquidityUSD))).toString())
                            .toString(),
                        18,
                        0,
                        true
                    ).toString()

                    setState((prevState) => ({
                        ...prevState,
                        odPrice: formatDataNumber(analyticsData.marketPrice, 18, 3, true, undefined, 2),
                        totalLiquidity: formattedLiquidity,
                    }))
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
        }

        fetchData()
        document.addEventListener('mousedown', handleClickOutsideOdRef)
        document.addEventListener('mousedown', handleClickOutsideTestToken)
        document.addEventListener('mousedown', handleClickOutsideOdWallet)
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutsideOdRef)
            document.removeEventListener('mousedown', handleClickOutsideTestToken)
            document.removeEventListener('mousedown', handleClickOutsideOdWallet)
        }
    }, [geb])

    return (
        <Container>
            <Left>
                <Brand />
                <Price>
                    <DollarValue ref={dollarRef} onClick={handleDollarClick}>
                        <Icon src={getTokenLogo('OD')} width={'16px'} height={'16px'} />
                        <span>{state.odPrice}</span>
                        <ArrowWrapper>
                            <ArrowDown fill={theme.colors.primary} />
                        </ArrowWrapper>
                    </DollarValue>
                    {isPopupVisible && (
                        <InfoPopup ref={popupRef}>
                            <PopupWrapperLink>
                                <InfoPopupContentWrapper>
                                    <InfoPopUpText style={{marginBottom: 6}} >{t('liquidity').toUpperCase()}</InfoPopUpText>
                                    <InfoPopUpText style={{fontSize: theme.font.default}}>{state.totalLiquidity}</InfoPopUpText>
                                </InfoPopupContentWrapper>
                                <InfoPopUpHorizontalSeparator />
                                <InfoPopupContentWrapper>
                                    <Flex>
                                        <Camelot />
                                        <InfoPopUpSubText style={{marginLeft: '10px'}}>
                                            {t('view_on_camelot_exchange')}
                                        </InfoPopUpSubText>
                                    </Flex>
                                </InfoPopupContentWrapper>
                            </PopupWrapperLink>
                        </InfoPopup>
                    )}
                </Price>
            </Left>
            <HideMobile>
                <NavLinks />
            </HideMobile>
            <RightSide>
                <BtnContainer ref={testTokenPopupRef}>
                    {signer && (
                        <>
                            <ClaimButton onClick={() => setTestTokenPopupVisibility(!isTestTokenPopupVisible)}>
                                Test tokens 🪂
                                <ArrowWrapper>
                                    <ArrowDown fill={isTestTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                </ArrowWrapper>
                            </ClaimButton>
                            {isTestTokenPopupVisible && (
                                <InfoPopup className="group">
                                    <InfoPopupContentWrapper>
                                        <Flex style={{alignItems: 'flex-start'}}>
                                            <img src={require('../assets/discord.svg').default} alt="Discord" />
                                            <InfoPopUpSubText style={{marginLeft: 10}}>
                                                {t('claim_on_discord')}
                                            </InfoPopUpSubText>
                                        </Flex>
                                    </InfoPopupContentWrapper>
                                </InfoPopup>
                            )}
                        </>
                    )}
                    {/* Button to add OD and ODG to the wallet */}
                    <RightPriceWrapper ref={odRef}>
                        <DollarValue onClick={handleTokenClick}>
                            <Icon
                                src={require('../assets/od-wallet-icon.svg').default}
                                width={'16px'}
                                height={'16px'}
                            />
                            {odBalance + ' '} OD
                            <ArrowWrapper>
                                <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                            </ArrowWrapper>
                        </DollarValue>
                        {isTokenPopupVisible && (
                            <InfoPopup className="group">
                                <Button
                                    style={{ fontWeight: 600 }}
                                    unstyled={true}
                                    primary={account ? true : false}
                                    id="web3-status-connected"
                                    isLoading={hasPendingTransactions}
                                    onClick={handleWalletConnect}
                                >
                                    {isActive && account ? (
                                        hasPendingTransactions ? (
                                            `${pending.length} Pending`
                                        ) : (
                                            <InnerBtn>
                                                <IdenticonWrapper>
                                                    <Identicon />
                                                </IdenticonWrapper>
                                                {returnWalletAddress(account)}
                                            </InnerBtn>
                                        )
                                    ) : (
                                        t('connect_wallet')
                                    )}
                                </Button>
                                <TokenTextWrapper>ADD TOKEN TO WALLET</TokenTextWrapper>
                                <PopupColumnWrapper>
                                    <PopupWrapperTokenLink onClick={() => handleAddOD()} className="group">
                                        <IconWrapper>
                                            <img
                                                src={require('../assets/od-logo.svg').default}
                                                height={'24px'}
                                                width={'24px'}
                                                alt="X"
                                            />
                                        </IconWrapper>
                                        <PopupColumn>
                                            <div>OD</div>
                                        </PopupColumn>
                                    </PopupWrapperTokenLink>
                                    <PopupWrapperTokenLink onClick={() => handleAddODG()} className="group">
                                        <IconWrapper>
                                            <img
                                                src={require('../assets/odg.svg').default}
                                                height={'24px'}
                                                width={'24px'}
                                                alt="X"
                                            />
                                        </IconWrapper>
                                        <PopupColumn>
                                            <div>ODG</div>
                                        </PopupColumn>
                                    </PopupWrapperTokenLink>
                                </PopupColumnWrapper>
                            </InfoPopup>
                        )}
                    </RightPriceWrapper>
                </BtnContainer>

                <MenuBtn onClick={() => popupsActions.setShowSideMenu(true)}>
                    <RectContainer>
                        <Rect />
                        <Rect />
                        <Rect />
                    </RectContainer>
                </MenuBtn>
            </RightSide>
        </Container>
    )
}

export default Navbar

const IdenticonWrapper = styled.div<{ size?: number }>`
    display: flex;
    & > img,
    span,
    svg {
        height: ${({ size }) => (size ? size + 'px' : '24px')};
        width: ${({ size }) => (size ? size + 'px' : '24px')};
    }

    div {
        height: ${({ size }) => (size ? size + 'px' : '22.6px')} !important;
        width: ${({ size }) => (size ? size + 'px' : '24px')} !important;
        svg {
            rect {
                height: ${({ size }) => (size ? size + 'px' : '22.6px')} !important;
                width: ${({ size }) => (size ? size + 'px' : '24px')} !important;
            }
        }
    }
`

const PopupColumn = styled.div`
    text-align: end;
`

const PopupWrapperTokenLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    cursor: pointer;
`

const PopupColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const TokenTextWrapper = styled.div`
    font-size: ${(props) => props.theme.font.xSmall};
    text-align: left;
    font-weight: 600;
    color: #0079ad;
    margin-bottom: 8px;
`

const screenWidth = '1073px'

const Container = styled.div`
    display: flex;
    height: 68px;
    align-items: center;
    justify-content: space-between;
    padding: 40px 40px 0 40px;
    position: relative;
    z-index: 5;

    @media (max-width: ${screenWidth}) {
        padding: 0 20px;
        top: 0 !important;
    }
`

const MenuBtn = styled.div`
    margin-right: -20px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: none;
    cursor: pointer;

    @media (max-width: ${screenWidth}) {
        display: flex;
    }
`

const BtnContainer = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: ${screenWidth}) {
        display: none;
    }

    svg {
        position: relative;
        margin-right: 0px;
    }
`

const RectContainer = styled.div``

const Rect = styled.div`
    width: 15px;
    border-radius: 12px;
    height: 3px;
    margin-bottom: 2px;
    background: ${(props) => props.theme.colors.secondary};
    transition: all 0.3s ease;
    &:last-child {
        margin-bottom: 0;
    }
`

const RightSide = styled.div`
    display: flex;
    align-items: center;
`

const HideMobile = styled.div`
    height: -webkit-fill-available;
    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Left = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: ${screenWidth}) {
        min-width: auto;
    }
`

const Flex = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`

const InnerBtn = styled(Flex)`
    div {
        display: block !important;
        margin-right: 5px;
        svg {
            top: 0 !important;
        }
    }
`

const OdButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: ${(props) => props.theme.colors.accent};
    width: 15vw;
    max-width: 210px;
    padding: 10px 12px 8px 12px;
    box-shadow: 0 4px ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.xxSmall};
    font-weight: 700;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.primary};
    border-radius: 50px;
    transition: all 0.15s ease;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-0.5px);
        box-shadow: 0 4.5px ${(props) => props.theme.colors.primary};
        background: ${(props) => props.theme.colors.neutral}33;
    }
`

const RightPriceWrapper = styled.div`
    margin-right: auto;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Price = styled.div`
    margin-right: auto;
    margin-left: 32px;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const TestTokenTextWrapper = styled.div`
    font-size: ${(props) => props.theme.font.xSmall};
    text-align: left;
    font-weight: 600;
    color: #0079ad;
    word-wrap: break-word;
    max-width: 100%;
`

const InfoPopup = styled.div`
    position: absolute;
    background: ${(props) => props.theme.colors.background};
    border-radius: 14px;
    top: 90px;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.neutral};
    width: 15vw;
    max-width: 210px;
`

const PopupWrapperLink = styled.a`
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const ClaimButton = styled(OdButton)``

const DollarValue = styled(OdButton)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
`

const InfoPopUpHorizontalSeparator = styled.div`
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.colors.accent}33;
`

const InfoPopupContentWrapper = styled.div`
    padding: 16px
`

const InfoPopUpText = styled.div`
    font-size: ${(props) => props.theme.font.xSmall};
    line-height: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 500;
    font-family: 'Barlow', sans-serif;
`
const InfoPopUpSubText = styled.div`
    font-size: 13px;
    line-height: ${(props) => props.theme.font.xSmall};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 500;
`
