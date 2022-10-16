/**
 * Asynchronous loader for external scripts
 * @param {string} src - script url address
 * @returns {Promise}
 */
const loadSdkScript = src => {
  const loader = new Promise((resolve, reject) => {
    if (window.google) return resolve(window.google)
    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.src = src
    script.onload = () => resolve(window.google)
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loader
}

export default loadSdkScript
