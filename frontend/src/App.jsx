import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ====== CONFIG ======
const CONTRACT_ADDRESS = "0x0xD16361a22CC9Fa852dbd12a46db7238e0994E549";
const CONTRACT_ABI = [
  "function issueCertificate(address to, string memory tokenURI) public",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
];

export default function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [metadataURI, setMetadataURI] = useState("");


  const [studentAddress, setStudentAddress] = useState("");
  //const [tokenURI, setTokenURI] = useState("");
  //const [metadataURI, setMetadataURI] = useState("");
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
  <div className="min-h-screen bg-teal-900 font-sans">
    
    {/* Header */}
    <header className="bg-linear-to-r from-emerald-500 to-lime-200 text-white text-center py-10 shadow-md">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Skill-Backed Campus Certificates
      </h1>
      <p className="mt-3 text-lime-900">
        Instant • Verifiable • Student-Owned
      </p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="mt-6 px-6 py-2 bg-lime-900 text-white font-semibold rounded-lg hover:bg-lime-100 hover:text-black transition shadow"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mt-4 text-sm text-lime-200 break-all">
          Connected: {account}
        </p>
      )}
    </header>

    {/* Main */}
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Issue Certificate */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-500">
        <h2 className="text-xl font-semibold text-lime-700 mb-1">
          Issue Certificate
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Organizer-only action
        </p>

        <input
          className="w-full border border-slate-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-lime-500"
          placeholder="Student Wallet Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
        />

        <input
          className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
          placeholder="Metadata URI (Firebase / IPFS)"
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
        />

        <button
          onClick={issueCertificate}
          className="w-full bg-teal-900 text-white py-2 rounded-lg font-medium hover:bg-lime-700 transition"
        >
          Issue Certificate
        </button>
      </section>

      {/* Verify Certificate */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-500">
        <h2 className="text-xl font-semibold text-lime-700 mb-1">
          Verify Certificate
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Public verification
        </p>

        <input
          className="w-full border border-slate-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
          placeholder="Certificate Token ID"
          value={verifyId}
          onChange={(e) => setVerifyId(e.target.value)}
        />

        <button
          onClick={verifyCertificate}
          className="w-full bg-teal-900 text-white py-2 rounded-lg font-medium hover:bg-lime-700 transition"
        >
          Verify
        </button>

        {verified && (
          <div className="mt-4 bg-lime-50 border border-lime-200 rounded-lg p-4">
            <h3 className="font-semibold text-lime-700">
              Certificate Verified
            </h3>

            <p className="text-sm mt-2 break-all">
              <strong>Owner:</strong> {verified.owner}
            </p>

            <p className="mt-2 font-medium">
              {verified.metadata.name}
            </p>

            <p className="text-sm text-slate-600">
              {verified.metadata.description}
            </p>

            <ul className="mt-2 list-disc list-inside text-sm text-slate-700">
              {verified.metadata.skills?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

    </main>

    {/* Footer */}
    <footer className="text-center text-sm text-slate-300 py-6">
      Built for HackSync • GDG On Campus • Powered by Google & Blockchain
    </footer>
  </div>
);

;
}
