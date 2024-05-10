import { useStoreState } from 'easy-peasy'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import LinkButton from '~/components/LinkButton'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import { useStoreActions } from 'easy-peasy'

import { formatWithCommas, getTokenLogo } from '~/utils'

const pools = [
    {
        poolAddress: '0x64ca43A1C1c38b06757152fdf0CC02d0F84407CF',
        apy: '2.90%',
        link: 'https://app.camelot.exchange/pools/0x824959a55907d5350e73e151Ff48DabC5A37a657',
    },
]

const PoolDetails = () => {
    const history = useHistory()

    const geb = useGeb()
    const [loading, setLoading] = useState(false)
    const { account } = useActiveWeb3React()
    // @to-do for some reason the new model is not being tracked in store type, but it is available as a function
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    // @ts-ignore
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState

    useEffect(() => {
        setLoading(true)
        if (!geb) return
        console.log()
        async function fetchPool() {
            try {
                await nitroPoolsActions.fetchNitroPool({
                    geb,
                    poolAddress: '0x64ca43A1C1c38b06757152fdf0CC02d0F84407CF',
                    userAddress: account ?? undefined,
                })
                setLoading(false)
            } catch (e) {
                setLoading(false)
                throw new Error(`Error fetching nitropools data ${e}`)
            }
        }
        fetchPool()
    }, [account, geb, nitroPoolsActions])

    const handleBack = useCallback(() => {
        history.push(`/earn`)
    }, [history])

    return (
        <>
            {nitroPools.length > 0 && (
                <Container>
                    <BackBtn id="back-btn" onClick={handleBack}>
                        <ChevronLeft size={18} /> BACK
                    </BackBtn>
                    <PoolHeader>
                        <Title>
                            <img src={getTokenLogo(nitroPools[0].collateralTokens[0]?.symbol)} alt={''} width={'50px'} />
                            <img src={getTokenLogo(nitroPools[0].collateralTokens[1]?.symbol)} alt={''} width={'50px'} />
                            <PoolTitle>{`${nitroPools[0].collateralTokens[0]?.symbol} - ${nitroPools[0].collateralTokens[1]?.symbol}`}</PoolTitle>
                        </Title>
                        <LinkBtnContainer>
                            <LinkButton id="create-safe" disabled={false} url={'/vaults/create'}>
                                <Plus />
                                Deposit funds
                            </LinkButton>
                        </LinkBtnContainer>
                    </PoolHeader>
                    <Body>
                        <Wrapper>
                            <ColWrapper>
                                <Item>
                                    <Label>Total value locked</Label>
                                    <Value>${formatWithCommas(nitroPools[0].tvl?.toFixed(2) || 0)}</Value>
                                </Item>
                                <Item>
                                    <Label>APY</Label>
                                    <Value>{pools[0].apy}</Value>
                                </Item>
                                <Item>
                                    <Label>Pending Rewards</Label>
                                    <Value>{nitroPools[0].rewardTokens[0].symbol}</Value>
                                </Item>
                            </ColWrapper>
                        </Wrapper>
                        <Wrapper>
                            <ColWrapper>
                                <Item>
                                    <Label>Status</Label>
                                    <Value>Active</Value>
                                </Item>
                                <Item>
                                    <Label>Duration</Label>
                                    <Value>12 months 6 days</Value>
                                </Item>
                                <Item>
                                    <Label>End in</Label>
                                    <Value>57 D 1h 27min 13 sec</Value>
                                </Item>
                            </ColWrapper>
                        </Wrapper>
                    </Body>
                    <Footer>
                        <FooterHeader>
                            My deposit
                            <LinkBtnContainer>
                                <LinkButton id="create-safe" disabled={false} url={'/vaults/create'}>
                                    Manage Position
                                </LinkButton>
                            </LinkBtnContainer>
                        </FooterHeader>
                        <Wrapper>
                            <FooterWrapper>
                                <Item>
                                    <Label>Average APR</Label>
                                    <Value>0.00%</Value>
                                </Item>
                                <Item>
                                    <Label>Total in Deposit</Label>
                                    <Value>0.0 OD-ETH: </Value>
                                </Item>
                                <Item>
                                    <Label>Pending rewards</Label>
                                    <Value>0.0 ODG: </Value>
                                </Item>
                            </FooterWrapper>
                        </Wrapper>
                    </Footer>
                </Container>
            )}
        </>
    )
}

export default PoolDetails

const Container = styled.div`
    max-width: 880px;
    margin: 50px auto;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    gap: 50px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const PoolTitle = styled.div`
    font-size: 34px;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-left: 5px;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const BackBtn = styled.div`
    font-size: 16px;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
    color: #1c293a;
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }

    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`

const LinkBtnContainer = styled.div`
    max-width: 230px;
    a {
        color: white;
        outline: none;
        cursor: pointer;
        min-width: 100px;
        padding: 12px 40px;
        font-weight: 700;
        background: ${(props) => props.theme.colors.gradientBg};
        border-radius: 3px;
        transition: all 0.3s ease;
        font-family: ${(props) => props.theme.family.headers};
    }

    svg {
        margin-right: 10px;
    }

    &:hover {
        opacity: 0.8;
    }
`

const PoolHeader = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;

        gap: 30px;
    }
`

const Title = styled.h2`
    display: flex;
`

const Body = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const Wrapper = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 4px;
    flex: 1;
`

const Footer = styled.div``

const Label = styled.div`
    font-size: 16px;
    color: ${(props) => props.theme.colors.accent};
`

const Value = styled.div`
    font-size: 18px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
`

const ColWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
`

const Item = styled.div``

const FooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 767px) {
        flex-direction: column;
        gap: 30px;
    }
`

const FooterHeader = styled.div`
    margin-bottom: 15px;
    font-size: 32px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
`
