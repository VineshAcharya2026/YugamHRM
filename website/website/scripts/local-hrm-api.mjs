/**
 * Optional tiny mock HRM API for UI-only flows (no Postgres/S3).
 * Default: http://127.0.0.1:8787 — use with Next dev `/hrm-api` rewrite or NEXT_PUBLIC_HRM_API_BASE_URL.
 *
 * Usage: npm run local-api
 */
import http from 'node:http'
import { createHmac } from 'node:crypto'

const PORT = Number(process.env.HRM_LOCAL_API_PORT || 8787)
const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-jwt-secret-key-minimum-32-characters-long'

function signJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    }),
  ).toString('base64url')
  const data = `${header}.${body}`
  const sig = createHmac('sha256', JWT_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyJwt(token) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('invalid')
  const [h, p, s] = parts
  const data = `${h}.${p}`
  const expected = createHmac('sha256', JWT_SECRET).update(data).digest('base64url')
  if (expected !== s) throw new Error('bad sig')
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString())
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error('expired')
  return payload
}

function json(res, status, body, origin) {
  const o = origin || '*'
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(body))
}

function success(data) {
  return { success: true, data }
}

function failure(msg) {
  return { success: false, error: msg }
}

const reportSummary = {
  employees: { total: 0, active: 0 },
  payrollRuns: 0,
  openJobs: 0,
  pendingLeaveRequests: 0,
  attendanceRecordsThisMonth: 0,
  documents: 0,
  goals: 0,
  performanceReviews: 0,
  generatedAt: new Date().toISOString(),
}

let mockCompany = {
  id: 1,
  name: 'Local Demo Company',
  logo_url: null,
  address: null,
  email: 'hr@local.test',
  phone: null,
  website: null,
  pan: null,
  gstin: null,
  cin: null,
  created_at: new Date().toISOString(),
}
const mockDepartments = []
const mockDesignations = []
const mockSalaryStructures = []
const mockRoles = [{ id: 1, name: 'admin', permissions: '["*"]' }]
const mockReviews = []
let nextId = 2

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || ''
  const url = new URL(req.url || '/', `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    res.end()
    return
  }

  const path = url.pathname
  const allowOrigin = origin || 'http://localhost:3000'

  try {
    if (path === '/health' && req.method === 'GET') {
      return json(res, 200, success({ status: 'ok', ts: Date.now() }), allowOrigin)
    }

    if (path === '/api/auth/login' && req.method === 'POST') {
      const body = await readBody(req)
      const email = String(body.email || '')
        .trim()
        .toLowerCase()
      const password = String(body.password || '')
      if (!email.includes('@') || password.length < 8) {
        return json(res, 400, failure('Invalid login payload'), allowOrigin)
      }
      const token = signJwt({
        sub: '1',
        employeeId: 1,
        empCode: 'EMP001',
        name: 'Local Demo Admin',
        email,
        role: 'admin',
        permissions: ['*'],
      })
      return json(
        res,
        200,
        success({
          token,
          user: {
            id: 1,
            employeeId: 1,
            empCode: 'EMP001',
            name: 'Local Demo Admin',
            email,
            role: 'admin',
            permissions: ['*'],
          },
        }),
        allowOrigin,
      )
    }

    if (path === '/api/auth/logout' && req.method === 'POST') {
      return json(res, 200, success({ message: 'Logged out' }), allowOrigin)
    }

    if (path === '/api/auth/google' && req.method === 'GET') {
      return json(
        res,
        501,
        failure('Google OAuth is not available in local-mock API. Use email/password or deploy the Worker.'),
        allowOrigin,
      )
    }
    if (path === '/api/auth/google/callback' && req.method === 'GET') {
      return json(res, 501, failure('Google OAuth requires the deployed Worker.'), allowOrigin)
    }
    if (path === '/api/auth/exchange' && req.method === 'POST') {
      return json(res, 501, failure('Google OAuth requires the deployed Worker.'), allowOrigin)
    }

    const auth = req.headers.authorization
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    let userPayload = null
    if (bearer) {
      try {
        userPayload = verifyJwt(bearer)
      } catch {
        userPayload = null
      }
    }

    if (path === '/api/auth/me' && req.method === 'GET') {
      if (!userPayload) return json(res, 401, failure('Unauthorized'), allowOrigin)
      return json(res, 200, success(userPayload), allowOrigin)
    }

    if (
      !userPayload &&
      path.startsWith('/api/') &&
      !path.startsWith('/api/auth/login') &&
      path !== '/api/auth/google' &&
      path !== '/api/auth/google/callback' &&
      !(path === '/api/auth/exchange' && req.method === 'POST')
    ) {
      return json(res, 401, failure('Unauthorized'), allowOrigin)
    }

    if (req.method === 'GET') {
      if (path === '/api/employees') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/payroll/runs') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/recruitment/jobs') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/recruitment/candidates') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/leaves/requests') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/leaves/types') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/attendance') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/documents') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/performance/cycles') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/performance/goals') return json(res, 200, success([]), allowOrigin)
      if (path === '/api/performance/reviews') return json(res, 200, success(mockReviews), allowOrigin)
      if (path === '/api/settings/company') return json(res, 200, success(mockCompany), allowOrigin)
      if (path === '/api/settings/departments') return json(res, 200, success(mockDepartments), allowOrigin)
      if (path === '/api/settings/designations') return json(res, 200, success(mockDesignations), allowOrigin)
      if (path === '/api/settings/roles') return json(res, 200, success(mockRoles), allowOrigin)
      if (path === '/api/settings/salary-structures') return json(res, 200, success(mockSalaryStructures), allowOrigin)
      if (path === '/api/reports/summary') {
        reportSummary.generatedAt = new Date().toISOString()
        return json(res, 200, success({ ...reportSummary }), allowOrigin)
      }
    }

    if (req.method === 'PUT' && path === '/api/settings/company') {
      const body = await readBody(req)
      mockCompany = {
        ...mockCompany,
        name: body.name ?? mockCompany.name,
        logo_url: body.logoUrl ?? mockCompany.logo_url,
        address: body.address ?? mockCompany.address,
        email: body.email ?? mockCompany.email,
        phone: body.phone ?? mockCompany.phone,
        website: body.website ?? mockCompany.website,
        pan: body.pan ?? mockCompany.pan,
        gstin: body.gstin ?? mockCompany.gstin,
        cin: body.cin ?? mockCompany.cin,
      }
      return json(res, 200, success({ message: 'Company profile updated (mock)' }), allowOrigin)
    }

    if (req.method === 'POST') {
      const stub = { message: 'ok (local mock)', id: 1 }
      if (path === '/api/settings/departments') {
        const body = await readBody(req)
        const id = nextId++
        mockDepartments.push({ id, name: body.name || 'Dept', head_id: body.headId ?? null, created_at: new Date().toISOString(), head_name: null })
        return json(res, 201, success({ message: 'ok', id }), allowOrigin)
      }
      if (path === '/api/settings/designations') {
        const body = await readBody(req)
        const id = nextId++
        mockDesignations.push({
          id,
          title: body.title || 'Role',
          department_id: body.departmentId ?? null,
          grade: body.grade ?? null,
          department_name: null,
        })
        return json(res, 201, success({ message: 'ok', id }), allowOrigin)
      }
      if (path === '/api/settings/salary-structures') {
        const body = await readBody(req)
        const id = nextId++
        mockSalaryStructures.push({
          id,
          name: body.name || 'Structure',
          basic_percent: 40,
          hra_percent: 20,
          ta_percent: 10,
          da_percent: 5,
          special_percent: 25,
          pf_employee: 12,
          pf_employer: 12,
          esi_employee: 0.75,
          esi_employer: 3.25,
          pt_monthly: 200,
          created_at: new Date().toISOString(),
        })
        return json(res, 201, success({ message: 'ok', id }), allowOrigin)
      }
      if (path === '/api/performance/reviews') {
        const body = await readBody(req)
        const id = nextId++
        mockReviews.push({
          id,
          employee_id: body.employeeId,
          reviewer_id: body.reviewerId,
          cycle_id: body.cycleId ?? null,
          type: body.type || 'annual',
          self_rating: body.selfRating ?? null,
          manager_rating: body.managerRating ?? null,
          final_rating: body.finalRating ?? null,
          rating_label: body.ratingLabel ?? null,
          status: body.status || 'draft',
          completed_at: null,
          created_at: new Date().toISOString(),
          employee_name: 'Employee',
          reviewer_name: 'Reviewer',
          cycle_name: null,
        })
        reportSummary.performanceReviews = mockReviews.length
        return json(res, 201, success({ message: 'Review created (mock)', id }), allowOrigin)
      }
      if (
        path.startsWith('/api/employees') ||
        path.startsWith('/api/payroll') ||
        path.startsWith('/api/recruitment') ||
        path.startsWith('/api/leaves') ||
        path.startsWith('/api/attendance') ||
        path.startsWith('/api/documents') ||
        path.startsWith('/api/performance')
      ) {
        await readBody(req)
        return json(res, 201, success(stub), allowOrigin)
      }
    }

    return json(res, 404, failure('Not found'), allowOrigin)
  } catch (e) {
    console.error(e)
    return json(res, 500, failure(e.message || 'Error'), allowOrigin)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[local-hrm-api] http://127.0.0.1:${PORT}  (mock API — use Wrangler on x64/WSL for real D1)`)
})
