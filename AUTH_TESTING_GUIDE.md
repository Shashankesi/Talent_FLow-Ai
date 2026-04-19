# 🔐 Authentication Testing Guide

## Current Status
- ✅ **Backend**: Running on `http://localhost:8080` (Tomcat started)
- ✅ **Frontend**: Running on `http://localhost:3000` (Vite dev server)
- ✅ **MongoDB**: Connected to MongoDB Atlas
- ✅ **JWT**: HS512 algorithm with proper 100+ character secret key

## Testing Steps

### Step 1: Open Developer Console
1. Go to `http://localhost:3000/login` in your browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. You'll see debug logs like `🔐 Attempting login with email:` when you try to login

### Step 2: Test Signup (Create New Account)
1. Click on the Login page
2. Click **"Create Account"** link at the bottom
3. Select your role: **Job Seeker** or **Recruiter**
4. Fill in the form:
   - **Full Name**: Your Name
   - **Email**: your-email@example.com (must be new)
   - **Phone**: 9876543210
   - **Password**: password123 (min 6 characters)
   - **Confirm Password**: password123 (must match)
5. Click **Create Account**
6. Watch the console for logs:
   ```
   📝 Attempting signup with: {...}
   ✅ Signup response: {...}
   👤 User created: Your Name Role: STUDENT
   🚀 Navigating to dashboard...
   ```

### Step 3: Test Login with Created Account
1. Go back to `http://localhost:3000/login`
2. Use the credentials from signup:
   - **Email**: your-email@example.com
   - **Password**: password123
3. Click **Sign In**
4. Watch the console for logs:
   ```
   🔐 Attempting login with email: your-email@example.com
   ✅ Login response: {...}
   👤 User logged in: Your Name Role: STUDENT
   🚀 Navigating to dashboard...
   ```

### Step 4: Test Login with Demo Credentials
You can also use the pre-created demo accounts:

**Student Account:**
- Email: `student@example.com`
- Password: `password`

**Recruiter Account:**
- Email: `recruiter@example.com`
- Password: `password`

## Expected Behavior

### Successful Login/Signup
✅ Form submits without errors
✅ Toast notification: "Login successful! Redirecting..."
✅ Redirects to dashboard (Student or Recruiter)
✅ Console shows green ✅ checkmarks and navigation logs

### Form Validation Errors
❌ Missing fields: "Email is required" / "Password is required"
❌ Password too short: "Password must be at least 6 characters"
❌ Passwords don't match: "Passwords do not match"
❌ Email already exists: "Email already registered. Please login instead."

### Server Errors
❌ Wrong password: "Invalid email or password" (401 Unauthorized)
❌ Server connection failed: "Login failed" (Network error)

## Troubleshooting

### Issue: "Invalid email or password"
- **Cause**: Wrong email or password
- **Solution**: 
  - Check the email spelling exactly
  - Verify you're using the correct password
  - Try the demo credentials first: `student@example.com` / `password`

### Issue: "Email already registered"
- **Cause**: You already have an account with that email
- **Solution**: Use a different email or login with that account

### Issue: "Cannot POST /api/auth/login"
- **Cause**: Backend not running
- **Solution**: 
  1. Check if backend is running: `http://localhost:8080/api/auth/profile`
  2. Restart backend if needed

### Issue: Form won't submit / No response
- **Cause**: Network error or browser console has errors
- **Solution**:
  1. Open browser DevTools (F12)
  2. Go to **Network** tab
  3. Try login again
  4. Look for any failed requests (red text)
  5. Click on failed request to see error details
  6. Check **Console** tab for JavaScript errors

### Issue: Redux/State Management Error
- **Cause**: Auth store not updating
- **Solution**: 
  1. Check browser Console for errors
  2. Clear browser cache: Ctrl+Shift+Delete
  3. Reload page: Ctrl+R

## Network Request Details

### Login Request
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password"
}
```

### Expected Response (Success - 200)
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "STUDENT",
  "user": {
    "id": "69e4b81566468853255917d3",
    "email": "student@example.com",
    "fullName": "Test Student",
    "phone": "9876543210",
    "role": "STUDENT"
  }
}
```

### Expected Response (Failure - 401)
```json
{
  "message": "Invalid password"
}
```

## Checking Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try login
4. Find the request to `/api/auth/login`
5. Click it to see:
   - **Request headers** and body
   - **Response status** (200 = success, 401 = unauthorized, 500 = server error)
   - **Response data** (the token and user info)

## Console Logs Guide

| Log | Meaning |
|-----|---------|
| 🔐 Attempting login | Login form was submitted |
| ✅ Login response | Server returned successful response |
| 👤 User logged in | User data received and stored |
| 🚀 Navigating to dashboard | Redirecting to dashboard page |
| ❌ Login error | Error occurred during login |

## Quick Test Commands

You can also test the API directly in PowerShell:

```powershell
# Test Signup
$body = @{ 
  fullName = "Test User"
  email = "test@example.com"
  password = "password123"
  phone = "9876543210"
  role = "STUDENT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Test Login
$body = @{ email = "test@example.com"; password = "password123" } | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## Still Having Issues?

1. **Check all three components are running**:
   - Backend: `http://localhost:8080` (port 8080)
   - Frontend: `http://localhost:3000` (port 3000)
   - MongoDB: Should see connection logs in backend

2. **Check browser console (F12 → Console)**:
   - Look for red error messages
   - Look for yellow warning messages
   - Copy error message for troubleshooting

3. **Check Network tab (F12 → Network)**:
   - Filter for `/api/` requests
   - Check response status codes
   - Verify response has `token` field

4. **Try demo credentials first**:
   - Email: `student@example.com`
   - Password: `password`
   - This confirms backend is working

5. **Clear cache and reload**:
   - Ctrl+Shift+Delete (Clear browsing data)
   - Ctrl+R (Hard reload)
   - Ctrl+F5 (Force reload)

## Success Checklist ✅

- [ ] Can create new account with signup form
- [ ] Can login with created credentials
- [ ] Can login with demo credentials
- [ ] Redirects to correct dashboard (Student/Recruiter)
- [ ] Console shows successful logs
- [ ] Network tab shows 200 status for auth requests
- [ ] Token is stored in browser localStorage
- [ ] Can see user info in dashboard

---

**Need Help?** Check the console logs with emojis - they'll guide you through each step! 🎉
