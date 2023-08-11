import React, { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import Stats from './Stats'
import Button from '~/components/Button'
import useGeb from '~/hooks/useGeb'
import Accounts from './Accounts'
import VaultList from './VaultList'

const OnBoarding = ({ ...props }) => {
    const { t } = useTranslation()
    const [isOwner, setIsOwner] = useState(true)
    const { account } = useActiveWeb3React()
    const geb = useGeb()

    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { popupsModel: popupsActions, safeModel: safeActions } = useStoreActions((state) => state)

    const address: string = props.match.params.address ?? ''

    useEffect(() => {
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            connectWalletState.isWrongNetwork
        )
            return

        async function fetchSafes() {
            await safeActions.fetchUserSafes({
                address: address || (account as string),
                geb,
                tokensData: connectWalletState.tokensData,
            })
        }
        fetchSafes()
        const ms = 3000
        const interval = setInterval(() => {
            if (
                (!account && !address) ||
                (address && !isAddress(address.toLowerCase())) ||
                connectWalletState.isWrongNetwork
            )
                fetchSafes()
        }, ms)

        return () => clearInterval(interval)
    }, [account, address, connectWalletState.isWrongNetwork, connectWalletState.tokensData, geb, safeActions])

    useEffect(() => {
        if (account && address) {
            setIsOwner(account.toLowerCase() === address.toLowerCase())
        }
    }, [address, account])

    return (
        <Container id="app-page">
            <Content>
                {safeState.safeCreated && safeState.list.length ? (
                    <Stats />
                ) : <></> }
                {safeState.safeCreated ? (
                    <VaultList address={address} />
                ) : popupsState.isWaitingModalOpen ? null : (
                    <Accounts />
                )}
                {safeState.safeCreated && safeState.list.length ? (
                    <></>
                ) :  <Stats /> }
            </Content>
        </Container>
    )
}

export default OnBoarding

const Container = styled.div``

const Content = styled.div`
    position: relative;
`




