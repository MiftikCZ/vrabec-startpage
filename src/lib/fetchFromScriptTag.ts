
interface d {
    url:string,
    callback:string,
    document:any
}

export default function fetchFromScriptTag({url, callback, document}:d) {
    return new Promise(resolve => {
      // creating script node
      const script = document.createElement('script')
      document.querySelector('head').appendChild(script)
      script.src = url
      
      // resolve callback
      //@ts-ignore
      window[callback] = (res:any) => {
        resolve(res)
        // clean up
        script.remove()
      }
    })
  }