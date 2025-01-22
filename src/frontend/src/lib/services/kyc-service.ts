const sha256 = require('js-sha256');
import { SHUFTI_CLIENT_ID, SHUFTI_SECRET_KEY } from "$lib/environment/environment";

interface Payload {
  reference: string;
  callback_url: string;
  email: string;
  country: string;
  language: string;
  verification_mode: string;
  allow_offline: string;
  allow_online: string;
  show_privacy_policy: string;
  show_results: string;
  show_consent: string;
  show_feedback_form: string;
  document?: {
    name: string;
    dob: string;
    document_number: string;
    expiry_date: string;
    issue_date: string;
    fetch_enhanced_data: string;
    supported_types: string[];
  };
}

export class KYCService {
  
  constructor() {
  
  }

  async validateSignature(
    data: Record<string, unknown>,
    signature: string | null,
    secretKey: string
  ): Promise<boolean> {
    if (!signature) return false;

    let stringifiedData = JSON.stringify(data);
    stringifiedData = stringifiedData.replace(/\//g, "\\/");
    const dataWithKey = `${stringifiedData}${sha256(secretKey)}`;
    const computedSignature = sha256(dataWithKey);

    return computedSignature === signature;
  }

  async sendRequest(payload: Payload) {
    try {

      const token = btoa(`${SHUFTI_CLIENT_ID}:${SHUFTI_SECRET_KEY}`);
      let responseSignature: string | null = null;
      
      const response = await fetch('https://api.shuftipro.com/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
        },
        body: JSON.stringify(payload),
      });

      responseSignature = response.headers.get('Signature');
      const data = await response.json();

      if (await this.validateSignature(data, responseSignature, SHUFTI_SECRET_KEY)) {
        console.log('Signature validated', data);
      } else {
        console.log('Signature not validated', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}