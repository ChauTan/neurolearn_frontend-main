# Debug Guide - Business Group Chat System

## Vấn đề hiện tại

1. **Group chat được tạo nhưng employee không được thêm vào**
2. **Chat không hoạt động (không gửi được tin nhắn)**

## Cấu hình hiện tại

**Firebase Authentication: DISABLED**
- Chỉ sử dụng Firestore cho chat functionality
- Sử dụng mock user thay vì Firebase Auth
- Không cần cấu hình Firebase Auth

## Các bước debug

### 1. Kiểm tra Firebase Configuration

Đảm bảo các environment variables được set đúng trong `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Kiểm tra Firebase Rules

Đảm bảo Firestore rules cho phép read/write (không cần auth):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chatRooms/{chatRoomId} {
      allow read, write: if true; // Cho phép tất cả
    }
    match /chatRooms/{chatRoomId}/messages/{messageId} {
      allow read, write: if true; // Cho phép tất cả
    }
  }
}
```

### 3. Sử dụng các Component Test

#### FirebaseConnectionTest
- Kiểm tra kết nối Firebase
- Test Firestore write/read operations
- Không cần authentication

#### BusinessGroupChatTest
- Kiểm tra việc tạo business group chat
- Test thêm employee vào group chat

#### ChatTestComponent
- Test gửi tin nhắn trong group chat
- Test real-time updates

### 4. Debug Steps

#### Bước 1: Kiểm tra User và Business Info
1. Mở business dashboard
2. Xem component "Firebase Connection Test"
3. Kiểm tra "User Information" section:
   - **ID**: Phải có giá trị
   - **Name**: Phải có giá trị
   - **Has Business Info**: Phải là "Yes"
   - **Business ID**: Phải có giá trị
4. Nếu thiếu thông tin, kiểm tra Redux store và API calls

#### Bước 2: Kiểm tra Firebase Connection
1. Xem component "Firebase Connection Test"
2. Đảm bảo status là "Firebase Connected" và "Mock Auth (No Auth Required)"
3. Click "Test Firestore" để kiểm tra write operations
4. Đảm bảo hiển thị "Successfully wrote to Firestore"

#### Bước 3: Tạo Business Group Chat
1. Xem component "Business Group Chat Test"
2. Kiểm tra "Business ID" có giá trị không
3. Click "Test Group Chat"
4. Kiểm tra console logs và "Existing Chats" section
5. Đảm bảo không có lỗi

#### Bước 4: Thêm Employee
1. Thêm employee mới
2. Kiểm tra console logs trong AddEmployeeModal
3. Xem có thông báo "Employee added to group chat" không
4. Kiểm tra "Existing Chats" trong Business Group Chat Test

#### Bước 5: Test Chat
1. Sử dụng "Chat Test" component
2. Thử gửi tin nhắn
3. Kiểm tra real-time updates

#### Bước 6: Test Business Message Page
1. Mở trang `/business/message`
2. Kiểm tra xem có hiển thị business group chat không
3. Thử gửi tin nhắn trong group chat
4. Kiểm tra real-time updates
5. Đảm bảo không có lỗi Firestore undefined field

### 5. Console Logs cần kiểm tra

#### Khi tạo group chat:
```
Business group chat initialized successfully
```

#### Khi thêm employee:
```
Starting business group chat update for employee: [name]
Business name: [business_name]
Current employees (excluding admin): [employee_ids]
Creating/updating business group chat...
Adding new employee to group chat...
Found existing business group chat: [chat_id]
Current participants: [participants]
Adding employee: [employee_id]
Updating participants: [new_participants]
Successfully added employee to group chat and created notification message
Business group chat updated successfully
```

#### Khi gửi tin nhắn:
```
Found business group chat: [chat_id]
Message sent successfully
```

### 6. Common Issues và Solutions

#### Issue 1: Firebase không kết nối
**Symptoms:**
- FirebaseConnectionTest hiển thị "Connection Error"
- Console có lỗi Firebase

**Solutions:**
- Kiểm tra environment variables
- Kiểm tra Firebase project settings
- Đảm bảo domain được whitelist

#### Issue 2: Firestore write failed
**Symptoms:**
- FirebaseConnectionTest hiển thị "Firestore write failed"
- Không thể tạo group chat

**Solutions:**
- Kiểm tra Firestore rules (phải cho phép read/write)
- Kiểm tra Firebase project settings
- Đảm bảo collection permissions

#### Issue 3: Employee không được thêm vào group chat
**Symptoms:**
- Employee được thêm vào database nhưng không có trong group chat
- Console có lỗi khi thêm employee

**Solutions:**
- Kiểm tra businessId có đúng không
- Kiểm tra employee ID và name
- Đảm bảo group chat đã được tạo trước

#### Issue 4: Chat không hoạt động
**Symptoms:**
- Không thể gửi tin nhắn
- Không có real-time updates

**Solutions:**
- Kiểm tra chatRoomId có đúng không
- Kiểm tra Firestore rules cho messages
- Đảm bảo mock user được tạo

#### Issue 5: Firestore undefined field error
**Symptoms:**
- Console error: "Function addDoc() called with invalid data. Unsupported field value: undefined"
- Lỗi khi gửi tin nhắn hoặc tạo group chat

**Solutions:**
- Đảm bảo không truyền `undefined` values vào Firestore
- Sử dụng helper function `createSafeSenderInfo` để xử lý senderInfo
- Kiểm tra tất cả fields trước khi gửi đến Firestore

#### Issue 6: Business Message Page không hoạt động
**Symptoms:**
- Trang `/business/message` không hiển thị chat
- Không thể gửi tin nhắn trong business message page
- Lỗi khi load chat rooms

**Solutions:**
- Đảm bảo mock user được tạo khi component mount
- Kiểm tra `useFirebaseAuth` hook được import và sử dụng
- Đảm bảo `signInAnonymouslyIfNeeded()` được gọi trước khi thực hiện Firestore operations
- Kiểm tra `useFirestoreChat` hook đã được cập nhật với mock user support

#### Issue 7: Missing User hoặc Business Info
**Symptoms:**
- User ID không có giá trị
- Business Info không tồn tại
- Business ID không có giá trị
- Business group chat không được tạo

**Solutions:**
- Kiểm tra Redux store có user data không
- Kiểm tra API call `/business/me` có trả về business info không
- Đảm bảo user đã đăng nhập và có quyền truy cập business
- Kiểm tra business ID trong URL có đúng không
- Kiểm tra user có role business admin không

#### Issue 8: Maximum update depth exceeded (Infinite Loop)
**Symptoms:**
- Console error: "Maximum update depth exceeded"
- Component re-renders infinitely
- Browser becomes unresponsive

**Solutions:**
- Kiểm tra `useEffect` dependency arrays
- Đảm bảo không có function dependencies thay đổi mỗi lần render
- Sử dụng `useCallback` để stabilize functions
- Loại bỏ `signInAnonymouslyIfNeeded` khỏi dependency arrays nếu không cần thiết
- Kiểm tra `useFirebaseAuth` hook có stable functions không

### 7. Testing Checklist

- [ ] Firebase connection works
- [ ] Firestore write/read works
- [ ] Business group chat is created
- [ ] Employee is added to group chat
- [ ] Messages can be sent
- [ ] Real-time updates work
- [ ] No console errors

### 8. Performance Tips

1. **Sử dụng lazy loading** cho Firebase imports
2. **Cache business group chat ID** để tránh query nhiều lần
3. **Implement retry logic** cho failed operations
4. **Add loading states** cho better UX

### 9. Monitoring

Sử dụng Firebase Console để monitor:
- Firestore usage
- Error logs
- Performance metrics

### 10. Next Steps

Sau khi debug xong:
1. Remove test components
2. Implement proper error handling
3. Add loading states
4. Optimize performance
5. Add proper security rules (nếu cần)

### 11. Status Update - Business Message Page

**✅ Đã hoàn thành:**
- Tất cả các sửa đổi đã được áp dụng cho trang `/business/message`
- Mock user được tạo tự động khi component mount
- Infinite loop đã được khắc phục
- Firestore undefined field error đã được sửa
- Business group chat initialization đã được cải thiện
- Employee addition to group chat đã được sửa
- Real-time chat functionality đã được đảm bảo

**🎯 Kết quả mong đợi:**
- Trang `/business/message` hoạt động ổn định
- Business group chat được tạo và hiển thị
- Employee được thêm vào group chat khi thêm mới
- Chat messages được gửi và nhận real-time
- Không có lỗi console
- Performance tốt, không có infinite loops

### 12. Status Update - Business Dashboard Page

**🔧 Đã sửa chữa:**
- Thêm debug information để hiển thị trạng thái của trang
- Cải thiện error handling và logging
- Tạm thời loại bỏ BusinessGroupChatStatus khỏi HeaderBanner để tránh conflicts
- Thêm test component để xác nhận trang hoạt động
- Console logs chi tiết cho API calls

**🎯 Kết quả mong đợi:**
- Trang business dashboard load được
- Debug information hiển thị đầy đủ thông tin
- API calls được log chi tiết
- Error messages rõ ràng
- Test component xác nhận trang hoạt động

### 13. Status Update - Business Message Page Participants Fix

**🔧 Vấn đề đã phát hiện:**
- Business Message Page hiển thị sai số lượng participants (1 thay vì 4)
- Logic mapping chat rooms không xử lý đúng participants từ Firestore
- Không thể chat do logic xử lý participants bị lỗi
- Thanh nhập tin nhắn bị mất sau khi gửi tin nhắn

**🔧 Đã sửa chữa:**
- Sửa logic `mapChatRoomToChat` để sử dụng `participants` từ Firestore thay vì `participantUsers`
- Map participants với user info từ API (`allUsers`) để lấy thông tin đầy đủ
- Loại bỏ toàn bộ debug information và console logs
- Cải thiện logic rendering ChatRoom component để tránh re-render không cần thiết
- Loại bỏ `forceRefresh` mechanism để ổn định component
- Sử dụng `key={currentActiveChatId}` thay vì `key={currentActiveChatId}-${forceRefresh}`

**🎯 Kết quả mong đợi:**
- Business Message Page hiển thị đúng số lượng participants (4 thay vì 1)
- Chat functionality hoạt động bình thường
- Thanh nhập tin nhắn không bị mất sau khi gửi
- Giao diện sạch sẽ, không có debug information
- Performance tốt, không có re-render không cần thiết 