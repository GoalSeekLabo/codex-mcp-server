#!/bin/bash

# Codex MCP Server Global Installation Script
# This script installs and configures Codex MCP Server globally

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Configuration
PACKAGE_NAME="codex-mcp-server"
GITHUB_REPO="goalseeklabs/codex-mcp-server"
REQUIRED_NODE_VERSION="18"

# Functions
log_info() {
    echo -e "${BLUE}🔵 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_gray() {
    echo -e "${GRAY}   $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node_version() {
    if ! command_exists node; then
        log_error "Node.js is not installed"
        log_gray "Please install Node.js ${REQUIRED_NODE_VERSION}+ from https://nodejs.org/"
        exit 1
    fi

    local node_version=$(node -v | sed 's/v//')
    local major_version=$(echo "$node_version" | cut -d. -f1)
    
    if [ "$major_version" -lt "$REQUIRED_NODE_VERSION" ]; then
        log_error "Node.js version $node_version is too old (required: ${REQUIRED_NODE_VERSION}+)"
        log_gray "Please upgrade Node.js from https://nodejs.org/"
        exit 1
    fi
    
    log_success "Node.js version $node_version is compatible"
}

# Check npm
check_npm() {
    if ! command_exists npm; then
        log_error "npm is not installed"
        log_gray "npm should be installed with Node.js"
        exit 1
    fi
    
    log_success "npm is available"
}

# Install Codex CLI if needed
install_codex_cli() {
    if command_exists codex; then
        log_success "Codex CLI is already installed"
        return 0
    fi
    
    log_warning "Codex CLI is not installed"
    read -p "$(echo -e "${BLUE}Do you want to install Codex CLI globally? (y/N): ${NC}")" -r
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Installing Codex CLI..."
        if command_exists brew; then
            log_info "Using Homebrew to install Codex CLI..."
            brew install codex || {
                log_warning "Homebrew installation failed, trying npm..."
                npm install -g @openai/codex
            }
        else
            log_info "Using npm to install Codex CLI..."
            npm install -g @openai/codex
        fi
        log_success "Codex CLI installed"
    else
        log_error "Codex CLI is required for this package to work"
        log_gray "You can install it later with:"
        log_gray "  npm install -g @openai/codex"
        log_gray "  or"
        log_gray "  brew install codex"
        exit 1
    fi
}

# Install Codex MCP Server
install_codex_mcp() {
    log_info "Installing Codex MCP Server globally..."
    
    # Install from current directory if we're in development
    if [ -f "package.json" ] && grep -q "codex-mcp-server" package.json; then
        log_info "Installing from local development version..."
        npm install -g .
    else
        # Install from npm (when published)
        npm install -g "$PACKAGE_NAME"
    fi
    
    log_success "Codex MCP Server installed globally"
}

# Setup Claude Code configuration
setup_claude_code_config() {
    log_info "Setting up Claude Code MCP configuration..."
    
    if command_exists codex-mcp-setup; then
        codex-mcp-setup
    else
        log_warning "codex-mcp-setup command not found after installation"
        log_gray "You may need to restart your terminal or check your PATH"
        return 1
    fi
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    # Check if codex-mcp command is available
    if ! command_exists codex-mcp; then
        log_error "codex-mcp command not found"
        log_gray "Installation may have failed or PATH needs to be updated"
        return 1
    fi
    
    # Check if setup command is available
    if ! command_exists codex-mcp-setup; then
        log_warning "codex-mcp-setup command not found"
        log_gray "Setup command may not be in PATH"
    fi
    
    log_success "Installation verified"
}

# Display final instructions
show_final_instructions() {
    echo
    log_success "🎉 Installation completed successfully!"
    echo
    log_info "Next steps:"
    log_gray "1. Restart your terminal (or run: source ~/.bashrc / source ~/.zshrc)"
    log_gray "2. Restart Claude Code if it's running"
    log_gray "3. Test the installation:"
    log_gray "   codex-mcp --help"
    log_gray "4. The following tools are now available in Claude Code:"
    log_gray "   • codex.exec - Execute Codex commands"
    log_gray "   • codex.analyze - Analyze code files"
    log_gray "   • codex.fix - Fix code issues"
    log_gray "   • codex.general - General Codex operations"
    echo
    log_info "For troubleshooting, check:"
    log_gray "• Codex CLI: codex --version"
    log_gray "• MCP Server: codex-mcp --help"
    log_gray "• Claude Code MCP config: ~/.config/claude-code/mcp_settings.json"
}

# Handle script interruption
trap 'log_warning "Installation interrupted by user"; exit 130' INT TERM

# Main installation process
main() {
    echo
    log_info "🚀 Codex MCP Server Global Installation"
    log_gray "This script will install Codex MCP Server globally and configure Claude Code"
    echo
    
    # Pre-flight checks
    log_info "Running pre-flight checks..."
    check_node_version
    check_npm
    
    # Install dependencies
    install_codex_cli
    
    # Install main package
    install_codex_mcp
    
    # Setup Claude Code
    setup_claude_code_config || log_warning "Claude Code setup had issues, you can run 'codex-mcp-setup' manually later"
    
    # Verify everything works
    verify_installation || log_warning "Verification had issues, but installation may still work"
    
    # Show final instructions
    show_final_instructions
}

# Help text
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    echo "Codex MCP Server Global Installation Script"
    echo
    echo "Usage: ./install.sh [options]"
    echo
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo
    echo "This script will:"
    echo "  1. Check Node.js and npm requirements"
    echo "  2. Install Codex CLI if needed (interactive)"
    echo "  3. Install Codex MCP Server globally via npm"
    echo "  4. Configure Claude Code to use the MCP server"
    echo "  5. Verify the installation"
    echo
    echo "Requirements:"
    echo "  • Node.js ${REQUIRED_NODE_VERSION}+"
    echo "  • npm"
    echo "  • Internet connection"
    echo "  • OpenAI API key or ChatGPT subscription (for Codex CLI)"
    exit 0
fi

# Run main function
main "$@"