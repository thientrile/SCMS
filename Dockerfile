# Sử dụng Node.js phiên bản 23.5.0
FROM node:23-alpine



# Tạo thư mục làm việc trong container
WORKDIR /usr/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép mã nguồn ứng dụng
COPY . .

# Mở cổng mặc định của ứng dụng (ví dụ: 3000)
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "start"]
