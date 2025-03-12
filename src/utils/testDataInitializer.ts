import { store } from "../store";

// 初始化测试数据
export const initTestEnvironment = () => {
  console.log("初始化测试环境数据...");

  // 检查当前用户是否为测试账号
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);

      if (user.phone === "root" || user.username === "测试账号") {
        console.log("检测到测试账号登录，初始化测试数据");

        // 定义联系人数据
        const mockContacts = [
          {
            id: "contact1",
            userId: "user1",
            user: {
              id: "user1",
              username: "张三",
              nickname: "张三",
              phone: "13800000001",
              email: "zhangsan@example.com",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              status: "online",
            },
            remark: "技术部张三",
            createdAt: "2023-01-01T00:00:00.000Z",
          },
          {
            id: "contact2",
            userId: "user2",
            user: {
              id: "user2",
              username: "李四",
              nickname: "李四",
              phone: "13800000002",
              email: "lisi@example.com",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              status: "offline",
            },
            createdAt: "2023-01-02T00:00:00.000Z",
          },
          {
            id: "contact3",
            userId: "user3",
            user: {
              id: "user3",
              username: "王五",
              nickname: "王五",
              phone: "13800000003",
              email: "wangwu@example.com",
              avatar: "https://randomuser.me/api/portraits/men/3.jpg",
              status: "online",
            },
            remark: "设计部王五",
            createdAt: "2023-01-03T00:00:00.000Z",
          },
        ];

        // 保存联系人数据到localStorage
        localStorage.setItem("contacts", JSON.stringify(mockContacts));

        // 创建个人资料数据
        const mockProfile = {
          id: 1001,
          nickname: user.nickname || "测试账号",
          gender: "male",
          birthday: Math.floor(new Date("1990-01-01").getTime() / 1000),
          location: "北京市",
          signature: "这是一个测试账号",
          avatar_url: user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
        };

        // 保存个人资料到localStorage
        localStorage.setItem("profile", JSON.stringify(mockProfile));

        // 如果有相应的reducer，分发数据到Redux
        try {
          const contactActions = require("../store/slices/contactSlice");
          if (contactActions && contactActions.setContacts) {
            store.dispatch(contactActions.setContacts(mockContacts));
          }
        } catch (error) {
          console.log("联系人Reducer未加载，仅使用localStorage");
        }
      }
    } catch (error) {
      console.error("初始化测试数据失败", error);
    }
  }
};
