# Security Policy

## Supported Versions

We take security seriously and actively maintain security for the latest version of the SurvivalTrait website.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in the SurvivalTrait website, please report it responsibly:

### How to Report

1. **DO NOT** create a public GitHub issue
2. Email security details to: **info@survivaltrait.com**
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution Timeline**: Varies by severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: Best effort basis

### Disclosure Policy

- We follow coordinated disclosure practices
- We will credit researchers (unless anonymity is preferred)
- We will publish security advisories for significant issues

## Security Best Practices

This project follows these security principles:

### Development
- All code changes require PR review
- Automated security scanning on every commit
- SAST, DAST, and SCA integrated in CI/CD
- No secrets or credentials in code
- Regular dependency updates

### Infrastructure
- HTTPS enforced
- Security headers implemented
- Regular security audits
- Principle of least privilege

### Data Protection
- No PII stored without explicit consent
- Privacy policy clearly documented
- Compliance with applicable regulations

## Security Tools Used

- **SAST**: Semgrep
- **DAST**: OWASP ZAP
- **SCA**: Trivy
- **Secret Scanning**: TruffleHog
- **Dependency Management**: Dependabot

## Security Contact

For security concerns: **info@survivaltrait.com**

---

*Last Updated: December 2025*
