<?php
/**
 * Contact Form Handler - Final Clean Version
 */

// Security: Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Configuration
$your_email = "mattjennings@survivaltrait.com";
$website_name = "Matthew P. Jennings";
$redirect_success = "index.html?message=success#contact";
$redirect_error = "index.html?message=error#contact";

// Sanitize and validate input
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validation
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    header('Location: ' . $redirect_error);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirect_error);
    exit;
}

if (strlen($message) > 5000) {
    header('Location: ' . $redirect_error);
    exit;
}

// Build email
$email_subject = "[Contact Form] $subject - from $name";
$email_body = "Contact Form Submission\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n$message\n\n";
$email_body .= "---\n";
$email_body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";

// Simple headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email";

// Send
$success = mail($your_email, $email_subject, $email_body, $headers);

if ($success) {
    header('Location: ' . $redirect_success);
} else {
    header('Location: ' . $redirect_error);
}
exit;
?>
