export function findSharedActors(onProgress) {
  return new Promise((resolve, reject) => {
    const es = new EventSource('/api/shared-actors')

    es.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'progress') {
        onProgress?.(msg.message)
      } else if (msg.type === 'result') {
        es.close()
        resolve(msg.data)
      } else if (msg.type === 'error') {
        es.close()
        reject(new Error(msg.message))
      }
    }

    es.onerror = () => {
      es.close()
      reject(new Error('Connection to server lost'))
    }
  })
}
