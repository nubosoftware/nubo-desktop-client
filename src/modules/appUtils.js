import appData from "./appData";
import axios from "axios";

const appUtils = {


    req: async (options) => {
        if (!options.headers) {
            options.headers = {};
        }
        // console.log(`url: ${options.url}`);
        if (options.url.startsWith("client/") && !options.url.startsWith("client/auth/") && appData.loginToken && appData.activationPrivateKey) {
            const loginToken = appData.loginToken;
            let privKey = appData.privKeyCache;
            if (!privKey) {
                const privKeyData = JSON.parse(appData.activationPrivateKey);
                const buffer = base64ToUint8Array(privKeyData.buffer);
                privKey = await crypto.subtle.importKey("pkcs8",buffer,privKeyData.options,false,["sign"]);
                appData.privKeyCache = privKey;
            }
            const jwtToken = await appUtils.signJwt({ loginToken },privKey,{});
            options.headers['Authorization'] = `OAuth ${loginToken}:${jwtToken}`;
            // console.log(`Authorization: ${options.headers['Authorization']}`);
        }
        if (appData.postURL && appData.postURL != "") {
            options.url = appData.postURL + options.url;
        }
        if (appData.proxyURL && appData.proxyURL != "") {
            options.url = appData.proxyURL + options.url;
        }
        if (!options.method) {
            options.method = "get";
        }
        
        
        /*if (appData.adminLoginToken && appData.adminLoginToken != "") {
            options.headers['Authorization'] = `OAuth ${appData.adminLoginToken}`;
        }*/
        //console.log(options);
        return axios(options);
    },
    post: (options) => {
        options.method = "post";
        return appUtils.req(options);
    },
    get: (options) => {
        options.method = "get";
        return appUtils.req(options);
    },
    put: (options) => {
        options.method = "put";
        return appUtils.req(options);
    },
    delete: (options) => {
        options.method = "delete";
        return appUtils.req(options);
    },
    getWebCommon: function() {
        return new Promise((resolve, reject) => {
            if (appData.webCommon) {
                resolve();
                return;
            }
            appUtils
            .get({
                url: "getWebCommon"
            })
            .then((response) => {
                console.log(`getWebCommon ressponse`);
                console.log(response.data);
                /*appData.disableSignup = response.data.disableSignup;
                appData.edition = response.data.edition;*/
                appData.webCommon = response.data;
                resolve();
                
            })
            .catch((error) => {
                console.log(error)
                reject(error);
            });
            
        });   
    },
    
    generateKeyPair: async function() {      
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign', 'verify']
        );
        const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        const privateKeyPem = toPem(privateKeyBuffer, 'private');

        const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        const publicKeyPem = toPem(exportedPublicKey, 'public');

        
        return {
            privateKey: privateKeyPem,
            publicKey: publicKeyPem,
            keyPair: keyPair,
            privateKeyExport: {
                options: {
                    name: 'ECDSA',
                    namedCurve: 'P-256'
                },
                buffer: arrayBufferToBase64(privateKeyBuffer)
            }
        }
    },
    signJwt: async function (tokenPayload, /*issuer,*/ privateKey, algorithmOptions) {
        const header = {
            alg: algorithmOptions.algorithm || 'ES256',
            typ: 'JWT',
            kid: "desktop_key"//issuer.publicKeys[0].keyId,
        };

        const nowInSeconds = Math.floor(Date.now() / 1000);

        const payload = {
            iss: "nubo-desktop-client",
            iat: nowInSeconds,
            expiresIn: "1h",
            ...tokenPayload,
        };

        const stringifiedHeader = JSON.stringify(header);
        const stringifiedPayload = JSON.stringify(payload);

        const headerBase64 = uint8ArrayToString(stringToUint8Array(stringifiedHeader));
        const payloadBase64 = uint8ArrayToString(stringToUint8Array(stringifiedPayload));
        const headerAndPayload = `${headerBase64}.${payloadBase64}`;

        const messageAsUint8Array = stringToUint8Array(headerAndPayload);

        const signature = await crypto.subtle.sign(
            {
                name: algorithmOptions.name || 'ECDSA',
                hash: algorithmOptions.hash || 'SHA-256',
            },
            privateKey,
            messageAsUint8Array
        );

        const base64Signature = uint8ArrayToString(new Uint8Array(signature));

        return `${headerAndPayload}.${base64Signature}`;
    },
  
    
}

function arrayBufferToBase64(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    byteArray.forEach((byte) => {
      byteString += String.fromCharCode(byte);
    });
    return btoa(byteString);
  }
  
  function breakPemIntoMultipleLines(pem) {
    const charsPerLine = 64;
    let pemContents = '';
    while (pem.length > 0) {
      pemContents += `${pem.substring(0, charsPerLine)}\n`;
      pem = pem.substring(64);
    }
    return pemContents;
  }
  function base64ToUint8Array(base64Contents) {
    base64Contents = base64Contents.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    const content = atob(base64Contents);
    return new Uint8Array(content.split('').map((c) => c.charCodeAt(0)));
  }
  
  function stringToUint8Array(contents) {
    const encoded = btoa(unescape(encodeURIComponent(contents)));
    return base64ToUint8Array(encoded);
  }
  
  function uint8ArrayToString(unsignedArray) {
    const base64string = btoa(String.fromCharCode(...unsignedArray));
    return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  function toPem (key, type) {
    const pemContents = breakPemIntoMultipleLines(arrayBufferToBase64(key));
    return `-----BEGIN ${type.toUpperCase()} KEY-----\n${pemContents}-----END ${type.toUpperCase()} KEY-----`;
  }

export default appUtils