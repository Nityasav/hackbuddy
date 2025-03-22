// Remove unused import and client initialization
export const initiateCall = async (phoneNumber: string) => {
  try {
    // Remove any non-digit characters from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Format phone number to E.164 format (required by Twilio)
    const formattedPhoneNumber = `+1${cleanPhoneNumber}`;
    
    // Get the API key and Twilio credentials
    const apiKey = import.meta.env.VITE_VAPI_API_KEY;
    const twilioAccountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const twilioAuthToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

    if (!apiKey) {
      console.error('Vapi API key is not set in environment variables');
      throw new Error('Vapi API key is not configured');
    }

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error('Twilio credentials are not set in environment variables');
      throw new Error('Twilio credentials are not configured');
    }
    
    // Log the request details for debugging
    console.log('Initiating call with phone number:', formattedPhoneNumber);
    console.log('Using API key:', apiKey.substring(0, 4) + '...');
    
    // Create a new call using Vapi
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: {
          twilioAccountSid,
          twilioAuthToken,
          twilioPhoneNumber,
          name: 'Team Finder Call',
          assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID,
          server: {
            url: import.meta.env.VITE_SERVER_URL,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        },
        customer: {
          number: formattedPhoneNumber,
          name: 'Team Finder Customer',
          numberE164CheckEnabled: true
        },
        assistant: {
          name: 'Team Finder Agent',
          model: {
            provider: 'openai',
            model: 'gpt-4-turbo-preview',
          },
          voice: {
            provider: 'azure',
            voiceId: 'en-US-JennyNeural',
          },
          firstMessage: 'Hello! I\'m your Team Finder agent. I\'ll be conducting a brief interview to help match you with the perfect teammates for your next hackathon. Are you ready to begin?'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vapi API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Extract error message from the response
      const errorMessage = data.message || data.error || data.details || 'Failed to initiate call';
      throw new Error(`Vapi API Error (${response.status}): ${errorMessage}`);
    }

    if (!data.id) {
      console.error('Invalid Vapi API Response:', data);
      throw new Error('No call ID received from Vapi API');
    }

    return { success: true, callId: data.id };
  } catch (error) {
    console.error('Error initiating call:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to initiate call'
    };
  }
};

export const getCallStatus = async (callId: string) => {
  try {
    const apiKey = import.meta.env.VITE_VAPI_API_KEY;
    if (!apiKey) {
      console.error('Vapi API key is not set in environment variables');
      throw new Error('Vapi API key is not configured');
    }

    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vapi API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(data.message || data.error || 'Failed to get call status');
    }

    return { success: true, status: data.status };
  } catch (error) {
    console.error('Error getting call status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get call status'
    };
  }
}; 