# DevSecOps Pipeline Implementation Guide
## SurvivalTrait Website Security & Change Management

This guide walks you through setting up a complete, **FREE** DevSecOps pipeline with SAST, DAST, SCA, and change management best practices.

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Pipeline Components](#pipeline-components)
5. [Branch Protection Setup](#branch-protection-setup)
6. [Security Scanning Details](#security-scanning-details)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## 🎯 Overview

### What This Pipeline Does

**Security Scanning:**
- ✅ **SAST** (Static Application Security Testing) - Semgrep scans code for vulnerabilities
- ✅ **DAST** (Dynamic Application Security Testing) - OWASP ZAP tests running application
- ✅ **SCA** (Software Composition Analysis) - Trivy scans dependencies
- ✅ **Secret Scanning** - TruffleHog detects exposed credentials
- ✅ **Code Quality** - HTML/CSS linting and validation

**Change Management:**
- ✅ PR review requirements
- ✅ Branch protection
- ✅ Automated testing on every commit
- ✅ Security approval gates
- ✅ Audit trail

**Cost:** $0 (All tools are free for public repositories)

---

## 🔧 Prerequisites

1. **GitHub Account** (free)
2. **GitHub Repository** for your website
3. **Repository Access** (admin rights to configure settings)

---

## 🚀 Quick Start

### Step 1: Push Your Code to GitHub

```bash
# Initialize git in your website directory
cd /path/to/your/website
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SurvivalTrait website"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/survivaltrait.git

# Push to GitHub
git push -u origin main
```

### Step 2: Add DevSecOps Pipeline Files

Create the following directory structure in your repository:

```
your-repo/
├── .github/
│   ├── workflows/
│   │   └── devsecops.yml          # Main pipeline
│   ├── dependabot.yml             # Automated dependency updates
│   └── PULL_REQUEST_TEMPLATE.md   # PR checklist
├── .zap/
│   └── rules.tsv                  # OWASP ZAP configuration
└── SECURITY.md                    # Security policy
```

Copy the files I created into these locations in your repository.

### Step 3: Commit and Push Pipeline Files

```bash
git add .github/ .zap/ SECURITY.md
git commit -m "feat: Add DevSecOps pipeline with SAST/DAST/SCA"
git push
```

### Step 4: Enable GitHub Features

1. Go to your repository on GitHub
2. Click **Settings** → **Security** → **Code security and analysis**
3. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Secret scanning
   - ✅ Code scanning (CodeQL)

---

## 🛡️ Pipeline Components

### 1. SAST - Static Application Security Testing

**Tool:** Semgrep (free, open-source)

**What it scans:**
- Security vulnerabilities in code
- OWASP Top 10 issues
- Hardcoded secrets
- Insecure patterns

**Runs on:** Every push and PR

**Configuration:** Built into workflow, no additional setup needed

---

### 2. DAST - Dynamic Application Security Testing

**Tool:** OWASP ZAP (free, industry-standard)

**What it tests:**
- XSS (Cross-Site Scripting)
- SQL Injection
- Security misconfigurations
- Server vulnerabilities

**Runs on:** Main branch pushes and weekly schedule

**Customization:** Edit `.zap/rules.tsv` to adjust severity thresholds

---

### 3. SCA - Software Composition Analysis

**Tool:** Trivy (free, comprehensive)

**What it scans:**
- Known vulnerabilities in dependencies
- License compliance issues
- Outdated packages

**Runs on:** Every push and PR

**Updates:** Automatically via Dependabot

---

### 4. Secret Scanning

**Tool:** TruffleHog (free, high-accuracy)

**What it detects:**
- API keys
- Database credentials
- OAuth tokens
- Private keys
- Passwords

**Runs on:** Every push and PR

---

### 5. Code Quality

**Tools:**
- HTMLHint (HTML validation)
- Stylelint (CSS validation)
- HTML5 Validator
- Lychee (broken link checker)

**Runs on:** Every push and PR

---

## 🔒 Branch Protection Setup

### Configure Main Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule** for `main` branch
3. Enable these settings:

```
✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed
   
✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Select required checks:
      - SAST - Semgrep Security Scan
      - Secret & Credential Scanning
      - SCA - Dependency Security Scan
      - Code Quality Analysis
      - Build & Validation
      
✅ Require conversation resolution before merging

✅ Do not allow bypassing the above settings

✅ Restrict who can push to matching branches
   (Add yourself and trusted collaborators)
```

4. Click **Create** or **Save changes**

---

## 🔍 Security Scanning Details

### Severity Levels

The pipeline categorizes findings by severity:

- **CRITICAL** ⛔ - Immediate action required, blocks PR
- **HIGH** 🔴 - Should be fixed before merge
- **MEDIUM** 🟡 - Review and prioritize
- **LOW** 🟢 - Informational, fix when convenient

### Viewing Results

**Security Tab:**
- Navigate to **Security** → **Code scanning alerts**
- View all SAST/DAST/SCA findings
- Track remediation status

**Pull Request Checks:**
- Each PR shows security scan results
- Failed checks block merge
- Click "Details" to see specific issues

**Actions Tab:**
- View detailed logs for each workflow run
- Download SARIF reports for offline analysis

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Workflow fails with permission errors
```yaml
# Solution: Add to workflow file
permissions:
  contents: read
  security-events: write
  actions: read
```

**Issue:** DAST scan times out
```yaml
# Solution: Increase timeout in workflow
timeout-minutes: 30
```

**Issue:** Too many false positives
```yaml
# Solution: Adjust .zap/rules.tsv thresholds
# Change FAIL to WARN or IGNORE for specific rules
```

**Issue:** Dependabot PRs overwhelming
```yaml
# Solution: Reduce open-pull-requests-limit in dependabot.yml
open-pull-requests-limit: 5
```

---

## ✅ Best Practices

### Development Workflow

1. **Never commit directly to main**
   ```bash
   # Always create a feature branch
   git checkout -b feature/your-feature-name
   ```

2. **Test locally before pushing**
   ```bash
   # Validate HTML
   htmlhint index.html
   
   # Check for secrets
   trufflehog filesystem . --only-verified
   ```

3. **Write descriptive commit messages**
   ```bash
   git commit -m "feat: Add consulting page with service descriptions"
   git commit -m "fix: Resolve XSS vulnerability in contact form"
   git commit -m "security: Update dependencies to patch CVE-2024-XXXX"
   ```

4. **Complete PR template checklist**
   - Don't skip security checklist items
   - Provide meaningful description
   - Link related issues

### Security Practices

1. **Never commit secrets**
   - Use environment variables
   - Use GitHub Secrets for CI/CD
   - Review `.gitignore` regularly

2. **Review dependencies**
   - Check Dependabot PRs promptly
   - Verify changelog before approving
   - Test updates in staging

3. **Respond to security alerts**
   - Critical: Within 24 hours
   - High: Within 1 week
   - Medium: Within 1 month

4. **Keep documentation updated**
   - Update SECURITY.md with changes
   - Document security decisions
   - Maintain changelog

### Change Management

1. **Require reviews**
   - Minimum 1 reviewer for all PRs
   - Security-sensitive changes need security expert review

2. **Test in staging**
   - Deploy to test environment first
   - Verify functionality
   - Check security headers

3. **Maintain audit trail**
   - All changes via PRs (no direct commits)
   - Link PRs to issues
   - Document reasoning in PR descriptions

4. **Have rollback plan**
   - Tag releases
   - Keep previous version accessible
   - Document rollback procedure

---

## 📊 Metrics & Reporting

### Weekly Security Report

The pipeline runs weekly scans every Sunday at 2 AM. Review:

1. **Security Tab** - New vulnerabilities
2. **Dependabot** - Pending updates
3. **Actions** - Failed workflows

### Monthly Review

1. Review all MEDIUM severity findings
2. Update dependencies
3. Audit access permissions
4. Review and update security policies

---

## 🆘 Getting Help

**Documentation:**
- [Semgrep Docs](https://semgrep.dev/docs/)
- [OWASP ZAP Docs](https://www.zaproxy.org/docs/)
- [Trivy Docs](https://aquasecurity.github.io/trivy/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

**Community:**
- [Semgrep Community](https://github.com/returntocorp/semgrep)
- [OWASP ZAP Community](https://groups.google.com/g/zaproxy-users)

**Professional Support:**
- Email: info@survivaltrait.com

---

## 🎓 Additional Resources

### Security Headers

Add these to your `.htaccess` or server configuration:

```apache
# Security Headers
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# Content Security Policy
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
```

### HTTPS Enforcement

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📝 Changelog Template

Maintain a CHANGELOG.md:

```markdown
# Changelog

## [1.0.1] - 2025-12-28

### Security
- Updated jQuery to 3.7.1 (CVE-2024-XXXX)
- Added Content Security Policy headers
- Fixed XSS vulnerability in contact form

### Added
- Consulting page with service descriptions
- DevSecOps pipeline with SAST/DAST/SCA

### Changed
- Updated logo to transparent version
- Improved mobile responsiveness

### Fixed
- Broken link to privacy policy
- Hero section background cutoff
```

---

**Questions?** Email info@survivaltrait.com

**Last Updated:** December 28, 2025
