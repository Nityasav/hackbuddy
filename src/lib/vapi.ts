export const initiateCall = async (phoneNumber: string, email: string) => {
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
    
    // Use your new assistant ID - bypass any environment variables or caching
    const NEW_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

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
    console.log('Using assistant ID:', NEW_ASSISTANT_ID);
    
    // Create a new call using Vapi
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: NEW_ASSISTANT_ID,
        phoneNumber: {
          twilioAccountSid,
          twilioAuthToken,
          twilioPhoneNumber,
          name: 'Team Finder Call'
        },
        customer: {
          number: formattedPhoneNumber,
          name: 'Team Finder Customer',
          numberE164CheckEnabled: true
        }
      })
    });

    const data = await response.json();
    const callId = data.id;
    
    // Log the entire response for debugging
    console.log('Full Vapi response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Vapi API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      const errorMessage = data.message || data.error || data.details || 'Failed to initiate call';
      throw new Error(`Vapi API Error (${response.status}): ${errorMessage}`);
    }

    if (!data.id) {
      console.error('Invalid Vapi API Response:', data);
      throw new Error('No call ID received from Vapi API');
    }

    // Start polling every minute after 3 minutes to check the call status
    let callStatus = 'in-progress'; // Initial call status
    const checkStatusInterval = 60 * 1000; // 1 minute
    let elapsedTime = 0; // in milliseconds

    const checkCallStatus = async () => {
      const statusResponse = await getCallStatus(callId);
      if (statusResponse.success) {
        callStatus = statusResponse.status;
      }

      return callStatus;
    };

    // Poll for the call status after 3 minutes
    const waitFor3Minutes = new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000)); // 3 minutes in ms
    await waitFor3Minutes;

    // Poll every minute after the first 3 minutes
    while (callStatus === 'in-progress') {
      console.log('Checking call status...');
      const status = await checkCallStatus();

      if (status === 'completed') {
        console.log('Call has ended, sending transcript request...');
        await sendTranscriptRequest(callId, email);
        break;
      }

      elapsedTime += checkStatusInterval;
      if (elapsedTime >= 5 * 60 * 1000) { // 5 minutes of polling (up to 8 minutes total)
        console.log('Call is taking too long, stopping the checks.');
        break;
      }

      await new Promise(resolve => setTimeout(resolve, checkStatusInterval)); // wait for 1 minute
    }

    return { success: true, callId };
  } catch (error) {
    console.error('Error initiating call:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to initiate call'
    };
  }
};

const sendTranscriptRequest = async (callId: string, email: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/sendTranscript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call_id: callId,
        email: email
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Transcript request sent successfully:', data);
    } else {
      console.error('Error sending transcript request:', data);
    }
  } catch (error) {
    console.error('Error sending transcript request:', error);
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
