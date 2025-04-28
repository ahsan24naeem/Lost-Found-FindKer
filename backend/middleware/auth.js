import jwt from 'jsonwebtoken'
import cookie from 'cookie'

// Main authentication middleware
export const verifyToken = (req, res, next) => {
  try {
    // Check both Authorization header AND cookies
    let token = null
    
    // 1. Check Authorization header (for API calls)
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }
    
    // 2. Check cookies (for SSR/SSG pages)
    if (!token && req.cookies) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ error: 'No authentication token found' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    
    // Refresh cookie expiration on successful auth
    res.setHeader('Set-Cookie', 
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      })
    )
    
    next()
  } catch (error) {
    console.error('Auth error:', error)
    if (error.name === 'TokenExpiredError') {
      // Clear expired token cookie
      res.setHeader('Set-Cookie', 
        cookie.serialize('token', '', {
          httpOnly: true,
          expires: new Date(0),
          path: '/'
        })
      )
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(403).json({ error: 'Invalid token' })
  }
}

// Optional auth with proper cookie handling
export const optionalAuth = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
    }
    next()
  } catch (error) {
    // Invalid tokens are treated as no-auth
    next()
  }
}

// Login response helper
export const sendAuthResponse = (res, token, userData) => {
  res.setHeader('Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })
  )
  
  return res.json({
    success: true,
    user: {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      // Never expose sensitive data here
    }
  })
}