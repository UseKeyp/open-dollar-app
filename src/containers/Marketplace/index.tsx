import { useEffect, useState } from "react"
import { getCollectionListingsData } from "~/services/opensea"
import { useStoreState } from "easy-peasy"

const Marketplace = () => {
  const [listings, setListings] = useState()

  //@ts-ignore
  const { safeModel: safeState } = useStoreState((state) => state)
  const safes = safeState.list

  useEffect(() => {
    if (!safes) return;
    const getListingData = async () => {
      const collectionListings = await getCollectionListingsData();
      console.log(collectionListings)
      const listingData = collectionListings.listings.map((listing: any, i: number) => {
        const id = listing.protocol_data.parameters.offer[0].identifierOrCriteria;
        const safe = safes.find((safe: any) => safe.id === id)
        const startTime = listing.protocol_data.parameters.startTime
        const endTime = listing.protocol_data.parameters.endTime
        return { id, safe, startTime, endTime }
      })
      setListings(listingData)
    }
    getListingData()
  }, [safes])
  console.log(listings)
  return (
    <div>

    </div>
  )
}

export default Marketplace