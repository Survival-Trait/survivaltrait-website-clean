<?php
// Simple diagnostic test
echo "PHP is working!<br>";

// Test mail function
$to = "mjennings36@proton.me";
$subject = "Test from survivaltrait.com";
$message = "This is a test email";
$headers = "From: test@survivaltrait.com";

$result = mail($to, $subject, $message, $headers);

if ($result) {
    echo "✓ mail() function executed successfully<br>";
    echo "Check your email: $to<br>";
} else {
    echo "✗ mail() function failed<br>";
    echo "Hostinger may have mail() disabled<br>";
}

// Check permissions
echo "<br>Server info:<br>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Current directory: " . getcwd() . "<br>";
echo "Can write files: " . (is_writable('.') ? 'Yes' : 'No') . "<br>";
?>
