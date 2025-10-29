# Business Group Chat System

## Tổng quan

Hệ thống Business Group Chat tự động tạo và quản lý group chat cho mỗi doanh nghiệp, cho phép admin và employees giao tiếp trong một môi trường tập trung.

## Cách hoạt động

### 1. Tự động tạo Group Chat

- **Khi business dashboard được load lần đầu**: Hook `useBusinessGroupChat` sẽ tự động kiểm tra và tạo business group chat nếu chưa tồn tại
- **Khi thêm employee đầu tiên**: Nếu chưa có group chat, hệ thống sẽ tạo mới với admin và employee đầu tiên
- **Khi thêm employee tiếp theo**: Employee mới sẽ được thêm vào group chat hiện có

### 2. Cấu trúc Group Chat

```typescript
interface ChatRoom {
  id?: string;
  participants: string[];           // Danh sách user IDs
  participantUsers: any[];         // Thông tin chi tiết của users
  isGroup: boolean;                // Luôn là true cho business group
  groupName: string;               // Tên group (ví dụ: "Business Team")
  businessId: string;              // ID của business
  createdAt: Timestamp;            // Thời gian tạo
  lastMessageTime: Timestamp;      // Thời gian tin nhắn cuối
}
```

### 3. Tin nhắn tự động

- **Tin nhắn chào mừng**: Được tạo khi group chat mới được tạo
- **Tin nhắn thông báo**: Được tạo khi có employee mới được thêm vào

## Các thành phần chính

### 1. Hook: `useBusinessGroupChat`

```typescript
const { isInitialized, isLoading, error } = useBusinessGroupChat(businessId);
```

- Tự động khởi tạo business group chat
- Quản lý trạng thái loading và error
- Chỉ chạy một lần khi component mount

### 2. Functions trong `chat.ts`

- `getOrCreateBusinessGroupChat()`: Tạo hoặc lấy business group chat
- `addEmployeeToBusinessGroupChat()`: Thêm employee vào group chat

### 3. Components

- `BusinessGroupChatStatus`: Hiển thị trạng thái của group chat
- `EmployeeAddedNotification`: Thông báo khi employee được thêm vào group chat

## Luồng hoạt động

### Khi thêm Employee mới:

1. **Thêm employee** vào database thông qua API
2. **Kiểm tra group chat**: Nếu chưa có, tạo mới
3. **Thêm employee** vào group chat
4. **Tạo tin nhắn thông báo** về employee mới
5. **Hiển thị notification** thành công

### Khi load Business Dashboard:

1. **Hook tự động chạy** khi component mount
2. **Lấy thông tin business** và employees
3. **Tạo hoặc cập nhật** business group chat
4. **Cập nhật trạng thái** (isInitialized, error)

## Xử lý lỗi

- **Lỗi khởi tạo group chat**: Không block chức năng chính, chỉ log warning
- **Lỗi thêm employee**: Hiển thị cảnh báo nhưng vẫn thêm employee thành công
- **Retry mechanism**: Có thể thử lại thủ công nếu cần

## Cấu hình

### Environment Variables

```env
NEXT_PUBLIC_SERVER_URI=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
```

### Firebase Collections

- `chatRooms`: Lưu trữ thông tin group chat
- `chatRooms/{chatId}/messages`: Lưu trữ tin nhắn của từng group

## Troubleshooting

### Group Chat không được tạo

1. Kiểm tra Firebase connection
2. Kiểm tra business ID và user permissions
3. Kiểm tra console logs để debug

### Employee không được thêm vào Group Chat

1. Kiểm tra hàm `addEmployeeToBusinessGroupChat`
2. Kiểm tra business group chat đã tồn tại chưa
3. Kiểm tra employee ID và name có đúng không

### Performance Issues

1. Hook chỉ chạy một lần khi component mount
2. Sử dụng `useMemo` và `useCallback` nếu cần
3. Tránh gọi API không cần thiết

## Tương lai

- [ ] Thêm tính năng rời group chat
- [ ] Thêm tính năng quản lý quyền trong group
- [ ] Thêm tính năng pin tin nhắn quan trọng
- [ ] Thêm tính năng tìm kiếm tin nhắn
- [ ] Thêm tính năng export chat history 