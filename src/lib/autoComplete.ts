import fetchFromScriptTag from "./fetchFromScriptTag"

const API_ADDRESS = 'https://www.google.com/complete/search'
interface getAutoCompleteD {
    query: string,
    locale:string,
}
export default async function ({query, locale}: getAutoCompleteD) {
    let callback = "c"+Date.now().toString()
    const params:any = {
        q: query,
        client: 'chrome-omni',
        hl: locale,
        callback: callback
      }
      
      let url = API_ADDRESS + '?'
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          url += `${key}=${encodeURIComponent(params[key])}&`
        }
      }
      let el:any = await fetchFromScriptTag({url, callback, document})
      return el[1]
}