import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { returnState, COIN_TICKER, getTokenLogo, formatWithCommas } from '~/utils'

const VaultBlock = ({ ...props }) => {
    console.log(props.riskState)
    return (
        <Container className={props.className}>
            <Link to={`/vaults/${props.id}/deposit`}>
                <BlockContainer className={!returnState(props.riskState) ? 'empty' : ''}>
                    <BlockHeader>
                        <SafeInfo>
                            <img src={getTokenLogo(props.collateralName)} alt={props.collateralName} width={'50px'} />
                            <SafeData>
                                <SafeTitle>
                                    Vault <span>#{props.id}</span>
                                </SafeTitle>
                            </SafeData>
                        </SafeInfo>
                    </BlockHeader>
                    <Block>
                        <Item>
                            <Label>{`${props.collateralName} Deposited`}</Label>
                            <Value>{formatWithCommas(props.collateral)}</Value>
                        </Item>
                        <Item>
                            <Label>{`${COIN_TICKER} Borrowed`}</Label>
                            <Value>{formatWithCommas(props.totalDebt)}</Value>
                        </Item>
                        <Item>
                            <Label>{'Collateral Ratio'}</Label>
                            <Value>{`${formatWithCommas(props.collateralRatio)}%`}</Value>
                        </Item>
                        <Item>
                            <Label>{'Liquidation Price'}</Label>
                            <Value>${formatWithCommas(props.liquidationPrice)}</Value>
                        </Item>
                        <Item
                            className={
                                returnState(props.riskState) ? returnState(props.riskState).toLowerCase() : 'dimmed'
                            }
                        >
                            <Label>{'Risk'}</Label>
                            <Wrapper>
                                <div>{returnState(props.riskState) ? returnState(props.riskState) : 'Closed'}</div>
                            </Wrapper>
                        </Item>
                    </Block>
                </BlockContainer>
            </Link>
        </Container>
    )
}

export default VaultBlock

const Container = styled.div`
    transition: opacity 0.2s ease;
    &:hover {
        opacity: 0.9;
    }
`

const BlockContainer = styled.div`
    border-radius: 4px;
    margin-bottom: 29px;
    background: white;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    position: relative;
    display: flex;
    flex-direction: column;
    &.empty {
        background: white;
    }
`

const BlockHeader = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #1c293a33;
    padding-left: 34px;
    padding-top: 22px;
    padding-bottom: 11px;
    padding-right: 34px;
`

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #dadada;
    font-size: ${(props) => props.theme.font.default};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
`

const SafeInfo = styled.div`
    display: flex;
    align-items: center;
    svg {
        border-radius: ${(props) => props.theme.global.borderRadius};
        border: 1px solid ${(props) => props.theme.colors.border};
        ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 25px;
    height: 25px;
  `}
    }
`

const SafeData = styled.div`
    margin-left: 20px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: 10px;
  `}
`

const SafeTitle = styled.div`
    font-size: ${(props) => props.theme.font.large};
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const Block = styled.div`
    display: flex;
    justify-content: space-between;

    padding-left: 34px;
    padding-top: 19px;
    padding-bottom: 22px;
    padding-right: 34px;
    @media (max-width: 767px) {
        display: block;
        margin-top: 10px;
        &:last-child {
            border-bottom: 0;
        }
    }
`

const Item = styled.div`
    margin: 0 12px;
    @media (max-width: 767px) {
        display: flex;
        width: auto;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 3px 0;
        &:last-child {
            margin-bottom: 0;
        }
    }

    &.low div:last-child {
        color: #459d00;
    }

    &.elevated div:last-child {
        color: #ffaf1d;
    }

    &.high div:last-child {
        color: #e75966;
    }

    &.liquidation div:last-child {
        color: #e75966;
    }
`

const Label = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
    font-weight: 400;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`
