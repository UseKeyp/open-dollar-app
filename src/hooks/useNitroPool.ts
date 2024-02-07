import { useEffect, useMemo, useCallback, useState } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { fetchNitroPool, NitroPoolDetails } from '@opendollar/sdk'
import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from './useActiveWeb3React'
import useGeb from './useGeb'
import { ParsedNitroPool } from '~/types'

export const useNitroPool = () => {
    const geb = useGeb()
    const { account } = useActiveWeb3React()

    const [nitroPools, setNitroPools] = useState<{ [symbol: string]: ParsedNitroPool }>({})

    const {
        depositModel: { depositTokens, nitroPoolDetails },
    } = useStoreState((state) => state)
    const {
        depositModel: { setNitroPoolDetails },
    } = useStoreActions((actions) => actions)

    const depositTokensData = useMemo(() => {
        if (!geb) return []

        return Object.keys(geb.tokenList)
            .filter((token) => depositTokens.has(token))
            .map((token) => geb.tokenList[token])
    }, [depositTokens, geb])

    const getParsedNitroPool = useCallback(
        (pool: NitroPoolDetails, collateralToken: string): ParsedNitroPool => {
            if (!pool || !geb?.tokenList || !geb?.contracts) {
                return {}
            }

            const { tvl, apy, userInfo, settings } = pool

            const now = Date.now()

            const startTimeMs = settings.startTime.toNumber() * 1000
            const endTimeMs = settings.endTime.toNumber() * 1000
            const depositEndTimeMs = settings.depositEndTime.toNumber() * 1000
            const harvestStartTime = settings.harvestStartTime.toNumber() * 1000
            const lockDuration = settings.lockDurationReq.toNumber() * 1000
            const lockUntil = settings.lockEndReq.toNumber() * 1000

            const rewardTokenData = geb.tokenList.ODG
            const collateralTokenData = geb.tokenList[collateralToken]

            // TODO: Replace with actual pending rewards
            const poolPendingRewards =
                userInfo?.pendingRewardsToken1 &&
                formatUnits(userInfo.pendingRewardsToken1, rewardTokenData.decimals).toString()

            const userDeposit =
                userInfo?.totalDepositAmount &&
                formatUnits(userInfo.totalDepositAmount, collateralTokenData.decimals).toString()

            const userRewards =
                userInfo?.pendingRewardsToken1 &&
                formatUnits(userInfo.pendingRewardsToken1, rewardTokenData.decimals).toString()

            // @ts-ignore
            // TODO: Find safer way to retrieve contract without using ts-ignore
            const nitroPoolAddress = geb.contracts[`camelot${collateralToken}NitroPool`].address

            return {
                pool: {
                    tvl,
                    apr: apy,
                    address: nitroPoolAddress,
                    isActive: endTimeMs > now,
                    duration: endTimeMs - startTimeMs,
                    endsIn: endTimeMs > now ? endTimeMs - now : 0,
                    pendingRewards: poolPendingRewards || '0',
                    authorizations: {
                        depositsEnabled: !depositEndTimeMs || depositEndTimeMs > now,
                        depositsEndIn: depositEndTimeMs > now ? depositEndTimeMs - now : 0,
                        harvestsEnabled: harvestStartTime < now,
                    },
                    requirements: {
                        lockDuration,
                        lockUntil,
                        whitelist: settings.whitelist,
                    },
                },
                user: {
                    deposit: userDeposit,
                    pendingRewards: userRewards,
                    // TODO: Clarify if this is different from the pool's APR
                    averageApr: apy,
                },
                tokens: {
                    reward: rewardTokenData,
                    collateral: collateralTokenData,
                },
            }
        },
        [geb?.contracts, geb?.tokenList]
    )

    const fetchPoolDetails = useCallback(async () => {
        if (!geb || !account) return

        const fetchedNitroPoolDetails = await Promise.all(
            Array.from(depositTokensData).map(async ({ symbol }) => ({
                // TODO: Improve this type casting hack
                [symbol]: await fetchNitroPool(
                    geb,
                    symbol as 'WSTETH' | 'RETH',
                    '0x8cc44a3Fe63E844f37CeE1C91f7b5bc4aD26639e'
                ),
            }))
        )

        setNitroPoolDetails(Object.assign({}, ...fetchedNitroPoolDetails))
    }, [account, depositTokensData, geb, setNitroPoolDetails])

    const setParsedNitroPools = useCallback(() => {
        for (const [symbol, poolDetails] of Object.entries(nitroPoolDetails)) {
            setNitroPools((prev) => ({
                ...prev,
                [symbol]: getParsedNitroPool(poolDetails, symbol),
            }))
        }
    }, [nitroPoolDetails, getParsedNitroPool])

    useEffect(() => {
        fetchPoolDetails()

        // Interval used for fetching pool details every 10 seconds
        const interval = setInterval(() => {
            fetchPoolDetails()
        }, 10000)

        return () => clearInterval(interval)
    }, [fetchPoolDetails])

    useEffect(() => {
        setParsedNitroPools()

        // Interval used for date and countdown updates. Updates every second
        const interval = setInterval(() => {
            setParsedNitroPools()
        }, 1000)

        return () => clearInterval(interval)
    }, [setParsedNitroPools])

    return [nitroPools, fetchPoolDetails] as const
}
