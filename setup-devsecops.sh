#!/bin/bash
# DevSecOps Pipeline Setup Script for SurvivalTrait
# This script helps you set up the complete pipeline

set -e

echo "🛡️  SurvivalTrait DevSecOps Pipeline Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Not a git repository. Initializing...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Already in a git repository${NC}"
fi

# Create directory structure
echo ""
echo "📁 Creating directory structure..."
mkdir -p .github/workflows
mkdir -p .zap
echo -e "${GREEN}✅ Directories created${NC}"

# Check for remote
echo ""
echo "🔗 Checking GitHub remote..."
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  No GitHub remote configured${NC}"
    echo ""
    echo "Please configure your GitHub remote:"
    echo "  git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git"
    echo ""
    read -p "Enter your GitHub repository URL (or press Enter to skip): " REPO_URL
    
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo -e "${GREEN}✅ Remote added${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped. You can add it later with: git remote add origin <URL>${NC}"
    fi
else
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ Remote configured: ${REMOTE_URL}${NC}"
fi

# Add and commit pipeline files
echo ""
echo "📝 Adding DevSecOps pipeline files..."

if [ -f .github/workflows/devsecops.yml ]; then
    echo -e "${GREEN}✅ Pipeline files ready${NC}"
    
    # Check if files are already committed
    if git status --porcelain | grep -q ".github"; then
        echo ""
        echo "💾 Committing pipeline files..."
        git add .github/ .zap/ .gitignore SECURITY.md DEVSECOPS_GUIDE.md 2>/dev/null || true
        git commit -m "feat: Add DevSecOps pipeline with SAST/DAST/SCA

- Add GitHub Actions workflow for automated security scanning
- Configure Semgrep (SAST), OWASP ZAP (DAST), Trivy (SCA)
- Add secret scanning with TruffleHog
- Implement code quality checks and validation
- Add Dependabot for automated dependency updates
- Include PR template with security checklist
- Add comprehensive security policy and guide"
        echo -e "${GREEN}✅ Files committed${NC}"
    else
        echo -e "${YELLOW}⚠️  Pipeline files already committed${NC}"
    fi
else
    echo -e "${RED}❌ Pipeline files not found. Please ensure all files are in the correct location.${NC}"
    exit 1
fi

# Summary and next steps
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 DevSecOps Pipeline Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "2️⃣  Enable GitHub Security Features:"
echo "   • Go to Settings → Security → Code security"
echo "   • Enable: Dependency graph, Dependabot alerts,"
echo "     Secret scanning, Code scanning"
echo ""
echo "3️⃣  Configure Branch Protection:"
echo "   • Go to Settings → Branches → Add rule"
echo "   • Branch name: main"
echo "   • Enable: Require PR reviews, status checks"
echo "   • See DEVSECOPS_GUIDE.md for details"
echo ""
echo "4️⃣  Review the comprehensive guide:"
echo "   cat DEVSECOPS_GUIDE.md"
echo ""
echo "📚 Documentation:"
echo "   • DEVSECOPS_GUIDE.md - Complete setup guide"
echo "   • SECURITY.md - Security policy"
echo "   • .github/PULL_REQUEST_TEMPLATE.md - PR checklist"
echo ""
echo -e "${GREEN}✅ Your website now has enterprise-grade security!${NC}"
echo ""
