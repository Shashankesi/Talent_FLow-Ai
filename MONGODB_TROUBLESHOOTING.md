# MongoDB Atlas SSL Connection Troubleshooting

## Current Issue
The backend is experiencing SSL connection failures with MongoDB Atlas:
```
javax.net.ssl.SSLException: Received fatal alert: internal_error
```

## Solution Approach 1: Whitelist IP Address in MongoDB Atlas

### Steps:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in with your account
3. Navigate to your cluster
4. Go to **Network Access** → **IP Access List**
5. Click **Add IP Address**
6. Add your current IP or `0.0.0.0/0` (for development only - NOT for production)
7. Click **Confirm**

## Solution Approach 2: Update Connection String

⚠️ **IMPORTANT**: Never hardcode MongoDB credentials in code. Use environment variables instead:

```properties
# In application.properties (use environment variable)
spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI}

# Get the connection string from MongoDB Atlas:
# MongoDB Atlas → Your Cluster → Connect → Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&authSource=admin
```

**Example (do not hardcode)**:
```bash
# Set environment variable before running
export SPRING_DATA_MONGODB_URI="mongodb+srv://username:password@your-cluster.mongodb.net/talentflow?retryWrites=true&w=majority&authSource=admin"
```

## Solution Approach 3: Use Local MongoDB (Recommended for Development)

### Step 1: Download MongoDB Community Server
- Windows: https://www.mongodb.com/try/download/community
- Choose Windows Server 2012 R2 or later
- Download MSI Installer

### Step 2: Install MongoDB
1. Run the installer
2. Choose "Complete" installation
3. Uncheck "Install as Windows Service" (optional, depends on preference)
4. Click Install

### Step 3: Update Connection String

Change your `application.properties`:

```properties
# From MongoDB Atlas
# spring.data.mongodb.uri=mongodb+srv://...

# To Local MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017
spring.data.mongodb.database=talentflow
```

### Step 4: Start Local MongoDB

**Option A: If installed as a Windows Service**
```powershell
# MongoDB should start automatically
# To verify it's running:
netstat -ano | findstr :27017
```

**Option B: Manual Start**
```powershell
# Open PowerShell as Administrator
cd "C:\Program Files\MongoDB\Server\7.0\bin"  # Adjust version as needed
.\mongod.exe
```

### Step 5: Verify Connection

Create a test file `test-mongo.js`:
```javascript
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    // List databases
    const adminDb = client.db('admin');
    const { databases } = await adminDb.admin().listDatabases();
    console.log('Databases:', databases.map(d => d.name));
    
  } catch (error) {
    console.error('❌ Failed to connect:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();
```

## Solution Approach 4: Check Java SSL Settings

Add Java arguments to force TLS 1.2 or higher. Edit your backend startup command:

```bash
java -Dtlsv1.2=true -Dcom.sun.jndi.ldap.connect.pool.useSSL=true -jar talentflow-api-1.0.0.jar --server.port=8081
```

## Recommended Solution: Use Local MongoDB + Atlas Backup

Best approach for development:
1. Use **local MongoDB** for development and testing (instant, no SSL issues)
2. Keep MongoDB Atlas credentials as backup
3. Create a simple script to sync data if needed

## Verification Steps

After applying solution, verify:

1. **Check Backend Logs**
   ```
   Look for: "Successfully connected to MongoDB"
   Look for: No "SSLException" errors
   ```

2. **Test Signup**
   ```
   Go to http://localhost:3000/signup
   Create an account with:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: testpass123
   - Confirm Password: testpass123
   ```

3. **Test Login**
   ```
   Go to http://localhost:3000/login
   Select role (Student)
   Enter your new credentials
   ```

4. **Create Demo Jobs**
   ```
   Login as Recruiter
   Go to Post Job
   Create sample job postings
   ```

5. **View Jobs as Student**
   ```
   Logout and login as Student
   Go to Job Search
   Should see posted jobs
   ```

## Quick Reference Commands

```powershell
# Check if MongoDB is running (local)
netstat -ano | findstr :27017

# Kill MongoDB process on port 27017
Get-Process mongod | Stop-Process

# Start MongoDB from anywhere (if in PATH)
mongod

# Connect to MongoDB shell
mongo
# or for newer versions
mongosh

# Check application logs
Get-Content terminal_output.log -Tail 50
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `SSLException: internal_error` | IP not whitelisted or cert issue | Add IP to Atlas or use local |
| `connection refused 27017` | MongoDB not running | Start MongoDB service |
| `authentication failed` | Wrong credentials | Verify username/password |
| `ECONNREFUSED 127.0.0.1:27017` | Connection string wrong | Change to `mongodb://localhost:27017` |

## Next Steps After Fix

Once MongoDB is connected:

1. Backend should initialize demo accounts automatically
2. Test signup/login
3. Create sample jobs as recruiter
4. Search jobs as student
5. Apply for jobs
6. Test complete workflow

---

**Recommendation**: Start with local MongoDB for fastest development. Switch to MongoDB Atlas when moving to production.
