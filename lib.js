const web3 = require('@solana/web3.js');




class Web3 {
    constructor() {
        this.url = "http://localhost:8899";
        this.connection = new web3.Connection(this.url, 'confirmed');
        this.keypair = new web3.Keypair();
    }

    async connect() {
        try {
            const version = await this.connection.getVersion();

            return { status: 200, data: version };
        }

        catch (error) {
            let errorMessage = error instanceof Error ? error.message : "Unknown Error";

            return { status: 500, error: errorMessage }

        }
    }

    async returnKeypair() {
        try {
            const publicKey = this.keypair.publicKey.toString();

            const secretKey = Array.from(this.keypair.secretKey);

            return { status: 200, data: { "public key": publicKey, "secret key": secretKey } }
        }
        catch (error) {
            let errorMessage = error instanceof Error ? error.message : "Unknown Error";

            return { status: 500, error: errorMessage }
        }
    }

    async fundAction(address) {
        try {

            const publicKey = new web3.PublicKey(address);

            const hash = await this.connection.requestAirdrop(
                publicKey,
                web3.LAMPORTS_PER_SOL
            )

            const latestBlockHash = await this.connection.getLatestBlockhash();

            await this.connection.confirmTransaction({
                blockhash: latestBlockHash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: hash
            });

            return { data: { "message": "account funded", address }, status: 200 }
        }

        catch (error) {
            let errorMessage = error instanceof Error ? error.message : "Unknown Error";

            return { status: 500, error: errorMessage }
        }
    }

    async getBalance(address) {
        try {
            const publicKey = new web3.PublicKey(address);

            const balance = await this.connection.getBalance(publicKey);

            if (balance === 0 || balance == undefined) {
                throw new Error("Account not funded");
            }

            return { status: 200, balance: balance }
        }

        catch (error) {
            let errorMessage = error instanceof Error ? error.message : "Unknown Error";

            return { status: 500, error: errorMessage }
        }
    }

    async transfer(recipient, lamports) {
        try {

            const fromPubkey = new PublicKey(this.keypair.publicKey);
            const toPubkey = new PublicKey(recipient);
            const secretKey = Uint8Array.from(JSON.parse(this.keypair.secretKey));
            const instructions = web3.SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports
            });

            const signers = [{
                publicKey: fromPubkey,
                secretKey,
            }];

            const transaction = new Transaction().add(instructions);

            const hash = await web3.sendAndConfirmRawTransaction(this.connection, transaction, signers);

            return { status: 200, "hash": hash ,"message":`Transferred ${lamports} to address ${recipient}`};

        } catch (error) {
            let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
            return { "status": 500, "error": errorMessage };
        }
    }
}



module.exports = { Web3 }