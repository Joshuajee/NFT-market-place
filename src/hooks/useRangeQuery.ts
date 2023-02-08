import { useEffect, useState } from "react"

const useRangeQuery = (start: number, limit: number) => {


    const [trueLimit, setTrueLimit] = useState(limit)

    useEffect(() => {
        if ((start - limit) < 0) setTrueLimit(start)
    }, [start, limit])


    return trueLimit
}

export default useRangeQuery