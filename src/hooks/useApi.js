import { useState, useEffect, useCallback, useRef } from 'react'

export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fnRef = useRef(fetchFn)
  fnRef.current = fetchFn

  const run = useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    fnRef.current()
      .then((result) => {
        if (active) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Something went wrong')
          setLoading(false)
        }
      })
    return () => { active = false }
  }, deps)

  useEffect(() => {
    const cleanup = run()
    return cleanup
  }, [run])

  return { data, loading, error, refetch: run, setData }
}

export function useApiMutation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (fn, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn(...args)
      setLoading(false)
      return result
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
      throw err
    }
  }, [])

  return { mutate, loading, error, setError }
}
