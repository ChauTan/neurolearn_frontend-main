# Firebase Setup for Chat

## 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Thêm ứng dụng web vào project

## 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc với các biến sau:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API URL (for user info)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Cấu hình Firestore Security Rules

Trong Firebase Console, vào Firestore Database > Rules và cập nhật rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chat rooms
    match /chatRooms/{chatRoomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/chatRooms/$(chatRoomId)).data.participants[request.auth.uid] != null;
      }
    }
  }
}
```

## 4. Cấu hình Authentication (Optional)

Nếu muốn sử dụng Firebase Auth thay vì backend auth:

1. Vào Authentication > Sign-in method
2. Bật các provider cần thiết (Email/Password, Google, etc.)

## 5. Cấu hình Indexes (Nếu cần)

Firestore có thể yêu cầu tạo composite indexes cho các query phức tạp. Firebase Console sẽ hiển thị link để tạo index khi cần.

## 6. Testing

1. Chạy ứng dụng: `npm run dev`
2. Kiểm tra console để đảm bảo Firebase kết nối thành công
3. Test chat functionality

## Lưu ý

- Đảm bảo backend API vẫn hoạt động để lấy thông tin user
- Chat messages sẽ được lưu trong Firestore thay vì backend
- Real-time updates được xử lý bởi Firestore listeners 