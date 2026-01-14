import { useState } from 'react';
import { Button, Input, Textarea, Toggle, Card, CardBody } from '@/ui';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: false,
    push: false,
    sms: false,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
              />
              <Input
                type="email"
                label="Email"
                placeholder="john@example.com"
              />
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <Button>Save Changes</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <Toggle
                label="Email notifications"
                description="Receive email about your account activity"
                checked={notifications.email}
                onChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
              />
              <Toggle
                label="Push notifications"
                description="Receive push notifications on your devices"
                checked={notifications.push}
                onChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
              />
              <Toggle
                label="SMS notifications"
                description="Receive text messages about urgent updates"
                checked={notifications.sms}
                onChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
            <div className="border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="danger">Delete Account</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
