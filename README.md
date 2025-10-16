# Base Chain Explorer (lite)

Tiny, no-build explorer for **Base Mainnet**:
- Latest block & gas price (RPC)
- Address balance (RPC)
- Last 10 transactions of an address (Blockscout API – no key)

## Run (static)
Open `index.html` locally, or host on GitHub Pages / Vercel / Netlify.  
No server required.

## Tech
- Ethers v6 (CDN)
- RPC: `https://mainnet.base.org`
- Tx list: `https://base.blockscout.com/api?module=account&action=txlist&...`

## Notes
- Read-only; no private keys used
- CORS is allowed by Blockscout API at the time of writing
- Feel free to submit PRs (pagination, ENS, CSV export, etc.)

## License
MIT

## Roadmap
- [ ] Pagination (Next/Prev 10 txs)
- [ ] CSV export
- [ ] Base Sepolia switch
