# Supabase Authentication Security Configuration
# This file should be used to configure Supabase Auth settings
# Apply these settings through the Supabase Dashboard or CLI

# ============================================================================
# AUTHENTICATION SECURITY SETTINGS
# ============================================================================

# Password Policy (Configure in Supabase Dashboard > Authentication > Settings)
# Minimum password length: 8 characters
# Require uppercase: true
# Require lowercase: true  
# Require numbers: true
# Require special characters: true
# Password history: 5 (prevent reusing last 5 passwords)

# Session Settings
# Session timeout: 3600 seconds (1 hour)
# Refresh token rotation: enabled
# Refresh token reuse interval: 10 seconds

# Security Settings
# Enable Captcha: true (for signup and password recovery)
# Rate limiting: enabled
# Max failed login attempts: 5
# Account lockout duration: 900 seconds (15 minutes)

# Email Settings
# Email confirmation required: true
# Email change confirmation: double confirmation
# Secure email template: enabled

# Advanced Security
# Enable audit logging: true
# Session IP validation: enabled  
# Suspicious activity detection: enabled
# SAML SSO: configure if needed

# ============================================================================
# ENVIRONMENT VARIABLES FOR APPLICATION
# ============================================================================

# Add these to your .env.local file:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security headers
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# SUPABASE_JWT_SECRET=your_jwt_secret

# Rate limiting
# MAX_REQUESTS_PER_MINUTE=60
# MAX_SIGNUP_REQUESTS_PER_HOUR=5

# ============================================================================
# CLI COMMANDS TO CONFIGURE SUPABASE AUTH
# ============================================================================

# To apply these settings via Supabase CLI:
# supabase auth update --password-min-length=8
# supabase auth update --password-require-uppercase=true
# supabase auth update --password-require-lowercase=true
# supabase auth update --password-require-numbers=true  
# supabase auth update --password-require-special=true

# Enable email confirmation
# supabase auth update --email-confirm=true

# Configure session settings
# supabase auth update --session-timeout=3600
# supabase auth update --refresh-token-rotation=true

# Enable rate limiting
# supabase auth update --rate-limit-enabled=true
# supabase auth update --max-failed-attempts=5

# ============================================================================
# ADDITIONAL SECURITY RECOMMENDATIONS
# ============================================================================

# 1. Enable Row Level Security (RLS) on all tables
# 2. Use service role key only on server-side operations
# 3. Implement proper CORS settings
# 4. Use HTTPS in production
# 5. Enable database connection pooling
# 6. Regular security audits and updates
# 7. Monitor authentication logs
# 8. Implement proper error handling (don't leak sensitive info)
# 9. Use environment variables for all secrets
# 10. Enable database backups and point-in-time recovery

# ============================================================================
# MONITORING AND ALERTING
# ============================================================================

# Set up alerts for:
# - Multiple failed login attempts
# - New user registrations from unusual locations
# - Large number of API requests from single IP
# - Database connection issues
# - Unusual query patterns
# - High error rates

# ============================================================================
# SUPABASE DASHBOARD CONFIGURATION STEPS
# ============================================================================

# 1. Go to Supabase Dashboard > Authentication > Settings
# 2. Under "Password Policy":
#    - Set minimum password length to 8
#    - Enable all complexity requirements
# 3. Under "Security":  
#    - Enable email confirmation
#    - Enable Captcha for signup
#    - Configure rate limiting
# 4. Under "Sessions":
#    - Set appropriate timeout values
#    - Enable refresh token rotation
# 5. Under "Advanced":
#    - Review and configure additional security options