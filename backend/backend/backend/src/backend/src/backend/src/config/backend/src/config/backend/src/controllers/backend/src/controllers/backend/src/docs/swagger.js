import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Task Auth API', version: '1.0.0', description: 'JWT auth, user/admin roles, and task CRUD.' },
    servers: [{ url: 'http://localhost:5000/api/v1' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        RegisterInput: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['user', 'admin'] } } },
        LoginInput: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } },
        TaskInput: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string', enum: ['todo', 'in-progress', 'done'] }, dueDate: { type: 'string', format: 'date' } } },
      },
    },
    paths: {
      '/auth/register': { post: { tags: ['Auth'], summary: 'Register user', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } }, responses: { 201: { description: 'Registered' }, 400: { description: 'Validation error' } } } },
      '/auth/login': { post: { tags: ['Auth'], summary: 'Login user', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } }, responses: { 200: { description: 'Logged in' }, 401: { description: 'Invalid credentials' } } } },
      '/auth/me': { get: { tags: ['Auth'], security: [{ bearerAuth: [] }], summary: 'Current user', responses: { 200: { description: 'Current profile' } } } },
      '/tasks': { get: { tags: ['Tasks'], security: [{ bearerAuth: [] }], summary: 'List tasks', responses: { 200: { description: 'Task list' } } }, post: { tags: ['Tasks'], security: [{ bearerAuth: [] }], summary: 'Create task', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } }, responses: { 201: { description: 'Created' } } } },
      '/tasks/{id}': { get: { tags: ['Tasks'], security: [{ bearerAuth: [] }], summary: 'Get task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task' }, 404: { description: 'Not found' } } }, patch: { tags: ['Tasks'], security: [{ bearerAuth: [] }], summary: 'Update task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } } }, responses: { 200: { description: 'Updated' } } }, delete: { tags: ['Tasks'], security: [{ bearerAuth: [] }], summary: 'Delete task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 204: { description: 'Deleted' } } } },
    },
  },
  apis: [],
});
