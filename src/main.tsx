import { render } from 'preact'
import { App } from './app'
import './index.css'
import "@fontsource/ibm-plex-mono"


async function main() {
    render((<>
    
    <App />
    </>), document.getElementById('app') as HTMLElement)
}

main()
