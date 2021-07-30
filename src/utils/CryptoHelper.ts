import * as crypto from 'crypto';

/**
 * This is a simple crypto util only for JSON Syntax object.
 */
export class CryptoHelper {

	// * we choice AES-256 CTR, reference: https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_(CTR)
	protected static readonly algorithm: string = 'aes-256-ctr';

	// * just generated a secret key randomly by my script
	protected static readonly secretKey: string = '6pnEGKkBwBYgrzbyJVjmNIVETeWohYU2';

	// * initialization vector for encrypt
	protected static readonly iv = crypto.randomBytes( 16 );

	// * when the script do encrypt, it will use this separateChar to concat cipher iv and encrypted content
	protected static readonly separateChar: string = '_';

	/**
	 * Encrypt targer object
	 * @param encryptObject Object what we want to encrypt
	 * @returns encrypted object as string
	 */
	public static encrypt<T> ( encryptObject: T ): string {
		if ( !encryptObject ) {
			console.warn( '[CryptoHelper] You coundn\'t encrypt undefined or null!!' );
			return '';
		}

		try {
			const encryptText: string = JSON.stringify( encryptObject );
			const cipher = crypto.createCipheriv(
				CryptoHelper.algorithm,
				CryptoHelper.secretKey,
				CryptoHelper.iv
			);
			const textBuffer = Buffer.from( encryptText, 'utf8' );
			const encrypted = Buffer.concat( [
				cipher.update( textBuffer ),
				cipher.final()
			] );

			return `${ CryptoHelper.iv.toString( 'hex' ) }${ CryptoHelper.separateChar }${ encrypted.toString( 'hex' ) }`;
		} catch ( e ) {
			console.warn( e );
			return '';
		}
	}

	/**
	 * Decrypt encrypted object
	 * @param encryptedText encrypted text
	 * @returns decrypted Object
	 */
	public static decrypt<T> ( encryptedText: string ): T | undefined {
		if ( !encryptedText ) {
			console.warn( '[CryptoHelper] You coundn\'t decrypt undefined or null!!' );
			return undefined;
		}

		const separated: Array<string> = encryptedText.split( CryptoHelper.separateChar );
		if ( !separated || separated.length !== 2 ) {
			console.warn( '[CryptoHelper] Your format of input encrypted text is not correct!!' );
			return undefined;
		}

		const decipher = crypto.createDecipheriv(
			CryptoHelper.algorithm,
			CryptoHelper.secretKey,
			Buffer.from( separated[ 0 ], 'hex' )
		);
		const decrpyted = Buffer.concat( [
			decipher.update( Buffer.from( separated[ 1 ], 'hex' ) ),
			decipher.final()
		] );

		let decryptedObj: T;
		try {
			decryptedObj = JSON.parse( decrpyted.toString() );
		} catch ( e ) {
			decryptedObj = decrpyted.toString() as unknown as T;
		}

		return decryptedObj;
	}

}
