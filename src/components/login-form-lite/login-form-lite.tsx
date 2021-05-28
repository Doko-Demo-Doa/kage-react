import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "~/components/login-form-lite/login-form-lite.scss";

export const LoginFormLite: React.FC = () => {
  return (
    <div className="login-form-lite">
      <p>
        Đăng nhập để đồng bộ dữ liệu với hệ thống của Dora, cũng như tải các file hình ảnh, âm thanh
        mẫu có trên hệ thống.
      </p>

      <Form name="login-form" className="login-form" initialValues={{ remember: true }}>
        <Form.Item name="email">
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            maxLength={70}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item name="password">
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            maxLength={70}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Đăng nhập
          </Button>
        </Form.Item>

        <a href="">Lấy lại mật khẩu</a>
      </Form>
    </div>
  );
};
