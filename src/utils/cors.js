module.exports={
  origin: 'https://localhost:3000',  // Đảm bảo rằng Nuxt.js có thể gửi yêu cầu tới API
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Đảm bảo rằng Nuxt.js có thể gửi yêu cầu tới API
  credentials: true,
  optionsSuccessStatus: 200
}