// Serverless Function for Buttondown Newsletter Subscription
// Deploy this to Netlify Functions or Vercel Serverless Functions
// 
// For Netlify: Place in /netlify/functions/subscribe-newsletter.js
// For Vercel: Place in /api/subscribe-newsletter.js

// This function will be called when a user signs up
// It automatically adds them to your Buttondown email list

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { email, name } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Call Buttondown API
    // Get your API key from: https://buttondown.email/settings
    const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;

    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        metadata: {
          source: 'survivaltrait-website',
          signup_date: new Date().toISOString()
        },
        tags: ['website-member']
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Buttondown errors
      if (response.status === 409) {
        // Subscriber already exists - this is okay
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Already subscribed',
            alreadySubscribed: true 
          })
        };
      }

      throw new Error(data.message || 'Failed to subscribe');
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Successfully subscribed to newsletter',
        subscriber: data
      })
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to subscribe to newsletter',
        details: error.message 
      })
    };
  }
};

/* 
DEPLOYMENT INSTRUCTIONS:

1. NETLIFY:
   - Create a /netlify/functions/ directory in your project
   - Save this file as: /netlify/functions/subscribe-newsletter.js
   - Add BUTTONDOWN_API_KEY to Netlify environment variables:
     * Go to Site Settings → Environment Variables
     * Add: BUTTONDOWN_API_KEY = your_api_key_here
   - Deploy to Netlify
   - Function will be available at: https://yourdomain.com/.netlify/functions/subscribe-newsletter

2. VERCEL:
   - Create an /api/ directory in your project
   - Save this file as: /api/subscribe-newsletter.js
   - Update the export to:
     export default async function handler(req, res) { ... }
   - Add BUTTONDOWN_API_KEY to Vercel environment variables:
     * Go to Project Settings → Environment Variables
     * Add: BUTTONDOWN_API_KEY = your_api_key_here
   - Deploy to Vercel
   - Function will be available at: https://yourdomain.com/api/subscribe-newsletter

3. UPDATE auth.js:
   - Uncomment the subscribeToNewsletter() function
   - Update the fetch URL to match your deployment:
   
   async function subscribeToNewsletter(email) {
     try {
       const response = await fetch('/.netlify/functions/subscribe-newsletter', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: email })
       });
       
       const data = await response.json();
       console.log('Newsletter subscription:', data);
     } catch (error) {
       console.error('Newsletter subscription error:', error);
       // Don't block signup if newsletter fails
     }
   }

4. CALL IT ON SIGNUP:
   - In auth.js, find the signUp() function
   - After successful signup, uncomment this line:
     await subscribeToNewsletter(email);

TESTING:
   - Use curl or Postman to test:
   
   curl -X POST https://yourdomain.com/.netlify/functions/subscribe-newsletter \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'

SECURITY NOTES:
   - Never expose your Buttondown API key in frontend code
   - Always use environment variables
   - This serverless function keeps the API key secure on the backend
   - Rate limiting is handled by Buttondown's API

MONITORING:
   - Check Buttondown dashboard for new subscribers
   - Monitor serverless function logs in Netlify/Vercel
   - Set up error notifications if needed
*/
