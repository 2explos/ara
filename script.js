/* Base Chain Explorer (lite)
 * Read-only helpers: latest block, gas price, balance, tx list
 * RPC: Base mainnet; Tx list: Blockscout public API (no key)
 */

const RPC = "https://mainnet.base.org";
const provider = new ethers.JsonRpcProvider(RPC);

// Small helpers
const $ = (sel) => document.querySelector(sel);
const fmtEth = (wei) => `${ethers.formatEther(wei)} ETH`;
const short = (s, n = 6) => s ? `${s.slice(0,n)}…${s.slice(-4)}` : "";

async function showLatestBlock() {
  const [blockNumber, network] = await Promise.all([
    provider.getBlockNumber(),
    provider.getNetwork(),
  ]);
  $("#latest-out").textContent = `Block: ${blockNumber} — ChainId: ${Number(network.chainId)} (Base)`;
  $("#network-info").textContent = `RPC: ${RPC}`;
}

async function showGasPrice() {
  const gas = await provider.getGasPrice();
  $("#latest-out").textContent = `Gas price: ${ethers.formatUnits(gas, "gwei")} gwei`;
}

async function showBalance() {
  const addr = $("#addr").value.trim();
  if (!ethers.isAddress(addr)) {
    $("#balance-out").textContent = "Invalid address.";
    return;
  }
  const bal = await provider.getBalance(addr);
  $("#balance-out").textContent = `Balance of ${addr}: ${fmtEth(bal)}`;
}

// Use Blockscout API to fetch latest txs of address (no key needed)
async function showTxs() {
  const addr = $("#addr").value.trim();
  if (!ethers.isAddress(addr)) {
    $("#txs-out").innerHTML = `<p>Invalid address.</p>`;
    return;
  }
  const url = `https://base.blockscout.com/api?module=account&action=txlist&address=${addr}&sort=desc&page=1&offset=10`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.status !== "1" || !Array.isArray(data.result)) {
    $("#txs-out").innerHTML = `<p>No transactions found or API error.</p>`;
    return;
  }

  const rows = data.result.map(tx => {
    const val = fmtEth(tx.value);
    const dir = (tx.from?.toLowerCase() === addr.toLowerCase()) ? "OUT" : "IN";
    return `
      <tr>
        <td class="mono">${tx.blockNumber}</td>
        <td>${dir}</td>
        <td class="mono">${short(tx.hash)}</td>
        <td class="mono">${short(tx.from)}</td>
        <td class="mono">${short(tx.to)}</td>
        <td class="mono">${val}</td>
        <td class="mono">${new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
      </tr>
    `;
  }).join("");

  $("#txs-out").innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Block</th><th>Dir</th><th>Tx</th><th>From</th><th>To</th><th>Value</th><th>Time</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted">Source: base.blockscout.com API (last 10 txs).</p>
  `;
}

// Wire UI
$("#btn-latest").addEventListener("click", showLatestBlock);
$("#btn-gas").addEventListener("click", showGasPrice);
$("#btn-balance").addEventListener("click", showBalance);
$("#btn-txs").addEventListener("click", showTxs);

// Initial
showLatestBlock().catch(console.error);
