// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://brpawvoyrhnyxyrvckzb.supabase.co'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycGF3dm95cmhueXh5cnZja3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1OTIxOTAsImV4cCI6MjA4MzE2ODE5MH0.9FqAda7EVBPFdXolXzKejAKgzODxpKItHXt-yPT7DbI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check authentication status on page load
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User is logged in
        showProtectedContent();
        updateUIForLoggedInUser(session.user);
    } else {
        // User is not logged in
        showAuthForms();
    }
}

// Sign up new user
async function signUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorDiv = document.getElementById('signup-error');
    const successDiv = document.getElementById('signup-success');
    
    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Basic validation
    if (!email || !password) {
        errorDiv.textContent = 'Please enter both email and password';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        
        // Show success message
        successDiv.textContent = 'Account created! Please check your email to verify your account.';
        successDiv.style.display = 'block';
        
        // Clear form
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        
        // Optional: Trigger Buttondown subscription here
        // await subscribeToNewsletter(email);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Sign in existing user
async function signIn() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.style.display = 'none';
    
    if (!email || !password) {
        errorDiv.textContent = 'Please enter both email and password';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        
        // Redirect or show protected content
        showProtectedContent();
        updateUIForLoggedInUser(data.user);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Sign out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    } else {
        // Redirect to home or show auth forms
        window.location.href = '/';
    }
}

// Show protected content (hide auth forms)
function showProtectedContent() {
    const authSection = document.getElementById('auth-section');
    const protectedContent = document.getElementById('protected-content');
    
    if (authSection) authSection.style.display = 'none';
    if (protectedContent) protectedContent.style.display = 'block';
}

// Show auth forms (hide protected content)
function showAuthForms() {
    const authSection = document.getElementById('auth-section');
    const protectedContent = document.getElementById('protected-content');
    
    if (authSection) authSection.style.display = 'block';
    if (protectedContent) protectedContent.style.display = 'none';
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userEmailSpan = document.getElementById('user-email');
    if (userEmailSpan) {
        userEmailSpan.textContent = user.email;
    }
}

// Toggle between login and signup forms
function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Password reset
async function resetPassword() {
    const email = document.getElementById('reset-email').value;
    const errorDiv = document.getElementById('reset-error');
    const successDiv = document.getElementById('reset-success');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    if (!email) {
        errorDiv.textContent = 'Please enter your email';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        
        if (error) throw error;
        
        successDiv.textContent = 'Password reset link sent! Check your email.';
        successDiv.style.display = 'block';
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// Optional: Subscribe to Buttondown newsletter
async function subscribeToNewsletter(email) {
    // This would call your serverless function or Buttondown API
    // For now, this is a placeholder
    console.log('Would subscribe to newsletter:', email);
    
    // Example API call (you'll need to implement the endpoint)
    /*
    try {
        await fetch('/api/subscribe-newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
    }
    */
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        showProtectedContent();
        if (session?.user) {
            updateUIForLoggedInUser(session.user);
        }
    } else if (event === 'SIGNED_OUT') {
        showAuthForms();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
