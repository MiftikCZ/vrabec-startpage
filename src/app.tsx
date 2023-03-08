import { useContext, useEffect, useState } from 'preact/hooks'
import './app.css'
import "../public/custom.css"
import getAutoComplete from './lib/autoComplete'
import config from "../public/config.json"


function getIt(query: string, last: string, setit: any) {
  if (last !== query) {
    getAutoComplete({ query, locale:config.search.locale }).then(e => setit(e))
    return query
  } else {
    return last
  }
}

let query = ""
let lastQuery: any = ""
let onDoneOpen = config.search.template
function parseTwoDegits(inp:number) {
  if(inp < 9.9) return `0${inp}`
  else return `${inp}`
}

function KeyBinds() {
  let [displayFromTop,setDisplayFromTop] = useState(true)
  let [hodiny,setHodiny] = useState("0:00")
  let [testik,setTestik] = useState("")

  try {
    let c:any = config
    setTestik(c.macros[query].title)
    onDoneOpen = c.macros[query].link
  } catch(error) {
    setTestik("")
    onDoneOpen = config.search.template
  }

  setInterval(()=>{
    let d = new Date()
    setHodiny(`${d.getHours()}:${parseTwoDegits(d.getMinutes())}:${parseTwoDegits(d.getSeconds())}`)
  }, 1000)

  window.addEventListener("keydown", (key) => {
    if(key.key == "c" && key.ctrlKey) {
      setDisplayFromTop(!displayFromTop)
    } else if (key.key == "Escape") {
      setDisplayFromTop(false)
    }
  })

  return (<>
  <div class="topbar_wrap" style={{
          position:"absolute",
          top: (displayFromTop ? "10px" : "-100%"),
          // left:"50%",
          left:"0%",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          width:"100%",
          // transform:"translate(-50%,0%)",
          textAlign:"center"
        }}>
          <div class="maxw">
          <div class="hint hint_bold hint_bold_dark " style={{
          position:"absolute",
          top: (displayFromTop ? "10px" : "-100%"),
          textAlign:"center"
        }}>
          <span class="doWithQuery">
          <span class="hint">{"["}{(!!testik) ? "open" : (query ? "search" : "")}{"]"}</span> {testik || "Hello "+config.user}
          </span>
          <span class="divider">{config.topbar.divider}</span>
          {hodiny}
          </div>
          </div>
        </div>
  </>)
}

export function App() {
  let [suggest, setSuggests] = useState([])
  lastQuery = getIt(query, lastQuery, setSuggests)

  function inputAdd(el: any) {
    query = el.target.value
    lastQuery = getIt(query, lastQuery, setSuggests)
  }

  function displayCompletes() {
    let wrap = document.getElementById("suggestion")
    
    if (wrap) {
      wrap.innerHTML = ""
      suggest.forEach((e: string) => {
        let el = document.createElement("div")
        el.classList.add("suggestion")
        el.addEventListener("click", ()=>{
          query = el.innerText
          let e:any = document.getElementById("maininput")
          e.value = query
        })

        el.innerHTML = e.split(query).join("<span class='selected'>" + query + "</span>")
        wrap?.appendChild(el)
      })
    }
  }

  

  let myInput = <input id="maininput" name={config.search.searchArg} placeholder={"search with "+config.search.title} type="text" value={query} class="input" onInput={inputAdd} />
  displayCompletes()
  return (
    <>
      <KeyBinds/>
        
      <div className="main">
        <form target="_blank" action={onDoneOpen.replace(/\$/gi, query) || config.search.template.replace(/\$/gi, query)}>
          {myInput}
        </form>
        <div className="suggestions" id="suggestion"></div>
      </div>
      
      {<div class="hint" style={{
        position:"absolute",
        bottom: 20,
        left:"50%",
        transform:"translate(-50%,0%)",
        textAlign:"center"
      }}>
        Try using <span class="">{"[Ctrl-C]"}</span>
      </div>}
    </>
  )
}
