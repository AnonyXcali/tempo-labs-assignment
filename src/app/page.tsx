'use client'
import { useEffect, useState } from "react"

const URL = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"

/**
 * 
 * response example
 * 
 * {"by":"dhouston",
 * "descendants":71,"id":8863,"kids":
 * [9224,8917,8884,8887,8952,8869,8873,8958,8940,8908,9005,9671,9067,9055,
 * 8865,8881,8872,8955,10403,8903,8928,9125,8998,8901,8902,8907,8894,8870,8878
 * ,8980,8934,8943,8876],"score":104,
 * "time":1175714200,
 * "title":"My YC app: Dropbox - Throw away your USB drive","type":"story"
 * ,"url":"http://www.getdropbox.com/u/2/screencast.html"}
 */

type Story = {
  by: string,
  descendants: number,
  id: number,
  kids?: Array<number>,
  score: number,
  time: number,
  title: string,
  type: string,
  url: string,
}


export default function Home() {
  const [isFetching, setFetching] = useState(false)
  const [ids, setIds] = useState<Array<number>>([])
  const [stories, setStories] = useState<Story[] | undefined>()
  const [paginationValue, setPagination] = useState<number>(5)
  const [offset, setOffset] = useState<{
    start: number,
    end: number,
  }>({
    start: 0,
    end: 5,
  })

  useEffect(() => {
    //calling api
    const fetchData = async () => {
      const res = await fetch(URL)
      const response: Array<number> = await res.json()
      // https://hacker-news.firebaseio.com/v0/item/8863.json
      const fetchedStories: Array<Story> = []

      if(response && response.length >= 0) {
        setIds(response)
        const pageinatedIds = response.slice(offset.start, offset.end)
        //iterate over the array and fetch the resulting stories
        for(const id of pageinatedIds) {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          const storiesFetched = await res.json()
          fetchedStories.push(storiesFetched)
        }
        setStories(fetchedStories)
      }
      setFetching(false)
    }

    setFetching(true)
    fetchData()
  }, [offset])


  const handleOnSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination(parseInt(e.target.value, 10))
  }

  const handleChangeOfIds = () => {
    const updated = {
      start: offset.start + paginationValue,
      end: offset.end + paginationValue,
    }
    setOffset(updated)
  }


  return (
    <div>
      {isFetching ? (
        <p>Loading</p>
      ) : (
        <div>
          <div>
            <select
              onChange={handleOnSelect}
              value={paginationValue}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

          </div>
          <div>
            {stories && stories.map((item) => (
              <div
                key={item.id}
              >
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={handleChangeOfIds}
        >
          Next
        </button>
      </div>
    </div>
  );
}
