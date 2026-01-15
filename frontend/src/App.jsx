import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ====== CONFIG ======
const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS";
const CONTRACT_ABI = [
  "function issueCertificate(address to, string memory tokenURI) public",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
];

export default function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const [studentAddress, setStudentAddress] = useState("");
  //const [tokenURI, setTokenURI] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [verifyId, setVerifyId] = useState("");
  const [verified, setVerified] = useState(null);

  // ====== CONNECT WALLET ======
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    const prov = new ethers.BrowserProvider(window.ethereum);
    const signer = await prov.getSigner();
    const addr = await signer.getAddress();
    const certContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    setProvider(prov);
    setAccount(addr);
    setContract(certContract);
  }

  // ====== ISSUE CERTIFICATE ======
  async function issueCertificate() {
  try {
    const tx = await contract.issueCertificate(studentAddress, metadataURI);
    await tx.wait();
    alert("Certificate issued successfully!");
  } catch (err) {
    console.error(err);
    alert("Issuance failed");
  }
}


  // ====== VERIFY CERTIFICATE ======
  async function verifyCertificate() {
  try {
    const owner = await contract.ownerOf(verifyId);
    const uri = await contract.tokenURI(verifyId);

    const res = await fetch(uri);
    const metadata = await res.json();

    setVerified({ owner, metadata });
  } catch (err) {
    console.error(err);
    alert("Invalid Certificate ID");
  }
}


  return (
  <div className="min-h-screen bg-slate-300 font-sans">
    
    {/* Header */}
    <header className="bg-slate-900 text-white text-center py-8">
      <h1 className="text-3xl font-bold">
        Skill-Backed Campus Certificates
      </h1>
      <p className="mt-2 text-slate-300">
        Instant • Verifiable • Student-Owned
      </p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="mt-6 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mt-4 text-sm text-slate-300">
          Connected: {account}
        </p>
      )}
    </header>

    {/* Main */}
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Issue Certificate */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-1">
          Issue Certificate
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Organizer-only action
        </p>

        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Student Wallet Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="Metadata URI (Firebase / IPFS)"
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
        />

        <button
          onClick={issueCertificate}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Issue Certificate
        </button>
      </section>

      {/* Verify Certificate */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-1">
          Verify Certificate
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Public verification
        </p>

        <input
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="Certificate Token ID"
          value={verifyId}
          onChange={(e) => setVerifyId(e.target.value)}
        />

        <button
          onClick={verifyCertificate}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Verify
        </button>

        {verified && (
          <div className="mt-4 bg-slate-100 rounded-lg p-4">
            <h3 className="font-semibold text-green-700">
              Certificate Verified
            </h3>

            <p className="text-sm mt-2">
              <strong>Owner:</strong> {verified.owner}
            </p>

            <p className="mt-2">
              <strong>{verified.metadata.name}</strong>
            </p>

            <p className="text-sm text-slate-600">
              {verified.metadata.description}
            </p>

            <ul className="mt-2 list-disc list-inside text-sm">
              {verified.metadata.skills?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

    </main>

    {/* Footer */}
    <footer className="text-center text-sm text-slate-500 py-4">
      Built for HackSync • GDG On Campus • Powered by Google & Blockchain
    </footer>
  </div>
)
;
}
